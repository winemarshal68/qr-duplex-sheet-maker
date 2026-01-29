# QR Duplex Sheet Maker

Generate duplex-ready PDF sheets with QR codes for double-sided printing. Includes print calibration options and bilingual Spanish/English UI.

## Features

- **Upload QR Images**: Support for PNG and JPG files
- **Flexible Page Settings**:
  - Paper sizes: A4, A3
  - Orientation: Portrait, Landscape
  - Customizable margins and gutter spacing
  - Adjustable rows and columns
- **Duplex Printing Support**:
  - 2-page PDF (front + back)
  - Multiple backside transforms (mirror, rotate, etc.)
  - Fine-tune offsets for perfect alignment
- **Crop Marks**: Optional crop marks for precise cutting
- **Bilingual UI**: Switch between English and Spanish

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/qr-duplex-sheet-maker.git
cd qr-duplex-sheet-maker
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Upload a QR image** (PNG or JPG)
2. **Configure page settings**:
   - Select paper size and orientation
   - Set margins and gutter spacing
   - Choose number of rows and columns
3. **Set duplex backside options**:
   - Choose a backside transform (default: Rotate 180°)
   - Adjust offsets if needed for printer calibration
4. **Generate PDF** and download

### Calibration Tips

For perfect double-sided alignment:
1. Print a test sheet on plain paper
2. Hold it up to the light to check alignment
3. Adjust the backside offsets accordingly
4. Test different "flip on short edge" vs "flip on long edge" settings
5. Repeat until aligned

## Tech Stack

- **Backend**: Node.js + Express
- **File Upload**: Multer
- **PDF Generation**: pdf-lib
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Project Structure

```
qr-duplex-sheet-maker/
├── server.js           # Express server
├── package.json        # Dependencies and scripts
├── public/
│   ├── index.html     # Main UI
│   ├── style.css      # Styling
│   └── app.js         # Client-side logic & i18n
├── .gitignore
└── README.md
```

## API Endpoints

### POST /api/upload
Upload a QR image.

**Request**: multipart/form-data with `image` field

**Response**:
```json
{
  "imageId": "img_0",
  "filename": "qr.png",
  "size": 12345
}
```

### POST /api/generate
Generate PDF with uploaded image.

**Request**:
```json
{
  "imageId": "img_0",
  "paperSize": "A4",
  "orientation": "Portrait",
  "margins": {
    "top": 10,
    "right": 10,
    "bottom": 10,
    "left": 10
  },
  "gutter": 8,
  "rows": 3,
  "cols": 3,
  "backsideTransform": "Rotate180",
  "backsideOffsetX": 0,
  "backsideOffsetY": 0,
  "cropMarks": true
}
```

**Response**: PDF file (application/pdf)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
