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
    status_upload_success: 'Image uploaded successfully!',
    // Presets
    presets_title: 'Printer Presets',
    select_preset: 'Select preset',
    preset_name: 'Preset name',
    save_preset: 'Save as preset',
    update_preset: 'Update preset',
    delete_preset: 'Delete preset',
    export_presets: 'Export presets',
    import_presets: 'Import presets',
    preset_saved: 'Preset saved!',
    preset_updated: 'Preset updated!',
    preset_deleted: 'Preset deleted!',
    presets_exported: 'Presets exported!',
    presets_imported: 'Presets imported!',
    preset_name_required: 'Preset name is required',
    default_preset_a4: 'Default A4 3x3',
    default_preset_a3: 'A3 6x3 Large',
    // Helper Tips
    helper_title: 'Print Assistant',
    flip_mode: 'I will print double-sided using',
    flip_short_edge: 'Flip on short edge',
    flip_long_edge: 'Flip on long edge',
    flip_auto: 'Auto-detect',
    helper_hint: 'Based on your selection, we recommend the backside transform below. Adjust if needed.',
    troubleshooting_title: 'Troubleshooting',
    trouble_mirrored: 'Back is mirrored → Try "Mirror Horizontally" or "Rotate 180° + Mirror H"',
    trouble_upside_down: 'Back is upside down → Try "Rotate 180°"',
    trouble_shifted: 'Back is shifted → Adjust Offset X/Y',
    // Calibration
    calibration_mode: 'Calibration Mode',
    calibration_hint: 'Generate a test pattern instead of QR codes to calibrate your printer alignment.'
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
    status_upload_success: '¡Imagen subida exitosamente!',
    // Presets
    presets_title: 'Ajustes de Impresora',
    select_preset: 'Seleccionar ajuste',
    preset_name: 'Nombre del ajuste',
    save_preset: 'Guardar como ajuste',
    update_preset: 'Actualizar ajuste',
    delete_preset: 'Eliminar ajuste',
    export_presets: 'Exportar ajustes',
    import_presets: 'Importar ajustes',
    preset_saved: '¡Ajuste guardado!',
    preset_updated: '¡Ajuste actualizado!',
    preset_deleted: '¡Ajuste eliminado!',
    presets_exported: '¡Ajustes exportados!',
    presets_imported: '¡Ajustes importados!',
    preset_name_required: 'El nombre del ajuste es obligatorio',
    default_preset_a4: 'A4 3x3 Por Defecto',
    default_preset_a3: 'A3 6x3 Grande',
    // Helper Tips
    helper_title: 'Asistente de Impresión',
    flip_mode: 'Imprimiré a doble cara usando',
    flip_short_edge: 'Voltear por el borde corto',
    flip_long_edge: 'Voltear por el borde largo',
    flip_auto: 'Detectar automáticamente',
    helper_hint: 'Según tu selección, recomendamos la transformación de reverso a continuación. Ajústala si es necesario.',
    troubleshooting_title: 'Solución de Problemas',
    trouble_mirrored: 'El reverso está en espejo → Prueba "Espejo Horizontal" o "Rotar 180° + Espejo H"',
    trouble_upside_down: 'El reverso está al revés → Prueba "Rotar 180°"',
    trouble_shifted: 'El reverso está desplazado → Ajusta Desplazamiento X/Y',
    // Calibration
    calibration_mode: 'Modo de Calibración',
    calibration_hint: 'Genera un patrón de prueba en lugar de códigos QR para calibrar la alineación de tu impresora.'
  }
};

// Current state
let currentLang = 'en';
let uploadedFile = null;
let userManuallyChangedTransform = false; // Track if user manually changed transform

// DOM elements
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const generateBtn = document.getElementById('generateBtn');
const status = document.getElementById('status');
const langEnBtn = document.getElementById('lang-en');
const langEsBtn = document.getElementById('lang-es');

// Preset elements
const presetSelect = document.getElementById('presetSelect');
const presetName = document.getElementById('presetName');
const savePresetBtn = document.getElementById('savePresetBtn');
const updatePresetBtn = document.getElementById('updatePresetBtn');
const deletePresetBtn = document.getElementById('deletePresetBtn');
const exportPresetsBtn = document.getElementById('exportPresetsBtn');
const importPresetsFile = document.getElementById('importPresetsFile');

// Helper elements
const flipMode = document.getElementById('flipMode');
const backsideTransform = document.getElementById('backsideTransform');
const orientation = document.getElementById('orientation');

// Calibration element
const calibrationMode = document.getElementById('calibrationMode');

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

// ========== PRESETS LOGIC ==========

const PRESETS_STORAGE_KEY = 'qrDuplexPresets_v1';

