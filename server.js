const express = require('express');
const multer = require('multer');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

const app = express();
const PORT = 3000;

// In-memory storage for uploaded images
const uploadedImages = new Map();
let imageIdCounter = 0;

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPG images are allowed'));
    }
  }
});

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageId = `img_${imageIdCounter++}`;
    uploadedImages.set(imageId, {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname
    });

    // Clean up old images (keep last 100)
    if (uploadedImages.size > 100) {
      const firstKey = uploadedImages.keys().next().value;
      uploadedImages.delete(firstKey);
    }

    res.json({
      imageId,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      imageId,
      paperSize,
      orientation,
      margins,
      gutter,
      rows,
      cols,
      backsideTransform,
      backsideOffsetX,
      backsideOffsetY,
      cropMarks
    } = req.body;

    // Validate image exists
    const imageData = uploadedImages.get(imageId);
    if (!imageData) {
      return res.status(400).json({ error: 'Image not found' });
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();

    // Paper dimensions in mm
    const paperSizes = {
      A4: { width: 210, height: 297 },
      A3: { width: 297, height: 420 }
    };

    let paperDims = paperSizes[paperSize];
    if (orientation === 'Landscape') {
      paperDims = { width: paperDims.height, height: paperDims.width };
    }

    // Convert mm to points (1mm = 72/25.4 points)
    const mmToPoints = (mm) => mm * 72 / 25.4;

    const pageWidth = mmToPoints(paperDims.width);
    const pageHeight = mmToPoints(paperDims.height);

    // Embed image
    let image;
    if (imageData.mimetype === 'image/png') {
      image = await pdfDoc.embedPng(imageData.buffer);
    } else {
      image = await pdfDoc.embedJpg(imageData.buffer);
    }

    // Calculate layout
    const marginTop = mmToPoints(margins.top);
    const marginRight = mmToPoints(margins.right);
    const marginBottom = mmToPoints(margins.bottom);
    const marginLeft = mmToPoints(margins.left);
    const gutterPt = mmToPoints(gutter);

    const usableWidth = pageWidth - marginLeft - marginRight;
    const usableHeight = pageHeight - marginTop - marginBottom;

    const tileWidth = (usableWidth - (cols - 1) * gutterPt) / cols;
    const tileHeight = (usableHeight - (rows - 1) * gutterPt) / rows;
    const tileSize = Math.min(tileWidth, tileHeight);

    // Center the grid
    const gridWidth = cols * tileSize + (cols - 1) * gutterPt;
    const gridHeight = rows * tileSize + (rows - 1) * gutterPt;
    const startX = marginLeft + (usableWidth - gridWidth) / 2;
    const startY = marginBottom + (usableHeight - gridHeight) / 2;

    // Helper function to draw grid
    const drawGrid = (page, offsetX = 0, offsetY = 0, transform = 'None') => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + col * (tileSize + gutterPt) + offsetX;
          const y = startY + row * (tileSize + gutterPt) + offsetY;

          let imageOptions = {
            x,
            y,
            width: tileSize,
            height: tileSize
          };

          // Apply transformations for backside
          if (transform !== 'None') {
            const centerX = x + tileSize / 2;
            const centerY = y + tileSize / 2;

            switch (transform) {
              case 'MirrorH':
                // Mirror horizontally: flip around vertical axis
                page.drawImage(image, {
                  x: x + tileSize,
                  y,
                  width: -tileSize,
                  height: tileSize
                });
                continue;

              case 'MirrorV':
                // Mirror vertically: flip around horizontal axis
                page.drawImage(image, {
                  x,
                  y: y + tileSize,
                  width: tileSize,
                  height: -tileSize
                });
                continue;

              case 'Rotate180':
                // Rotate 180°: flip both dimensions
                page.drawImage(image, {
                  x: x + tileSize,
                  y: y + tileSize,
                  width: -tileSize,
                  height: -tileSize
                });
                continue;

              case 'Rotate180MirrorH':
                // Rotate 180° + Mirror H = just flip vertical
                page.drawImage(image, {
                  x,
                  y: y + tileSize,
                  width: tileSize,
                  height: -tileSize
                });
                continue;
            }
          }

          // Default: no transformation
          page.drawImage(image, imageOptions);

          // Draw crop marks if enabled
          if (cropMarks) {
            const cropMarkLength = mmToPoints(4);
            const cropMarkColor = rgb(0, 0, 0);
            const lineWidth = 0.5;

            // Top-left corner
            page.drawLine({
              start: { x: x - cropMarkLength, y },
              end: { x: x, y },
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
    const offsetXPt = mmToPoints(backsideOffsetX);
    const offsetYPt = mmToPoints(backsideOffsetY);
    drawGrid(page2, offsetXPt, offsetYPt, backsideTransform);

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Send PDF
    const filename = `qr_duplex_${paperSize}_${rows}x${cols}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`QR Duplex Sheet Maker running at http://localhost:${PORT}`);
});
