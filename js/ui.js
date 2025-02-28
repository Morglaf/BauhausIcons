/**
 * Fonctions pour la gestion de l'interface utilisateur
 */

import { generateIconCode, parseIconCode, saveIcon, getSavedIcons, deleteIcon, exportIconsToJSON, importIconsFromJSON } from './storage.js';
import { addBaseShape, addInnerElement } from './shapes.js';
import { getTranslation, setLanguage, getCurrentLanguage, getAvailableLanguages } from './translations.js';

// Variables pour les éléments du DOM
let baseShapeSelect;
let baseRoundnessSlider;
let baseRoundnessValue;
let baseRotationSlider;
let baseRotationValue;
let baseColorSelect;
let baseStrokeColorSelect;
let baseStrokeWidthInput;
let baseHasStrokeCheckbox;
let elementTypeSelect;
let elementColorSelect;
let elementStrokeColorSelect;
let elementStrokeWidthInput;
let elementHasStrokeCheckbox;
let addElementBtn;
let elementsList;
let iconPreview;
let exportSvgBtn;
let exportPngBtn;
let transparentBgCheckbox;
let iconCodeInput;
let saveIconBtn;
let loadIconBtn;
let exportJsonBtn;
let importJsonBtn;
let savedIconsList;
let themeToggleBtn;
let languageSelect;

// Initialiser les références aux éléments du DOM
function initDOMReferences() {
    baseShapeSelect = document.getElementById('base-shape');
    baseRoundnessSlider = document.getElementById('base-roundness');
    baseRoundnessValue = document.getElementById('base-roundness-value');
    baseRotationSlider = document.getElementById('base-rotation');
    baseRotationValue = document.getElementById('base-rotation-value');
    baseColorSelect = document.getElementById('base-color');
    baseStrokeColorSelect = document.getElementById('base-stroke-color');
    baseStrokeWidthInput = document.getElementById('base-stroke-width');
    baseHasStrokeCheckbox = document.getElementById('base-has-stroke');
    elementTypeSelect = document.getElementById('element-type');
    elementColorSelect = document.getElementById('element-color');
    elementStrokeColorSelect = document.getElementById('element-stroke-color');
    elementStrokeWidthInput = document.getElementById('element-stroke-width');
    elementHasStrokeCheckbox = document.getElementById('element-has-stroke');
    addElementBtn = document.getElementById('add-element');
    elementsList = document.getElementById('elements-list');
    iconPreview = document.getElementById('icon-preview');
    exportSvgBtn = document.getElementById('export-svg');
    exportPngBtn = document.getElementById('export-png');
    transparentBgCheckbox = document.getElementById('transparent-bg');
    iconCodeInput = document.getElementById('icon-code');
    saveIconBtn = document.getElementById('save-icon');
    loadIconBtn = document.getElementById('load-icon');
    exportJsonBtn = document.getElementById('export-json');
    importJsonBtn = document.getElementById('import-json');
    savedIconsList = document.getElementById('saved-icons-list');
    themeToggleBtn = document.getElementById('theme-toggle');
    languageSelect = document.getElementById('language-select');
    
    // Initialiser la grille
    initGrid();
}

// Initialiser la grille
function initGrid() {
    const showGridCheckbox = document.getElementById('show-grid');
    const previewContainer = document.querySelector('.preview-container');
    const showGridLabel = document.getElementById('show-grid-label');
    
    // Restaurer l'état de la grille
    const showGrid = localStorage.getItem('show_grid') === 'true';
    showGridCheckbox.checked = showGrid;
    if (showGrid) {
        previewContainer.classList.add('show-grid');
    }
    
    // Mettre à jour le texte du label
    showGridLabel.textContent = getTranslation('showGrid');
    
    // Gérer le changement d'état de la grille
    showGridCheckbox.addEventListener('change', function() {
        if (this.checked) {
            previewContainer.classList.add('show-grid');
        } else {
            previewContainer.classList.remove('show-grid');
        }
        localStorage.setItem('show_grid', this.checked);
    });
}

// Mettre à jour l'affichage de la valeur d'arrondi de base
function updateBaseRoundnessValue() {
    baseRoundnessValue.textContent = baseRoundnessSlider.value + '%';
    return parseInt(baseRoundnessSlider.value);
}

// Mettre à jour l'affichage de la valeur de rotation de base
function updateBaseRotationValue() {
    baseRotationValue.textContent = baseRotationSlider.value + '°';
    return parseInt(baseRotationSlider.value);
}

