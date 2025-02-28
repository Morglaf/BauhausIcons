/**
 * Point d'entrée principal de l'application
 */

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
    exportPNG,
    duplicateElement,
    toggleTheme,
    initTheme,
    initLanguage,
    resetIcon
} from './ui.js';

import { addBaseShape, addInnerElement } from './shapes.js';
import { parseIconCode, exportIconsToJSON, deleteIcon } from './storage.js';

// Variables globales
let baseShape = 'square';
let baseRoundness = 0;
let baseRotation = 0;
let baseColor = 'black';
let strokeColor = 'black';
let strokeWidth = 2;
let hasStroke = true;
let elements = [];
let nextElementId = 0;

// Initialiser l'application
function initApp() {
    // Initialiser les références DOM
    initDOMReferences();
    
    // Initialiser le thème
    initTheme();
    
    // Initialiser la langue
    initLanguage();
    
    // Ajouter les écouteurs d'événements
    addEventListeners();
    
    // Rendre l'icône initiale
    renderIcon();
    
    // Rendre la liste des icônes sauvegardées
    renderSavedIcons();
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
    // Écouteurs pour la forme de base
    document.getElementById('base-shape').addEventListener('change', function() {
        baseShape = this.value;
        renderIcon();
    });
    
    document.getElementById('base-roundness').addEventListener('input', function() {
        baseRoundness = updateBaseRoundnessValue();
        renderIcon();
    });
    
    document.getElementById('base-rotation').addEventListener('input', function() {
        baseRotation = updateBaseRotationValue();
        renderIcon();
    });
    
    document.getElementById('base-color').addEventListener('change', function() {
        baseColor = this.value;
        renderIcon();
    });
    
    document.getElementById('base-stroke-color').addEventListener('change', function() {
        strokeColor = this.value;
        renderIcon();
    });
    
    document.getElementById('base-stroke-width').addEventListener('input', function() {
        strokeWidth = parseInt(this.value);
        renderIcon();
    });
    
    document.getElementById('base-has-stroke').addEventListener('change', function() {
        hasStroke = this.checked;
        renderIcon();
    });
    
    // Écouteurs pour les éléments intérieurs
    document.getElementById('add-element').addEventListener('click', function() {
        addElement();
    });
    
    // Écouteurs pour les boutons d'exportation et de sauvegarde
    document.getElementById('export-svg').addEventListener('click', function() {
        exportSVG();
    });
    
    document.getElementById('export-png').addEventListener('click', function() {
        const transparent = document.getElementById('transparent-bg').checked;
        exportPNG(document.getElementById('icon-preview').querySelector('svg'), transparent);
    });
    
    document.getElementById('save-icon').addEventListener('click', function() {
        handleSaveIcon(baseShape, baseRoundness, baseRotation, elements, baseColor, strokeColor, strokeWidth, hasStroke);
    });
    
    document.getElementById('load-icon').addEventListener('click', function() {
        handleLoadIcon(updateFromIconData);
    });
    
    document.getElementById('export-json').addEventListener('click', function() {
        exportIconsToJSON();
    });
    
    document.getElementById('import-json').addEventListener('click', function() {
        handleImportJSON();
    });
    
    // Écouteur pour le bouton de thème
    document.getElementById('theme-toggle').addEventListener('click', function() {
        toggleTheme();
    });
    
    // Écouteur pour le bouton de réinitialisation
    document.getElementById('reset-icon').addEventListener('click', function() {
        if (resetIcon()) {
            elements = [];
            nextElementId = 0;
            renderElementsList(elements, updateElementProperty, removeElement);
            renderIcon();
        }
    });
}

// Ajouter un nouvel élément
function addElement() {
    const type = document.getElementById('element-type').value;
    const color = document.getElementById('element-color').value;
    const elementStrokeColor = document.getElementById('element-stroke-color').value;
    const elementStrokeWidth = parseInt(document.getElementById('element-stroke-width').value);
    const elementHasStroke = document.getElementById('element-has-stroke').checked;
    
    const element = {
        id: nextElementId++,
        type: type,
        x: 50, // Centre par défaut
        y: 50, // Centre par défaut
        width: 30, // 30% de la largeur
        height: 30, // 30% de la hauteur
        rotation: 0,
        roundness: 0,
        color: color,
        strokeColor: elementStrokeColor,
        strokeWidth: elementStrokeWidth,
        hasStroke: elementHasStroke
    };
    
    elements.push(element);
    renderElementsList(elements, updateElementProperty, removeElement);
    renderIcon();
}

