/**
 * Fonctions pour la gestion du stockage des icônes
 */

// Générer le code de l'icône à partir des paramètres
function generateIconCode(baseShape, baseRoundness, baseRotation, elements) {
    // Vérifier les types d'éléments valides
    const validTypes = [
        'circle', 'circleOutline', 'square', 'diamond', 'triangle', 
        'line', 'cross', 'dot', 'arc', 'zigzag', 'hexagon', 'star', 'semicircle'
    ];
    
    // Filtrer les éléments avec des types valides
    const validElements = elements.filter(el => validTypes.includes(el.type));
    
    // Créer l'objet de données de l'icône
    const iconData = {
        baseShape,
        baseRoundness,
        baseRotation,
        elements: validElements.map(el => ({
            type: el.type,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation || 0,
            roundness: el.roundness || 0
        }))
    };
    
    // Convertir en JSON et encoder en base64
    return btoa(JSON.stringify(iconData));
}

// Analyser le code de l'icône
function parseIconCode(code) {
    try {
        // Décoder le base64 et parser le JSON
        const jsonData = atob(code);
        const iconData = JSON.parse(jsonData);
        
        // Vérifier la structure des données
        if (!iconData.baseShape || !Array.isArray(iconData.elements)) {
            throw new Error('Invalid icon data structure');
        }
        
        // Ajouter des valeurs par défaut si nécessaire
        iconData.baseRoundness = iconData.baseRoundness || 0;
        iconData.baseRotation = iconData.baseRotation || 0;
        
        // Vérifier et corriger les éléments
        iconData.elements = iconData.elements.map(el => ({
            type: el.type || 'circle',
            x: el.x || 50,
            y: el.y || 50,
            width: el.width || 30,
            height: el.height || 30,
            rotation: el.rotation || 0,
            roundness: el.roundness || 0
        }));
        
        return iconData;
    } catch (error) {
        console.error('Error parsing icon code:', error);
        throw new Error('Invalid icon code');
    }
}

// Sauvegarder une icône dans le stockage local
function saveIcon(name, code) {
    // Récupérer les icônes existantes
    const savedIcons = getSavedIcons();
    
    // Générer un ID unique
    const id = Date.now().toString();
    
    // Ajouter la nouvelle icône
    savedIcons[id] = {
        name,
        code,
        date: new Date().toISOString()
    };
    
    // Sauvegarder dans le stockage local
    localStorage.setItem('bauhaus_icons', JSON.stringify(savedIcons));
    
    return id;
}

// Récupérer les icônes sauvegardées
function getSavedIcons() {
    const savedIconsJson = localStorage.getItem('bauhaus_icons');
    
    if (savedIconsJson) {
        try {
            return JSON.parse(savedIconsJson);
        } catch (error) {
            console.error('Error parsing saved icons:', error);
            return {};
        }
    }
    
    return {};
}

// Supprimer une icône
function deleteIcon(id) {
    const savedIcons = getSavedIcons();
    
    if (savedIcons[id]) {
        delete savedIcons[id];
        localStorage.setItem('bauhaus_icons', JSON.stringify(savedIcons));
        return true;
    }
    
    return false;
}

// Exporter les icônes au format JSON
function exportIconsToJSON() {
    const savedIcons = getSavedIcons();
    
    if (Object.keys(savedIcons).length === 0) {
        alert('No saved icons to export');
        return;
    }
    
    const jsonData = JSON.stringify(savedIcons, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'bauhaus_icons.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Importer des icônes depuis un fichier JSON
function importIconsFromJSON(jsonData) {
    try {
        const importedIcons = JSON.parse(jsonData);
        const savedIcons = getSavedIcons();
        
        // Vérifier la structure des données importées
        let validIconsCount = 0;
        
        for (const id in importedIcons) {
            const icon = importedIcons[id];
            
            if (icon.name && icon.code) {
                // Vérifier que le code est valide
                try {
                    parseIconCode(icon.code);
                    
                    // Ajouter l'icône avec un nouvel ID
                    const newId = Date.now().toString() + validIconsCount;
                    savedIcons[newId] = {
                        name: icon.name,
                        code: icon.code,
                        date: icon.date || new Date().toISOString()
                    };
                    
                    validIconsCount++;
                } catch (error) {
                    console.warn('Skipping invalid icon:', icon.name);
                }
            }
        }
        
        if (validIconsCount > 0) {
            localStorage.setItem('bauhaus_icons', JSON.stringify(savedIcons));
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error importing icons:', error);
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