// Fonction pour réinitialiser l'icône
function resetIcon() {
    if (confirm(getTranslation('confirmReset'))) {
        // Réinitialiser les valeurs par défaut
        document.getElementById('base-shape').value = 'square';
        document.getElementById('base-roundness').value = 0;
        document.getElementById('base-rotation').value = 0;
        document.getElementById('base-color').value = 'black';
        document.getElementById('base-stroke-color').value = 'black';
        document.getElementById('base-stroke-width').value = 2;
        document.getElementById('base-has-stroke').checked = true;
        
        // Mettre à jour les valeurs affichées
        updateBaseRoundnessValue();
        updateBaseRotationValue();
        
        // Vider la liste des éléments
        return true;
    }
    return false;
}

// Mettre à jour la liste des éléments dans l'interface
function renderElementsList(elements, updateCallback, removeCallback) {
    const elementsList = document.getElementById('elements-list');
    elementsList.innerHTML = '';
    
    elements.forEach(element => {
        const elementItem = document.createElement('div');
        elementItem.className = 'element-item';
        
        // Titre de l'élément
        const elementTitle = document.createElement('div');
        elementTitle.className = 'element-title';
        elementTitle.textContent = `${getTranslation(element.type)} #${element.id + 1}`;
        elementItem.appendChild(elementTitle);
        
        // Contrôles de position X et Y
        const positionControls = document.createElement('div');
        positionControls.className = 'position-controls';
        
        // Contrôle X
        const xControl = document.createElement('div');
        xControl.className = 'numeric-control';
        
        const xLabel = document.createElement('label');
        xLabel.textContent = 'X:';
        xControl.appendChild(xLabel);
        
        const xInput = document.createElement('input');
        xInput.type = 'number';
        xInput.min = '0';
        xInput.max = '100';
        xInput.value = element.x;
        xInput.addEventListener('change', function() {
            updateCallback(element.id, 'x', parseInt(this.value), this);
        });
        xControl.appendChild(xInput);
        
        positionControls.appendChild(xControl);
        
        // Contrôle Y
        const yControl = document.createElement('div');
        yControl.className = 'numeric-control';
        
        const yLabel = document.createElement('label');
        yLabel.textContent = 'Y:';
        yControl.appendChild(yLabel);
        
        const yInput = document.createElement('input');
        yInput.type = 'number';
        yInput.min = '0';
        yInput.max = '100';
        yInput.value = element.y;
        yInput.addEventListener('change', function() {
            updateCallback(element.id, 'y', parseInt(this.value), this);
        });
        yControl.appendChild(yInput);
        
        positionControls.appendChild(yControl);
        
        elementItem.appendChild(positionControls);
        
        // Contrôles de taille (largeur et hauteur)
        const sizeControls = document.createElement('div');
        sizeControls.className = 'size-controls';
        
        // Contrôle de largeur
        const widthControl = document.createElement('div');
        widthControl.className = 'numeric-control';
        
        const widthLabel = document.createElement('label');
        widthLabel.textContent = getTranslation('width') + ':';
        widthControl.appendChild(widthLabel);
        
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.min = '5';
        widthInput.max = '100';
        widthInput.value = element.width;
        widthInput.addEventListener('change', function() {
            const newWidth = parseInt(this.value);
            updateCallback(element.id, 'width', newWidth, this);
            
            // Si c'est un cercle, mettre à jour la hauteur également
            if (element.type === 'circle' || element.type === 'circleOutline') {
                const heightInput = this.parentElement.parentElement.querySelector('input[type="number"]:nth-of-type(2)');
                if (heightInput) {
                    heightInput.value = newWidth;
                    updateCallback(element.id, 'height', newWidth, heightInput);
                }
            }
        });
        widthControl.appendChild(widthInput);
        
        sizeControls.appendChild(widthControl);
        
        // Contrôle de hauteur
        const heightControl = document.createElement('div');
        heightControl.className = 'numeric-control';
        
        const heightLabel = document.createElement('label');
        heightLabel.textContent = getTranslation('height') + ':';
        heightControl.appendChild(heightLabel);
        
        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.min = '5';
        heightInput.max = '100';
        heightInput.value = element.height;
        heightInput.addEventListener('change', function() {
            const newHeight = parseInt(this.value);
            updateCallback(element.id, 'height', newHeight, this);
            
            // Si c'est un cercle, mettre à jour la largeur également
            if (element.type === 'circle' || element.type === 'circleOutline') {
                const widthInput = this.parentElement.parentElement.querySelector('input[type="number"]:nth-of-type(1)');
                if (widthInput) {
                    widthInput.value = newHeight;
                    updateCallback(element.id, 'width', newHeight, widthInput);
                }
            }
        });
        heightControl.appendChild(heightInput);
        
        sizeControls.appendChild(heightControl);
        
        elementItem.appendChild(sizeControls);
        
        // Contrôle de rotation
        const rotationControl = document.createElement('div');
        rotationControl.className = 'slider-container';
        
        const rotationLabel = document.createElement('label');
        rotationLabel.textContent = getTranslation('rotation') + ':';
        rotationControl.appendChild(rotationLabel);
        
        const rotationSlider = document.createElement('input');
        rotationSlider.type = 'range';
        rotationSlider.min = '0';
        rotationSlider.max = '360';
        rotationSlider.value = element.rotation;
        rotationSlider.addEventListener('input', function() {
            updateCallback(element.id, 'rotation', parseInt(this.value), this);
            rotationValue.textContent = `${this.value}°`;
            
            // Mettre à jour l'input numérique
            if (rotationInput) {
                rotationInput.value = this.value;
            }
        });
        rotationControl.appendChild(rotationSlider);
        
        const rotationValue = document.createElement('span');
        rotationValue.textContent = `${element.rotation}°`;
        rotationControl.appendChild(rotationValue);
        
        // Ajout d'un input numérique pour la rotation
        const rotationNumericControl = document.createElement('div');
        rotationNumericControl.className = 'numeric-control';
        
        const rotationNumericLabel = document.createElement('label');
        rotationNumericLabel.textContent = getTranslation('rotation') + ':';
        rotationNumericControl.appendChild(rotationNumericLabel);
        
        const rotationInput = document.createElement('input');
        rotationInput.type = 'number';
        rotationInput.min = '0';
        rotationInput.max = '360';
        rotationInput.value = element.rotation;
        rotationInput.addEventListener('change', function() {
            const newRotation = parseInt(this.value);
            updateCallback(element.id, 'rotation', newRotation, this);
            
            // Mettre à jour le slider
            rotationSlider.value = newRotation;
            rotationValue.textContent = `${newRotation}°`;
        });
        rotationNumericControl.appendChild(rotationInput);
        
        elementItem.appendChild(rotationControl);
        elementItem.appendChild(rotationNumericControl);
        
        // Contrôles de l'élément (dupliquer, supprimer)
        const elementControls = document.createElement('div');
        elementControls.className = 'element-controls';
        
        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = getTranslation('duplicate');
        duplicateBtn.addEventListener('click', function() {
            window.duplicateElement(element.id);
        });
        elementControls.appendChild(duplicateBtn);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = getTranslation('remove');
        removeBtn.addEventListener('click', function() {
            removeCallback(element.id);
        });
        elementControls.appendChild(removeBtn);
        
        elementItem.appendChild(elementControls);
        
        elementsList.appendChild(elementItem);
    });
}

