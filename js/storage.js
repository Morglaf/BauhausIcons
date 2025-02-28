/**
 * Fonctions pour la gestion du stockage des icônes
 */

// Clé de stockage dans le localStorage
const STORAGE_KEY = 'bauhaus_icons';

// Générer le code de l'icône à partir des paramètres
function generateIconCode(baseShape, baseRoundness, baseRotation, elements, baseColor = 'black', strokeColor = 'black', strokeWidth = 2, hasStroke = true) {
    // Format: baseShape:baseRoundness:baseRotation:baseColor:strokeColor:strokeWidth:hasStroke|elem1Type:x:y:w:h:r:rnd:color:strokeColor:strokeWidth:hasStroke|elem2...
    let code = `${baseShape}:${baseRoundness}:${baseRotation}:${baseColor}:${strokeColor}:${strokeWidth}:${hasStroke ? 1 : 0}`;
    
    elements.forEach(elem => {
        code += `|${elem.type}:${elem.x}:${elem.y}:${elem.width}:${elem.height}:${elem.rotation}:${elem.roundness || 0}:${elem.color || 'black'}:${elem.strokeColor || 'black'}:${elem.strokeWidth || 2}:${elem.hasStroke ? 1 : 0}`;
    });
    
    return code;
}

// Analyser le code de l'icône pour récupérer les paramètres
function parseIconCode(code) {
    const parts = code.split('|');
    const baseParts = parts[0].split(':');
    
    // Vérifier si le code contient des informations de contour
    const hasStrokeInfo = baseParts.length >= 7;
    const hasColorInfo = baseParts.length >= 4;
    
    const baseShape = baseParts[0];
    const baseRoundness = parseInt(baseParts[1]);
    const baseRotation = parseInt(baseParts[2]);
    const baseColor = hasColorInfo ? baseParts[3] : 'black';
    const strokeColor = hasStrokeInfo ? baseParts[4] : 'black';
    const strokeWidth = hasStrokeInfo ? parseInt(baseParts[5]) : 2;
    const hasStroke = hasStrokeInfo ? baseParts[6] === '1' : true;
    
    const elements = [];
    
    for (let i = 1; i < parts.length; i++) {
        const elemParts = parts[i].split(':');
        
        // Vérifier si l'élément contient des informations de contour
        const elemHasStrokeInfo = elemParts.length >= 11;
        const elemHasColorInfo = elemParts.length >= 8;
        
        elements.push({
            id: i - 1,
            type: elemParts[0],
            x: parseInt(elemParts[1]),
            y: parseInt(elemParts[2]),
            width: parseInt(elemParts[3]),
            height: parseInt(elemParts[4]),
            rotation: parseInt(elemParts[5]),
            roundness: parseInt(elemParts[6]),
            color: elemHasColorInfo ? elemParts[7] : 'black',
            strokeColor: elemHasStrokeInfo ? elemParts[8] : 'black',
            strokeWidth: elemHasStrokeInfo ? parseInt(elemParts[9]) : 2,
            hasStroke: elemHasStrokeInfo ? elemParts[10] === '1' : false
        });
    }
    
    return {
        baseShape,
        baseRoundness,
        baseRotation,
        baseColor,
        strokeColor,
        strokeWidth,
        hasStroke,
        elements
    };
}

// Sauvegarder une icône dans le localStorage
function saveIcon(name, code) {
    const savedIcons = getSavedIcons();
    const id = Date.now().toString();
    
    savedIcons[id] = {
        name,
        code,
        date: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIcons));
    return id;
}

// Récupérer toutes les icônes sauvegardées
function getSavedIcons() {
    const savedIcons = localStorage.getItem(STORAGE_KEY);
    return savedIcons ? JSON.parse(savedIcons) : {};
}

// Supprimer une icône
function deleteIcon(id) {
    const savedIcons = getSavedIcons();
    
    if (savedIcons[id]) {
        delete savedIcons[id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIcons));
        return true;
    }
    
    return false;
}

// Exporter les icônes au format JSON
function exportIconsToJSON() {
    const savedIcons = getSavedIcons();
    const jsonData = JSON.stringify(savedIcons, null, 2);
    
    // Créer un objet Blob pour le téléchargement
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement et cliquer dessus
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bauhaus_icons.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Libérer l'URL
    URL.revokeObjectURL(url);
}

// Importer des icônes depuis un fichier JSON
function importIconsFromJSON(jsonData) {
    try {
        const importedIcons = JSON.parse(jsonData);
        const savedIcons = getSavedIcons();
        
        // Fusionner les icônes importées avec les icônes existantes
        Object.assign(savedIcons, importedIcons);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIcons));
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'importation des icônes:', error);
        return false;
    }
}

// Exporter les fonctions
export { 
    generateIconCode, 
    parseIconCode, 
    saveIcon, 
    getSavedIcons, 
    deleteIcon, 
    exportIconsToJSON, 
    importIconsFromJSON 
};