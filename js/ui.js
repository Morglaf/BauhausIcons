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
let elementTypeSelect;
let addElementBtn;
let elementsList;
let iconPreview;
let exportSvgBtn;
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
    elementTypeSelect = document.getElementById('element-type');
    addElementBtn = document.getElementById('add-element');
    elementsList = document.getElementById('elements-list');
    iconPreview = document.getElementById('icon-preview');
    exportSvgBtn = document.getElementById('export-svg');
    iconCodeInput = document.getElementById('icon-code');
    saveIconBtn = document.getElementById('save-icon');
    loadIconBtn = document.getElementById('load-icon');
    exportJsonBtn = document.getElementById('export-json');
    importJsonBtn = document.getElementById('import-json');
    savedIconsList = document.getElementById('saved-icons-list');
    themeToggleBtn = document.getElementById('theme-toggle');
    languageSelect = document.getElementById('language-select');
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

// Mettre à jour la liste des éléments dans l'interface
function renderElementsList(elements, updateCallback, removeCallback) {
    elementsList.innerHTML = '';
    
    elements.forEach(element => {
        const elementItem = document.createElement('div');
        elementItem.className = 'element-item';
        
        const innerHTML = `
            <div class="compact-row">
                <div>
                    <label>${getTranslation(element.type)}</label>
                    <input type="range" min="0" max="100" value="${element.x}" 
                           onchange="window.updateElementProperty(${element.id}, 'x', this.value, this)">
                    <span>X: ${element.x}</span>
                </div>
                <div>
                    <label>Y</label>
                    <input type="range" min="0" max="100" value="${element.y}" 
                           onchange="window.updateElementProperty(${element.id}, 'y', this.value, this)">
                    <span>Y: ${element.y}</span>
                </div>
            </div>
            <div class="compact-row">
                <div>
                    <label>${getTranslation('width')}</label>
                    <input type="range" min="5" max="90" value="${element.width}" 
                           onchange="window.updateElementProperty(${element.id}, 'width', this.value, this)">
                    <span>${element.width}%</span>
                </div>
                <div>
                    <label>${getTranslation('height')}</label>
                    <input type="range" min="5" max="90" value="${element.height}" 
                           onchange="window.updateElementProperty(${element.id}, 'height', this.value, this)">
                    <span>${element.height}%</span>
                </div>
            </div>
            <div class="compact-row">
                <div>
                    <label>${getTranslation('rotation')}</label>
                    <input type="range" min="0" max="360" value="${element.rotation}" 
                           onchange="window.updateElementProperty(${element.id}, 'rotation', this.value, this)">
                    <span>${element.rotation}°</span>
                </div>
                <div>
                    <label>${getTranslation('roundness')}</label>
                    <input type="range" min="0" max="50" value="${element.roundness || 0}" 
                           onchange="window.updateElementProperty(${element.id}, 'roundness', this.value, this)">
                    <span>${element.roundness || 0}%</span>
                </div>
            </div>
            <div class="element-controls">
                <button onclick="window.removeElement(${element.id});">${getTranslation('remove')}</button>
            </div>
        `;
        
        elementItem.innerHTML = innerHTML;
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
    addBaseShape(svg, iconData.baseShape, iconData.baseRoundness, iconData.baseRotation);
    
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
    
    for (const id in savedIcons) {
        const icon = savedIcons[id];
        const date = new Date(icon.date).toLocaleDateString();
        
        const iconItem = document.createElement('div');
        iconItem.className = 'saved-icon-item';
        
        // Créer le conteneur pour l'aperçu et le texte
        const infoContainer = document.createElement('div');
        infoContainer.className = 'saved-icon-info';
        infoContainer.style.display = 'flex';
        infoContainer.style.alignItems = 'center';
        
        // Ajouter l'aperçu SVG
        const preview = createIconPreview(icon.code);
        infoContainer.appendChild(preview);
        
        // Ajouter le texte
        const textSpan = document.createElement('span');
        textSpan.textContent = `${icon.name} (${date})`;
        infoContainer.appendChild(textSpan);
        
        iconItem.appendChild(infoContainer);
        
        // Ajouter les boutons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.innerHTML = `
            <button onclick="window.loadSavedIcon('${id}')">${getTranslation('load')}</button>
            <button onclick="window.deleteSavedIcon('${id}')" class="remove-btn">X</button>
        `;
        
        iconItem.appendChild(buttonsDiv);
        savedIconsList.appendChild(iconItem);
    }
}

// Gérer le clic sur le bouton de sauvegarde
function handleSaveIcon(baseShape, baseRoundness, baseRotation, elements) {
    const name = prompt(getTranslation('iconNamePrompt'));
    if (!name) return;
    
    const iconCode = generateIconCode(baseShape, baseRoundness, baseRotation, elements);
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
function updateIconCode(baseShape, baseRoundness, baseRotation, elements) {
    const code = generateIconCode(baseShape, baseRoundness, baseRotation, elements);
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
    
    // Labels des éléments intérieurs
    document.getElementById('inner-elements-label').textContent = getTranslation('innerElements');
    document.getElementById('element-type-label').textContent = getTranslation('elementType');
    
    // Boutons
    document.getElementById('add-element').textContent = getTranslation('add');
    document.getElementById('export-svg').textContent = getTranslation('exportSvg');
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
    toggleTheme,
    initTheme,
    initLanguage,
    translateUI
}; 