// Créer un aperçu miniature d'une icône à partir de son code
function createIconPreview(iconCode, size = 40) {
    const iconData = parseIconCode(iconCode);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.border = '1px solid #ddd';
    svg.style.borderRadius = '3px';
    svg.style.marginRight = '8px';
    svg.style.backgroundColor = 'white'; // Toujours blanc même en mode sombre
    
    // Ajouter la forme de base
    addBaseShape(svg, iconData.baseShape, iconData.baseRoundness, iconData.baseRotation, 
                iconData.baseColor, iconData.strokeColor, iconData.strokeWidth, iconData.hasStroke);
    
    // Ajouter les éléments intérieurs
    iconData.elements.forEach(element => {
        addInnerElement(svg, element);
    });
    
    return svg;
}

// Mettre à jour la liste des icônes sauvegardées
function renderSavedIcons(loadCallback) {
    const savedIcons = getSavedIcons();
    savedIconsList.innerHTML = '';
    
    if (Object.keys(savedIcons).length === 0) {
        savedIconsList.innerHTML = `<div class="saved-icon-item">${getTranslation('noSavedIcons')}</div>`;
        return;
    }
    
    // Trier les icônes par date (plus récentes en premier)
    const sortedIds = Object.keys(savedIcons).sort((a, b) => {
        return new Date(savedIcons[b].date) - new Date(savedIcons[a].date);
    });
    
    for (const id of sortedIds) {
        const icon = savedIcons[id];
        const date = new Date(icon.date).toLocaleDateString();
        
        const iconItem = document.createElement('div');
        iconItem.className = 'saved-icon-item';
        
        // Créer le conteneur pour l'aperçu et le texte
        const infoContainer = document.createElement('div');
        infoContainer.className = 'saved-icon-info';
        
        // Ajouter l'aperçu SVG
        try {
            const preview = createIconPreview(icon.code);
            infoContainer.appendChild(preview);
        } catch (error) {
            console.error('Erreur lors de la création de l\'aperçu:', error);
        }
        
        // Ajouter le texte
        const textSpan = document.createElement('span');
        textSpan.textContent = `${icon.name} (${date})`;
        infoContainer.appendChild(textSpan);
        
        iconItem.appendChild(infoContainer);
        
        // Ajouter les boutons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '5px';
        
        const loadButton = document.createElement('button');
        loadButton.textContent = getTranslation('load');
        loadButton.onclick = () => window.loadSavedIcon(id);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'remove-btn';
        deleteButton.onclick = () => window.deleteSavedIcon(id);
        
        buttonsDiv.appendChild(loadButton);
        buttonsDiv.appendChild(deleteButton);
        
        iconItem.appendChild(buttonsDiv);
        savedIconsList.appendChild(iconItem);
    }
}