// Mettre à jour une propriété d'un élément
function updateElementProperty(id, property, value, inputElement) {
    const element = elements.find(e => e.id === id);
    if (!element) return;
    
    if (property === 'color' || property === 'strokeColor' || property === 'hasStroke') {
        element[property] = value;
    } else {
        element[property] = parseInt(value);
    }
    
    // Si c'est un cercle et qu'on modifie la largeur ou la hauteur, synchroniser les deux
    if ((element.type === 'circle' || element.type === 'circleOutline') && (property === 'width' || property === 'height')) {
        if (property === 'width') {
            element.height = element.width;
        } else {
            element.width = element.height;
        }
    }
    
    // Mettre à jour l'affichage de la valeur si nécessaire
    if (inputElement && inputElement.nextElementSibling) {
        if (property === 'x' || property === 'y') {
            inputElement.nextElementSibling.textContent = `${property.toUpperCase()}: ${value}`;
        } else if (property === 'width' || property === 'height') {
            inputElement.nextElementSibling.textContent = `${value}%`;
        } else if (property === 'rotation') {
            inputElement.nextElementSibling.textContent = `${value}°`;
        } else if (property === 'roundness') {
            inputElement.nextElementSibling.textContent = `${value}%`;
        }
    }
    
    renderIcon();
}

// Supprimer un élément
function removeElement(id) {
    elements = elements.filter(e => e.id !== id);
    renderElementsList(elements, updateElementProperty, removeElement);
    renderIcon();
}

// Dupliquer un élément existant
function duplicateElementById(id) {
    const element = elements.find(e => e.id === id);
    if (!element) return;
    
    const newElement = duplicateElement(element);
    newElement.id = nextElementId++;
    
    elements.push(newElement);
    renderElementsList(elements, updateElementProperty, removeElement);
    renderIcon();
}

// Rendre l'icône dans l'aperçu
function renderIcon() {
    const iconPreview = document.getElementById('icon-preview');
    iconPreview.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '180');
    svg.setAttribute('height', '180');
    svg.setAttribute('viewBox', '0 0 100 100');
    
    // Ajouter la forme de base
    addBaseShape(svg, baseShape, baseRoundness, baseRotation, baseColor, strokeColor, strokeWidth, hasStroke);
    
    // Ajouter les éléments intérieurs
    elements.forEach(element => {
        addInnerElement(svg, element);
    });
    
    iconPreview.appendChild(svg);
    
    // Mettre à jour le code de l'icône
    updateIconCode(baseShape, baseRoundness, baseRotation, elements, baseColor, strokeColor, strokeWidth, hasStroke);
}

// Exporter l'icône au format SVG
function exportSVG() {
    const svg = document.getElementById('icon-preview').querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'bauhaus_icon.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    URL.revokeObjectURL(svgUrl);
}

// Mettre à jour l'interface à partir des données d'une icône
function updateFromIconData(iconData) {
    baseShape = iconData.baseShape;
    baseRoundness = iconData.baseRoundness;
    baseRotation = iconData.baseRotation;
    baseColor = iconData.baseColor || 'black';
    strokeColor = iconData.strokeColor || 'black';
    strokeWidth = iconData.strokeWidth || 2;
    hasStroke = iconData.hasStroke !== undefined ? iconData.hasStroke : true;
    
    elements = iconData.elements.map((elem, index) => ({
        ...elem,
        id: index
    }));
    nextElementId = elements.length;
    
    // Mettre à jour les contrôles de l'interface
    document.getElementById('base-shape').value = baseShape;
    document.getElementById('base-roundness').value = baseRoundness;
    document.getElementById('base-rotation').value = baseRotation;
    document.getElementById('base-color').value = baseColor;
    document.getElementById('base-stroke-color').value = strokeColor;
    document.getElementById('base-stroke-width').value = strokeWidth;
    document.getElementById('base-has-stroke').checked = hasStroke;
    
    updateBaseRoundnessValue();
    updateBaseRotationValue();
    
    renderElementsList(elements, updateElementProperty, removeElement);
    renderIcon();
}

// Charger une icône sauvegardée
function loadSavedIcon(id) {
    const savedIcons = JSON.parse(localStorage.getItem('bauhaus_icons') || '{}');
    const icon = savedIcons[id];
    
    if (icon) {
        const iconData = parseIconCode(icon.code);
        updateFromIconData(iconData);
    }
}

// Supprimer une icône sauvegardée
function deleteSavedIcon(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette icône ?')) {
        deleteIcon(id);
        renderSavedIcons();
    }
}

// Exposer les fonctions nécessaires à window pour les appels depuis le HTML
window.updateElementProperty = updateElementProperty;
window.removeElement = removeElement;
window.duplicateElement = duplicateElementById;
window.loadSavedIcon = loadSavedIcon;
window.deleteSavedIcon = deleteSavedIcon;

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', initApp); 