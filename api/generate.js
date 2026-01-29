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

    // Get uploaded file
    const imageFile = files.image[0];
    const fs = require('fs');
    const imageBuffer = fs.readFileSync(imageFile.path);

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

    // Embed image
    let image;
    const mimetype = imageFile.headers['content-type'];
    if (mimetype === 'image/png') {
      image = await pdfDoc.embedPng(imageBuffer);
    } else {
      image = await pdfDoc.embedJpg(imageBuffer);
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

    // Page 1: Front
    const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
    drawGrid(page1);

    // Page 2: Back (with transform and offsets)
    const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
    const offsetXPt = mmToPoints(settings.backsideOffsetX);
    const offsetYPt = mmToPoints(settings.backsideOffsetY);
    drawGrid(page2, offsetXPt, offsetYPt, settings.backsideTransform);

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Clean up temp file
    fs.unlinkSync(imageFile.path);

    // Send PDF
    const filename = `qr_duplex_${settings.paperSize}_${settings.rows}x${settings.cols}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message });
  }
};