// Gérer le clic sur le bouton de sauvegarde
function handleSaveIcon(baseShape, baseRoundness, baseRotation, elements, baseColor, strokeColor, strokeWidth, hasStroke) {
    const name = prompt(getTranslation('iconNamePrompt'));
    if (!name) return;
    
    const iconCode = generateIconCode(baseShape, baseRoundness, baseRotation, elements, baseColor, strokeColor, strokeWidth, hasStroke);
    saveIcon(name, iconCode);
    renderSavedIcons();
}

// Gérer le clic sur le bouton de chargement
function handleLoadIcon(updateUICallback) {
    const code = iconCodeInput.value.trim();
    if (!code) {
        alert(getTranslation('invalidCode'));
        return;
    }
    
    try {
        const iconData = parseIconCode(code);
        updateUICallback(iconData);
    } catch (error) {
        alert(getTranslation('invalidCode'));
        console.error(error);
    }
}

// Gérer le clic sur le bouton d'importation JSON
function handleImportJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
            const result = importIconsFromJSON(event.target.result);
            if (result) {
                alert(getTranslation('importSuccess'));
                renderSavedIcons();
            } else {
                alert(getTranslation('importError'));
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Mettre à jour le code de l'icône dans l'interface
function updateIconCode(baseShape, baseRoundness, baseRotation, elements, baseColor, strokeColor, strokeWidth, hasStroke) {
    const code = generateIconCode(baseShape, baseRoundness, baseRotation, elements, baseColor, strokeColor, strokeWidth, hasStroke);
    iconCodeInput.value = code;
}

// Basculer le thème (clair/sombre)
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Mettre à jour le texte du bouton
    if (themeToggleBtn) {
        themeToggleBtn.textContent = isDarkMode ? 
            getTranslation('lightMode') : 
            getTranslation('darkMode');
    }
    
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('dark_mode', isDarkMode ? 'true' : 'false');
}

// Initialiser le thème selon la préférence sauvegardée
function initTheme() {
    const savedTheme = localStorage.getItem('dark_mode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = getTranslation('lightMode');
        }
    } else {
        if (themeToggleBtn) {
            themeToggleBtn.textContent = getTranslation('darkMode');
        }
    }
}

// Changer la langue de l'interface
function changeLanguage(lang) {
    if (setLanguage(lang)) {
        // Sauvegarder la préférence dans localStorage
        localStorage.setItem('language', lang);
        
        // Recharger la page pour appliquer les changements
        window.location.reload();
    }
}

// Initialiser la langue selon la préférence sauvegardée
function initLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
    
    // Remplir le sélecteur de langue
    if (languageSelect) {
        const languages = getAvailableLanguages();
        const currentLang = getCurrentLanguage();
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang.toUpperCase();
            option.selected = lang === currentLang;
            languageSelect.appendChild(option);
        });
        
        // Ajouter l'événement de changement
        languageSelect.addEventListener('change', () => {
            changeLanguage(languageSelect.value);
        });
    }
    
    // Traduire l'interface
    translateUI();
}