// Default built-in presets
function getDefaultPresets() {
  return [
    {
      name: i18n[currentLang].default_preset_a4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      values: {
        paperSize: 'A4',
        orientation: 'Portrait',
        rows: 3,
        cols: 3,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10,
        gutter: 8,
        cropMarks: true,
        backsideTransform: 'Rotate180',
        backsideOffsetX: 0,
        backsideOffsetY: 0,
        flipMode: 'auto'
      }
    },
    {
      name: i18n[currentLang].default_preset_a3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      values: {
        paperSize: 'A3',
        orientation: 'Landscape',
        rows: 3,
        cols: 6,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10,
        gutter: 8,
        cropMarks: true,
        backsideTransform: 'Rotate180',
        backsideOffsetX: 0,
        backsideOffsetY: 0,
        flipMode: 'auto'
      }
    }
  ];
}

// Load presets from localStorage
function loadPresets() {
  const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading presets:', e);
    }
  }
  // Return default presets if none exist
  const defaults = getDefaultPresets();
  savePresetsToStorage(defaults);
  return defaults;
}

// Save presets to localStorage
function savePresetsToStorage(presets) {
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
}

// Get current form values
function getCurrentSettings() {
  return {
    paperSize: document.getElementById('paperSize').value,
    orientation: document.getElementById('orientation').value,
    rows: parseInt(document.getElementById('rows').value),
    cols: parseInt(document.getElementById('cols').value),
    marginTop: parseFloat(document.getElementById('marginTop').value),
    marginRight: parseFloat(document.getElementById('marginRight').value),
    marginBottom: parseFloat(document.getElementById('marginBottom').value),
    marginLeft: parseFloat(document.getElementById('marginLeft').value),
    gutter: parseFloat(document.getElementById('gutter').value),
    cropMarks: document.getElementById('cropMarks').checked,
    backsideTransform: document.getElementById('backsideTransform').value,
    backsideOffsetX: parseFloat(document.getElementById('backsideOffsetX').value),
    backsideOffsetY: parseFloat(document.getElementById('backsideOffsetY').value),
    flipMode: document.getElementById('flipMode').value
  };
}

// Apply settings to form
function applySettings(settings) {
  document.getElementById('paperSize').value = settings.paperSize;
  document.getElementById('orientation').value = settings.orientation;
  document.getElementById('rows').value = settings.rows;
  document.getElementById('cols').value = settings.cols;
  document.getElementById('marginTop').value = settings.marginTop;
  document.getElementById('marginRight').value = settings.marginRight;
  document.getElementById('marginBottom').value = settings.marginBottom;
  document.getElementById('marginLeft').value = settings.marginLeft;
  document.getElementById('gutter').value = settings.gutter;
  document.getElementById('cropMarks').checked = settings.cropMarks;
  document.getElementById('backsideTransform').value = settings.backsideTransform;
  document.getElementById('backsideOffsetX').value = settings.backsideOffsetX;
  document.getElementById('backsideOffsetY').value = settings.backsideOffsetY;
  document.getElementById('flipMode').value = settings.flipMode || 'auto';
}

// Populate preset dropdown
function populatePresetDropdown() {
  const presets = loadPresets();
  presetSelect.innerHTML = '<option value="">-- Select preset --</option>';
  presets.forEach((preset, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = preset.name;
    presetSelect.appendChild(option);
  });
}

// Preset selection
presetSelect.addEventListener('change', (e) => {
  const index = e.target.value;
  if (index === '') return;

  const presets = loadPresets();
  const preset = presets[index];
  if (preset) {
    applySettings(preset.values);
    presetName.value = preset.name;
    userManuallyChangedTransform = false; // Reset flag when applying preset
  }
});

// Save preset
savePresetBtn.addEventListener('click', () => {
  const name = presetName.value.trim();
  if (!name) {
    showStatus(i18n[currentLang].preset_name_required, 'error');
    return;
  }

  const presets = loadPresets();
  const newPreset = {
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    values: getCurrentSettings()
  };

  presets.push(newPreset);
  savePresetsToStorage(presets);
  populatePresetDropdown();
  showStatus(i18n[currentLang].preset_saved, 'success');
});

// Update preset
updatePresetBtn.addEventListener('click', () => {
  const index = presetSelect.value;
  if (index === '') {
    showStatus(i18n[currentLang].select_preset, 'error');
    return;
  }

  const name = presetName.value.trim();
  if (!name) {
    showStatus(i18n[currentLang].preset_name_required, 'error');
    return;
  }

  const presets = loadPresets();
  presets[index].name = name;
  presets[index].updatedAt = new Date().toISOString();
  presets[index].values = getCurrentSettings();

  savePresetsToStorage(presets);
  populatePresetDropdown();
  showStatus(i18n[currentLang].preset_updated, 'success');
});

