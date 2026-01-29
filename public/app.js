// Internationalization dictionary
const i18n = {
  en: {
    title: 'QR Duplex Sheet Maker',
    upload_title: '1. Upload QR Image',
    upload_label: 'Choose PNG or JPG file',
    settings_title: '2. Page Settings',
    paper_size: 'Paper Size',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Landscape',
    rows: 'Rows',
    columns: 'Columns',
    margin_top: 'Margin Top (mm)',
    margin_right: 'Margin Right (mm)',
    margin_bottom: 'Margin Bottom (mm)',
    margin_left: 'Margin Left (mm)',
    gutter: 'Gutter Spacing (mm)',
    crop_marks: 'Crop Marks',
    duplex_title: '3. Duplex Backside Settings',
    calibration_note: 'Print double-sided and test "flip on short edge" vs "flip on long edge". Use Backside Transform + Offsets to calibrate: print on plain paper, hold to light, adjust, and repeat until aligned.',
    backside_transform: 'Backside Transform',
    transform_none: 'None',
    transform_mirror_h: 'Mirror Horizontally',
    transform_mirror_v: 'Mirror Vertically',
    transform_rotate_180: 'Rotate 180°',
    transform_rotate_mirror: 'Rotate 180° + Mirror H',
    backside_offset_x: 'Backside Offset X (mm)',
    backside_offset_y: 'Backside Offset Y (mm)',
    generate_pdf: 'Generate PDF',
    footer: 'Made with pdf-lib • Open Source',
    status_uploading: 'Uploading image...',
    status_generating: 'Generating PDF...',
    status_success: 'PDF downloaded successfully!',
    status_error: 'Error: ',
    status_upload_image: 'Please upload an image first',
    status_upload_success: 'Image uploaded successfully!'
  },
  es: {
    title: 'Creador de Hojas QR Dúplex',
    upload_title: '1. Subir Imagen QR',
    upload_label: 'Elegir archivo PNG o JPG',
    settings_title: '2. Configuración de Página',
    paper_size: 'Tamaño de Papel',
    orientation: 'Orientación',
    portrait: 'Vertical',
    landscape: 'Horizontal',
    rows: 'Filas',
    columns: 'Columnas',
    margin_top: 'Margen Superior (mm)',
    margin_right: 'Margen Derecho (mm)',
    margin_bottom: 'Margen Inferior (mm)',
    margin_left: 'Margen Izquierdo (mm)',
    gutter: 'Espaciado (mm)',
    crop_marks: 'Marcas de Corte',
    duplex_title: '3. Configuración de Reverso Dúplex',
    calibration_note: 'Imprime a doble cara y prueba "voltear en borde corto" vs "voltear en borde largo". Usa Transformación de Reverso + Desplazamientos para calibrar: imprime en papel normal, mira a contraluz, ajusta y repite hasta que estén alineados.',
    backside_transform: 'Transformación de Reverso',
    transform_none: 'Ninguna',
    transform_mirror_h: 'Espejo Horizontal',
    transform_mirror_v: 'Espejo Vertical',
    transform_rotate_180: 'Rotar 180°',
    transform_rotate_mirror: 'Rotar 180° + Espejo H',
    backside_offset_x: 'Desplazamiento X del Reverso (mm)',
    backside_offset_y: 'Desplazamiento Y del Reverso (mm)',
    generate_pdf: 'Generar PDF',
    footer: 'Hecho con pdf-lib • Código Abierto',
    status_uploading: 'Subiendo imagen...',
    status_generating: 'Generando PDF...',
    status_success: '¡PDF descargado exitosamente!',
    status_error: 'Error: ',
    status_upload_image: 'Por favor sube una imagen primero',
    status_upload_success: '¡Imagen subida exitosamente!'
  }
};

// Current state
let currentLang = 'en';
let uploadedImageId = null;

// DOM elements
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const generateBtn = document.getElementById('generateBtn');
const status = document.getElementById('status');
const langEnBtn = document.getElementById('lang-en');
const langEsBtn = document.getElementById('lang-es');

// Language switching
function setLanguage(lang) {
  currentLang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (i18n[lang][key]) {
      element.textContent = i18n[lang][key];
    }
  });

  // Update button states
  langEnBtn.classList.toggle('active', lang === 'en');
  langEsBtn.classList.toggle('active', lang === 'es');

  // Update document language
  document.documentElement.lang = lang;
}

langEnBtn.addEventListener('click', () => setLanguage('en'));
langEsBtn.addEventListener('click', () => setLanguage('es'));

// Image upload handling
imageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.innerHTML = `<img src="${e.target.result}" alt="QR Preview">`;
    preview.classList.add('has-image');
  };
  reader.readAsDataURL(file);

  // Upload to server
  showStatus(i18n[currentLang].status_uploading, 'info');

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    uploadedImageId = data.imageId;
    generateBtn.disabled = false;
    showStatus(i18n[currentLang].status_upload_success, 'success');
  } catch (error) {
    console.error('Upload error:', error);
    showStatus(i18n[currentLang].status_error + error.message, 'error');
    uploadedImageId = null;
    generateBtn.disabled = true;
  }
});

// Generate PDF
generateBtn.addEventListener('click', async () => {
  if (!uploadedImageId) {
    showStatus(i18n[currentLang].status_upload_image, 'error');
    return;
  }

  showStatus(i18n[currentLang].status_generating, 'info');
  generateBtn.disabled = true;

  // Collect settings
  const settings = {
    imageId: uploadedImageId,
    paperSize: document.getElementById('paperSize').value,
    orientation: document.getElementById('orientation').value,
    margins: {
      top: parseFloat(document.getElementById('marginTop').value),
      right: parseFloat(document.getElementById('marginRight').value),
      bottom: parseFloat(document.getElementById('marginBottom').value),
      left: parseFloat(document.getElementById('marginLeft').value)
    },
    gutter: parseFloat(document.getElementById('gutter').value),
    rows: parseInt(document.getElementById('rows').value),
    cols: parseInt(document.getElementById('cols').value),
    backsideTransform: document.getElementById('backsideTransform').value,
    backsideOffsetX: parseFloat(document.getElementById('backsideOffsetX').value),
    backsideOffsetY: parseFloat(document.getElementById('backsideOffsetY').value),
    cropMarks: document.getElementById('cropMarks').checked
  };

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'PDF generation failed');
    }

    // Download PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr_duplex_${settings.paperSize}_${settings.rows}x${settings.cols}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showStatus(i18n[currentLang].status_success, 'success');
  } catch (error) {
    console.error('Generation error:', error);
    showStatus(i18n[currentLang].status_error + error.message, 'error');
  } finally {
    generateBtn.disabled = false;
  }
});

// Status display helper
function showStatus(message, type = 'info') {
  status.textContent = message;
  status.className = `status ${type}`;
}

// Initialize
setLanguage('en');