// Traduire l'interface utilisateur
function translateUI() {
    // Titre de l'application
    document.getElementById('app-title').textContent = getTranslation('title');
    
    // Labels des contrôles de base
    document.getElementById('base-shape-label').textContent = getTranslation('baseShape');
    document.getElementById('base-roundness-label').textContent = getTranslation('roundness') + ':';
    document.getElementById('base-rotation-label').textContent = getTranslation('baseRotation') + ':';
    document.getElementById('base-color-label').textContent = getTranslation('baseColor') + ':';
    document.getElementById('base-stroke-color-label').textContent = getTranslation('strokeColor') + ':';
    document.getElementById('base-stroke-width-label').textContent = getTranslation('strokeWidth') + ':';
    document.getElementById('base-has-stroke-label').textContent = getTranslation('hasStroke');
    
    // Labels des éléments intérieurs
    document.getElementById('inner-elements-label').textContent = getTranslation('innerElements');
    document.getElementById('element-type-label').textContent = getTranslation('elementType');
    document.getElementById('element-color-label').textContent = getTranslation('elementColor') + ':';
    document.getElementById('element-stroke-color-label').textContent = getTranslation('strokeColor') + ':';
    document.getElementById('element-stroke-width-label').textContent = getTranslation('strokeWidth') + ':';
    document.getElementById('element-has-stroke-label').textContent = getTranslation('hasStroke');
    
    // Label de la grille
    document.getElementById('show-grid-label').textContent = getTranslation('showGrid');
    
    // Label du fond transparent
    document.getElementById('transparent-bg-label').textContent = getTranslation('transparentBg');
    
    // Boutons
    document.getElementById('add-element').textContent = getTranslation('add');
    document.getElementById('export-svg').textContent = getTranslation('exportSvg');
    document.getElementById('export-png').textContent = getTranslation('exportPng');
    document.getElementById('save-icon').textContent = getTranslation('save');
    document.getElementById('load-icon').textContent = getTranslation('load');
    document.getElementById('export-json').textContent = getTranslation('exportJson');
    document.getElementById('import-json').textContent = getTranslation('importJson');
    
    // Titres des sections
    document.getElementById('preview-label').textContent = getTranslation('preview');
    document.getElementById('saved-icons-label').textContent = getTranslation('savedIcons');
    
    // Options des sélecteurs
    translateSelectOptions(baseShapeSelect);
    translateSelectOptions(elementTypeSelect);
    translateSelectOptions(baseColorSelect);
    translateSelectOptions(elementColorSelect);
    translateSelectOptions(baseStrokeColorSelect);
    translateSelectOptions(elementStrokeColorSelect);
    
    // Placeholder du code
    iconCodeInput.placeholder = getTranslation('iconCode');
}

// Traduire les options d'un sélecteur
function translateSelectOptions(selectElement) {
    if (!selectElement) return;
    
    Array.from(selectElement.options).forEach(option => {
        option.textContent = getTranslation(option.value);
    });
}

// Exporter l'icône au format PNG
function exportPNG(svg, transparent = false) {
    // Créer un canvas temporaire
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 500; // Taille de l'image exportée
    
    canvas.width = size;
    canvas.height = size;
    
    // Remplir le fond si non transparent
    if (!transparent) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
    }
    
    // Convertir le SVG en image
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        
        // Télécharger l'image PNG
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'bauhaus_icon.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    img.src = url;
}

// Dupliquer un élément
function duplicateElement(element) {
    // Créer une copie de l'élément avec un nouvel ID
    const duplicate = { ...element };
    delete duplicate.id; // L'ID sera attribué par l'appelant
    
    // Décaler légèrement la position pour distinguer la copie
    duplicate.x = Math.min(100, duplicate.x + 10);
    duplicate.y = Math.min(100, duplicate.y + 10);
    
    return duplicate;
}

// Exporter les fonctions
export {
    initDOMReferences,
    updateBaseRoundnessValue,
    updateBaseRotationValue,
    renderElementsList,
    renderSavedIcons,
    handleSaveIcon,
    handleLoadIcon,
    handleImportJSON,
    updateIconCode,
    createIconPreview,
    exportPNG,
    duplicateElement,
    toggleTheme,
    initTheme,
    initLanguage,
    resetIcon,
    translateUI
}; 