// Delete preset
deletePresetBtn.addEventListener('click', () => {
  const index = presetSelect.value;
  if (index === '') {
    showStatus(i18n[currentLang].select_preset, 'error');
    return;
  }

  const presets = loadPresets();
  presets.splice(index, 1);
  savePresetsToStorage(presets);
  populatePresetDropdown();
  presetSelect.value = '';
  presetName.value = '';
  showStatus(i18n[currentLang].preset_deleted, 'success');
});

// Export presets
exportPresetsBtn.addEventListener('click', () => {
  const presets = loadPresets();
  const json = JSON.stringify(presets, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr-duplex-presets.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showStatus(i18n[currentLang].presets_exported, 'success');
});

// Import presets
importPresetsFile.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const importedPresets = JSON.parse(text);

    if (!Array.isArray(importedPresets)) {
      throw new Error('Invalid preset file format');
    }

    const existingPresets = loadPresets();
    const existingNames = existingPresets.map(p => p.name);

    // Merge presets, avoiding name collisions
    importedPresets.forEach(preset => {
      let name = preset.name;
      let counter = 2;
      while (existingNames.includes(name)) {
        name = `${preset.name} (${counter})`;
        counter++;
      }
      preset.name = name;
      existingNames.push(name);
      existingPresets.push(preset);
    });

    savePresetsToStorage(existingPresets);
    populatePresetDropdown();
    showStatus(i18n[currentLang].presets_imported, 'success');
  } catch (error) {
    console.error('Import error:', error);
    showStatus(i18n[currentLang].status_error + error.message, 'error');
  }

  // Reset file input
  e.target.value = '';
});

// ========== HELPER TIPS LOGIC ==========

// Track manual changes to backside transform
backsideTransform.addEventListener('change', () => {
  userManuallyChangedTransform = true;
});

// Auto-recommend transform based on flip mode and orientation
function autoRecommendTransform() {
  if (userManuallyChangedTransform) return; // Don't override if user manually changed

  const currentOrientation = orientation.value;
  const currentFlipMode = flipMode.value;

  let recommendedTransform = 'Rotate180'; // Default

  // Portrait orientation
  if (currentOrientation === 'Portrait') {
    if (currentFlipMode === 'short') {
      recommendedTransform = 'Rotate180';
    } else if (currentFlipMode === 'long') {
      recommendedTransform = 'MirrorH';
    }
  }
  // Landscape orientation
  else if (currentOrientation === 'Landscape') {
    if (currentFlipMode === 'short') {
      recommendedTransform = 'MirrorH';
    } else if (currentFlipMode === 'long') {
      recommendedTransform = 'Rotate180';
    }
  }

  backsideTransform.value = recommendedTransform;
}

// Listen for changes to orientation and flip mode
flipMode.addEventListener('change', () => {
  userManuallyChangedTransform = false; // Reset flag when flip mode changes
  autoRecommendTransform();
});

orientation.addEventListener('change', () => {
  userManuallyChangedTransform = false; // Reset flag when orientation changes
  autoRecommendTransform();
});

// Image upload handling
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Store file for later
  uploadedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.innerHTML = `<img src="${e.target.result}" alt="QR Preview">`;
    preview.classList.add('has-image');
  };
  reader.readAsDataURL(file);

  // Enable generate button
  generateBtn.disabled = false;
  showStatus(i18n[currentLang].status_upload_success, 'success');
});

// Generate PDF
generateBtn.addEventListener('click', async () => {
  // Check if image is required (not in calibration mode)
  const isCalibrationMode = document.getElementById('calibrationMode').checked;
  if (!uploadedFile && !isCalibrationMode) {
    showStatus(i18n[currentLang].status_upload_image, 'error');
    return;
  }

  showStatus(i18n[currentLang].status_generating, 'info');
  generateBtn.disabled = true;

  // Collect settings
  const settings = {
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
    cropMarks: document.getElementById('cropMarks').checked,
    calibrationMode: document.getElementById('calibrationMode').checked
  };

  // Create FormData with both image and settings
  const formData = new FormData();
  if (uploadedFile) {
    formData.append('image', uploadedFile);
  }
  formData.append('settings', JSON.stringify(settings));

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || 'PDF generation failed';
      } catch {
        errorMessage = 'PDF generation failed';
      }
      throw new Error(errorMessage);
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

// Calibration mode checkbox - enable generate button even without image
calibrationMode.addEventListener('change', (e) => {
  if (e.target.checked) {
    generateBtn.disabled = false;
  } else {
    generateBtn.disabled = !uploadedFile;
  }
});

// Initialize
setLanguage('en');
populatePresetDropdown();
