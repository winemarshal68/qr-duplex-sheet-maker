const { PDFDocument, rgb } = require('pdf-lib');
const multiparty = require('multiparty');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = new multiparty.Form();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Extract settings
    const settings = JSON.parse(fields.settings[0]);

    // ========== INPUT VALIDATION ==========
    // Validate rows and columns
    if (settings.rows < 1 || settings.rows > 12) {
      return res.status(400).json({ error: 'Rows must be between 1 and 12' });
    }
    if (settings.cols < 1 || settings.cols > 12) {
      return res.status(400).json({ error: 'Columns must be between 1 and 12' });
    }

    // Validate margins (0-30mm)
    const { margins } = settings;
    if (margins.top < 0 || margins.top > 30 ||
        margins.right < 0 || margins.right > 30 ||
        margins.bottom < 0 || margins.bottom > 30 ||
        margins.left < 0 || margins.left > 30) {
      return res.status(400).json({ error: 'Margins must be between 0 and 30mm' });
    }

    // Validate gutter (0-30mm)
    if (settings.gutter < 0 || settings.gutter > 30) {
      return res.status(400).json({ error: 'Gutter spacing must be between 0 and 30mm' });
    }

    // Validate offsets (-20 to +20mm)
    if (settings.backsideOffsetX < -20 || settings.backsideOffsetX > 20 ||
        settings.backsideOffsetY < -20 || settings.backsideOffsetY > 20) {
      return res.status(400).json({ error: 'Offsets must be between -20mm and +20mm' });
    }

    // Get uploaded file (optional in calibration mode)
    const fs = require('fs');
    let imageFile = null;
    let imageBuffer = null;
    let image = null;

    if (files.image && files.image[0]) {
      imageFile = files.image[0];

      // Validate file size (max 5MB)
      const fileSize = fs.statSync(imageFile.path).size;
      if (fileSize > 5 * 1024 * 1024) {
        fs.unlinkSync(imageFile.path); // Clean up
        return res.status(400).json({ error: 'File size must be less than 5MB' });
      }

      imageBuffer = fs.readFileSync(imageFile.path);
    } else if (!settings.calibrationMode) {
      // Image is required if not in calibration mode
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();

    // Paper dimensions in mm
    const paperSizes = {
      A4: { width: 210, height: 297 },
      A3: { width: 297, height: 420 }
    };

    let paperDims = paperSizes[settings.paperSize];
    if (settings.orientation === 'Landscape') {
      paperDims = { width: paperDims.height, height: paperDims.width };
    }

    // Convert mm to points (1mm = 72/25.4 points)
    const mmToPoints = (mm) => mm * 72 / 25.4;

    const pageWidth = mmToPoints(paperDims.width);
    const pageHeight = mmToPoints(paperDims.height);

    // Embed image (if provided)
    if (imageFile && imageBuffer) {
      const mimetype = imageFile.headers['content-type'];
      if (mimetype === 'image/png') {
        image = await pdfDoc.embedPng(imageBuffer);
      } else {
        image = await pdfDoc.embedJpg(imageBuffer);
      }
    }

    // Calculate layout
    const marginTop = mmToPoints(settings.margins.top);
    const marginRight = mmToPoints(settings.margins.right);
    const marginBottom = mmToPoints(settings.margins.bottom);
    const marginLeft = mmToPoints(settings.margins.left);
    const gutterPt = mmToPoints(settings.gutter);

    const usableWidth = pageWidth - marginLeft - marginRight;
    const usableHeight = pageHeight - marginTop - marginBottom;

    const tileWidth = (usableWidth - (settings.cols - 1) * gutterPt) / settings.cols;
    const tileHeight = (usableHeight - (settings.rows - 1) * gutterPt) / settings.rows;
    const tileSize = Math.min(tileWidth, tileHeight);

    // Center the grid
    const gridWidth = settings.cols * tileSize + (settings.cols - 1) * gutterPt;
    const gridHeight = settings.rows * tileSize + (settings.rows - 1) * gutterPt;
    const startX = marginLeft + (usableWidth - gridWidth) / 2;
    const startY = marginBottom + (usableHeight - gridHeight) / 2;

    // Helper function to draw grid
    const drawGrid = (page, offsetX = 0, offsetY = 0, transform = 'None') => {
      for (let row = 0; row < settings.rows; row++) {
        for (let col = 0; col < settings.cols; col++) {
          const x = startX + col * (tileSize + gutterPt) + offsetX;
          const y = startY + row * (tileSize + gutterPt) + offsetY;

          // Apply transformations for backside
          if (transform !== 'None') {
            switch (transform) {
              case 'MirrorH':
                page.drawImage(image, {
                  x: x + tileSize,
                  y,
                  width: -tileSize,
                  height: tileSize
                });
                break;

              case 'MirrorV':
                page.drawImage(image, {
                  x,
                  y: y + tileSize,
                  width: tileSize,
                  height: -tileSize
                });
                break;

              case 'Rotate180':
                page.drawImage(image, {
                  x: x + tileSize,
                  y: y + tileSize,
                  width: -tileSize,
                  height: -tileSize
                });
                break;

              case 'Rotate180MirrorH':
                page.drawImage(image, {
                  x,
                  y: y + tileSize,
                  width: tileSize,
                  height: -tileSize
                });
                break;

              default:
                page.drawImage(image, {
                  x,
                  y,
                  width: tileSize,
                  height: tileSize
                });
            }
          } else {
            // Default: no transformation
            page.drawImage(image, {
              x,
              y,
              width: tileSize,
              height: tileSize
            });
          }

          // Draw crop marks if enabled
          if (settings.cropMarks) {
            const cropMarkLength = mmToPoints(4);
            const cropMarkColor = rgb(0, 0, 0);
            const lineWidth = 0.5;

            // Top-left corner
            page.drawLine({
              start: { x: x - cropMarkLength, y },
              end: { x, y },
              thickness: lineWidth,
              color: cropMarkColor
            });
            page.drawLine({
              start: { x, y },
              end: { x, y: y + cropMarkLength },
              thickness: lineWidth,
              color: cropMarkColor
            });

            // Top-right corner
            page.drawLine({
              start: { x: x + tileSize, y },
              end: { x: x + tileSize + cropMarkLength, y },
              thickness: lineWidth,
              color: cropMarkColor
            });
            page.drawLine({
              start: { x: x + tileSize, y },
              end: { x: x + tileSize, y: y + cropMarkLength },
              thickness: lineWidth,
              color: cropMarkColor
            });

            // Bottom-left corner
            page.drawLine({
              start: { x: x - cropMarkLength, y: y + tileSize },
              end: { x, y: y + tileSize },
              thickness: lineWidth,
              color: cropMarkColor
            });
            page.drawLine({
              start: { x, y: y + tileSize },
              end: { x, y: y + tileSize - cropMarkLength },
              thickness: lineWidth,
              color: cropMarkColor
            });

            // Bottom-right corner
            page.drawLine({
              start: { x: x + tileSize, y: y + tileSize },
              end: { x: x + tileSize + cropMarkLength, y: y + tileSize },
              thickness: lineWidth,
              color: cropMarkColor
            });
            page.drawLine({
              start: { x: x + tileSize, y: y + tileSize },
              end: { x: x + tileSize, y: y + tileSize - cropMarkLength },
              thickness: lineWidth,
              color: cropMarkColor
            });
          }
        }
      }
    };

    // Helper function to draw calibration pattern
    const drawCalibrationPattern = (page, offsetX = 0, offsetY = 0, transform = 'None') => {
      const black = rgb(0, 0, 0);
      const gray = rgb(0.5, 0.5, 0.5);

      // Draw usable area border
      page.drawRectangle({
        x: marginLeft + offsetX,
        y: marginBottom + offsetY,
        width: usableWidth,
        height: usableHeight,
        borderColor: gray,
        borderWidth: 1
      });

      // Draw corner targets (large circles with crosshairs)
      const targetSize = mmToPoints(10);
      const corners = [
        { x: startX + offsetX, y: startY + offsetY, label: 'BL' }, // Bottom-left
        { x: startX + gridWidth + offsetX, y: startY + offsetY, label: 'BR' }, // Bottom-right
        { x: startX + offsetX, y: startY + gridHeight + offsetY, label: 'TL' }, // Top-left
        { x: startX + gridWidth + offsetX, y: startY + gridHeight + offsetY, label: 'TR' } // Top-right
      ];

      corners.forEach(corner => {
        // Draw circle
        page.drawCircle({
          x: corner.x,
          y: corner.y,
          size: targetSize / 2,
          borderColor: black,
          borderWidth: 2
        });

        // Draw crosshairs
        page.drawLine({
          start: { x: corner.x - targetSize, y: corner.y },
          end: { x: corner.x + targetSize, y: corner.y },
          thickness: 1,
          color: black
        });
        page.drawLine({
          start: { x: corner.x, y: corner.y - targetSize },
          end: { x: corner.x, y: corner.y + targetSize },
          thickness: 1,
          color: black
        });

        // Draw label
        page.drawText(corner.label, {
          x: corner.x - mmToPoints(3),
          y: corner.y - mmToPoints(2),
          size: 10,
          color: black
        });
      });

      // Draw grid pattern (3x3 calibration grid)
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const x = startX + col * (gridWidth / 3) + offsetX;
          const y = startY + row * (gridHeight / 3) + offsetY;
          const w = gridWidth / 3;
          const h = gridHeight / 3;

          // Draw cell border
          page.drawRectangle({
            x,
            y,
            width: w,
            height: h,
            borderColor: gray,
            borderWidth: 0.5
          });

          // Draw cell number
          const cellNum = row * 3 + col + 1;
          page.drawText(`${cellNum}`, {
            x: x + w / 2 - mmToPoints(2),
            y: y + h / 2 - mmToPoints(2),
            size: 16,
            color: black
          });

          // Draw crop marks if enabled
          if (settings.cropMarks) {
            const cropMarkLength = mmToPoints(4);
            const cropMarkColor = rgb(0, 0, 0);
            const lineWidth = 0.5;

            // Top-left corner
            page.drawLine({
              start: { x: x - cropMarkLength, y },
              end: { x, y },
              thickness: lineWidth,
              color: cropMarkColor
            });
            page.drawLine({
              start: { x, y },
              end: { x, y: y + cropMarkLength },
              thickness: lineWidth,
              color: cropMarkColor
            });

            // Top-right corner
            page.drawLine({
              start: { x: x + w, y },
              end: { x: x + w + cropMarkLength, y },
              thickness: lineWidth,
              color: cropMarkColor
            });
            page.drawLine({
              start: { x: x + w, y },
              end: { x: x + w, y: y + cropMarkLength },
              thickness: lineWidth,
              color: cropMarkColor
            });
          }
        }
      }

      // Draw center crosshair
      const centerX = startX + gridWidth / 2 + offsetX;
      const centerY = startY + gridHeight / 2 + offsetY;
      const crossSize = mmToPoints(15);

      page.drawLine({
        start: { x: centerX - crossSize, y: centerY },
        end: { x: centerX + crossSize, y: centerY },
        thickness: 2,
        color: black
      });
      page.drawLine({
        start: { x: centerX, y: centerY - crossSize },
        end: { x: centerX, y: centerY + crossSize },
        thickness: 2,
        color: black
      });

      // Add page label
      page.drawText(transform === 'None' ? 'FRONT' : 'BACK', {
        x: pageWidth / 2 - mmToPoints(8),
        y: pageHeight - mmToPoints(10),
        size: 14,
        color: black
      });
    };

    // Check calibration mode
    if (settings.calibrationMode) {
      // Generate calibration PDF
      const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
      drawCalibrationPattern(page1);

      const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
      const offsetXPt = mmToPoints(settings.backsideOffsetX);
      const offsetYPt = mmToPoints(settings.backsideOffsetY);
      drawCalibrationPattern(page2, offsetXPt, offsetYPt, settings.backsideTransform);
    } else {
      // Generate normal QR grid PDF
      const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
      drawGrid(page1);

      const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
      const offsetXPt = mmToPoints(settings.backsideOffsetX);
      const offsetYPt = mmToPoints(settings.backsideOffsetY);
      drawGrid(page2, offsetXPt, offsetYPt, settings.backsideTransform);
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Clean up temp file (if exists)
    if (imageFile && imageFile.path) {
      fs.unlinkSync(imageFile.path);
    }

    // Send PDF
    const filenamePrefix = settings.calibrationMode ? 'calibration' : 'qr_duplex';
    const filename = `${filenamePrefix}_${settings.paperSize}_${settings.rows}x${settings.cols}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message });
  }
};
