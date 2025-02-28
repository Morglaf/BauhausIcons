/**
 * Fonctions pour la gestion du stockage des icônes
 */

// Clé de stockage dans le localStorage
const STORAGE_KEY = 'bauhaus_icons';

// Générer un code compact pour une icône
function generateIconCode(baseShape, baseRoundness, baseRotation, elements) {
    // Format: baseShape:roundness:rotation|elem1Type:x:y:w:h:r:rnd|elem2...
    let code = `${baseShape}:${baseRoundness}:${baseRotation}`;
    
    elements.forEach(elem => {
        code += `|${elem.type}:${elem.x}:${elem.y}:${elem.width}:${elem.height}:${elem.rotation}:${elem.roundness || 0}`;
    });
    
    return code;
}

// Analyser un code d'icône pour recréer l'objet
function parseIconCode(code) {
    const parts = code.split('|');
    const baseInfo = parts[0].split(':');
    
    const baseShape = baseInfo[0];
    const baseRoundness = parseInt(baseInfo[1]);
    // Gérer la compatibilité avec les anciens codes d'icône qui n'ont pas de rotation
    const baseRotation = baseInfo.length > 2 ? parseInt(baseInfo[2]) : 0;
    
    const elements = [];
    
    for (let i = 1; i < parts.length; i++) {
        const elemParts = parts[i].split(':');
        elements.push({
            id: i,
            type: elemParts[0],
            x: parseInt(elemParts[1]),
            y: parseInt(elemParts[2]),
            width: parseInt(elemParts[3]),
            height: parseInt(elemParts[4]),
            rotation: parseInt(elemParts[5]),
            roundness: parseInt(elemParts[6])
        });
    }
    
    return {
        baseShape,
        baseRoundness,
        baseRotation,
        elements
    };
}

// Sauvegarder une icône dans le localStorage
function saveIcon(name, iconCode) {
    let savedIcons = getSavedIcons();
    
    // Générer un ID unique
    const id = Date.now().toString();
    
    savedIcons[id] = {
        name,
        code: iconCode,
        date: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIcons));
    return id;
}

// Récupérer toutes les icônes sauvegardées
function getSavedIcons() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Supprimer une icône
function deleteIcon(id) {
    let savedIcons = getSavedIcons();
    
    if (savedIcons[id]) {
        delete savedIcons[id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIcons));
        return true;
    }
    
    return false;
}

// Exporter toutes les icônes dans un fichier JSON
function exportIconsToJSON() {
    const savedIcons = getSavedIcons();
    const dataStr = JSON.stringify(savedIcons, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bauhaus_icons.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Importer des icônes depuis un fichier JSON
function importIconsFromJSON(jsonData) {
    try {
        const importedIcons = JSON.parse(jsonData);
        let savedIcons = getSavedIcons();
        
        // Fusionner les icônes importées avec les existantes
        savedIcons = { ...savedIcons, ...importedIcons };
        
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