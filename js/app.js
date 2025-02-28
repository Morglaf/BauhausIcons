/**
 * Application principale du générateur d'icônes Bauhaus
 */

import { addBaseShape, addInnerElement } from './shapes.js';
import { 
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
    initLanguage
} from './ui.js';
import { 
    generateIconCode, 
    parseIconCode, 
    saveIcon, 
    getSavedIcons, 
    deleteIcon, 
    exportIconsToJSON 
} from './storage.js';
import { getTranslation } from './translations.js';

// Variables globales
let elements = [];
let nextId = 1;
let currentBaseShape = 'circle';
let currentBaseRoundness = 0;
let currentBaseRotation = 0;

// Initialiser l'application
function init() {
    // Initialiser les références DOM
    initDOMReferences();
    
    // Initialiser le thème et la langue
    initTheme();
    initLanguage();
    
    // Ajouter les écouteurs d'événements
    addEventListeners();
    
    // Mettre à jour l'aperçu initial
    updatePreview();
    
    // Afficher les icônes sauvegardées
    renderSavedIcons();
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
    // Forme de base
    document.getElementById('base-shape').addEventListener('change', function() {
        currentBaseShape = this.value;
        updatePreview();
    });
    
    // Arrondi de la forme de base
    document.getElementById('base-roundness').addEventListener('input', function() {
        currentBaseRoundness = updateBaseRoundnessValue();
        updatePreview();
    });
    
    // Rotation de la forme de base
    document.getElementById('base-rotation').addEventListener('input', function() {
        currentBaseRotation = updateBaseRotationValue();
        updatePreview();
    });
    
    // Ajouter un élément
    document.getElementById('add-element').addEventListener('click', function() {
        addElement();
    });
    
    // Exporter en SVG
    document.getElementById('export-svg').addEventListener('click', function() {
        exportSVG();
    });
    
    // Sauvegarder l'icône
    document.getElementById('save-icon').addEventListener('click', function() {
        handleSaveIcon(currentBaseShape, currentBaseRoundness, currentBaseRotation, elements);
    });
    
    // Charger une icône
    document.getElementById('load-icon').addEventListener('click', function() {
        handleLoadIcon(loadIconData);
    });
    
    // Exporter en JSON
    document.getElementById('export-json').addEventListener('click', function() {
        exportIconsToJSON();
    });
    
    // Importer depuis JSON
    document.getElementById('import-json').addEventListener('click', function() {
        handleImportJSON();
    });
    
    // Basculer le thème
    document.getElementById('theme-toggle').addEventListener('click', function() {
        toggleTheme();
    });
}

// Mettre à jour l'aperçu de l'icône
function updatePreview() {
    const iconPreview = document.getElementById('icon-preview');
    iconPreview.innerHTML = '';
    
    // Ajouter la forme de base
    addBaseShape(iconPreview, currentBaseShape, currentBaseRoundness, currentBaseRotation);
    
    // Ajouter les éléments intérieurs
    elements.forEach(element => {
        addInnerElement(iconPreview, element);
    });
    
    // Mettre à jour le code de l'icône
    updateIconCode(currentBaseShape, currentBaseRoundness, currentBaseRotation, elements);
}

// Ajouter un nouvel élément
function addElement() {
    const elementType = document.getElementById('element-type').value;
    
    const newElement = {
        id: nextId++,
        type: elementType,
        x: 50,
        y: 50,
        width: 30,
        height: 30,
        rotation: 0,
        roundness: 0
    };
    
    elements.push(newElement);
    
    // Mettre à jour l'interface
    renderElementsList(elements, updateElementProperty, removeElement);
    updatePreview();
}

// Mettre à jour une propriété d'un élément
function updateElementProperty(id, property, value, inputElement) {
    const element = elements.find(e => e.id === id);
    if (element) {
        element[property] = parseInt(value);
        
        // Mettre à jour l'affichage de la valeur
        if (inputElement && inputElement.nextElementSibling) {
            let displayText = value;
            
            if (property === 'rotation') {
                displayText += '°';
            } else if (property === 'roundness') {
                displayText += '%';
            } else if (property === 'x' || property === 'y') {
                displayText = property.toUpperCase() + ': ' + value;
            } else {
                displayText += '%';
            }
            
            inputElement.nextElementSibling.textContent = displayText;
        }
        
        updatePreview();
    }
}

// Supprimer un élément
function removeElement(id) {
    elements = elements.filter(e => e.id !== id);
    renderElementsList(elements, updateElementProperty, removeElement);
    updatePreview();
}

// Exporter l'icône en SVG
function exportSVG() {
    const svgElement = document.getElementById('icon-preview');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'bauhaus_icon.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Charger une icône sauvegardée
function loadSavedIcon(id) {
    const savedIcons = getSavedIcons();
    if (savedIcons[id]) {
        const iconCode = savedIcons[id].code;
        document.getElementById('icon-code').value = iconCode;
        loadIconData(parseIconCode(iconCode));
    }
}

// Supprimer une icône sauvegardée
function deleteSavedIcon(id) {
    if (confirm(getTranslation('confirmDelete'))) {
        deleteIcon(id);
        renderSavedIcons();
    }
}

// Charger les données d'une icône
function loadIconData(iconData) {
    currentBaseShape = iconData.baseShape;
    currentBaseRoundness = iconData.baseRoundness;
    currentBaseRotation = iconData.baseRotation || 0;
    elements = iconData.elements.map(e => ({ ...e }));
    nextId = elements.length > 0 ? Math.max(...elements.map(e => e.id)) + 1 : 1;
    
    // Mettre à jour l'interface
    document.getElementById('base-shape').value = currentBaseShape;
    document.getElementById('base-roundness').value = currentBaseRoundness;
    updateBaseRoundnessValue();
    
    document.getElementById('base-rotation').value = currentBaseRotation;
    updateBaseRotationValue();
    
    renderElementsList(elements, updateElementProperty, removeElement);
    updatePreview();
}

// Exposer les fonctions nécessaires à window pour les appels depuis le HTML
window.updateElementProperty = updateElementProperty;
window.removeElement = removeElement;
window.loadSavedIcon = loadSavedIcon;
window.deleteSavedIcon = deleteSavedIcon;

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', init); 