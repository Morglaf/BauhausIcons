// Éléments du DOM
const baseShapeSelect = document.getElementById('base-shape');
const elementTypeSelect = document.getElementById('element-type');
const addElementBtn = document.getElementById('add-element');
const elementsList = document.getElementById('elements-list');
const iconPreview = document.getElementById('icon-preview');
const exportSvgBtn = document.getElementById('export-svg');
const roundedCornersCheckbox = document.getElementById('rounded-corners');
const roundnessContainer = document.getElementById('roundness-container');
const roundnessSlider = document.getElementById('roundness');
const roundnessValue = document.getElementById('roundness-value');
const elementRoundedCheckbox = document.getElementById('element-rounded');

// Variables globales
let elements = [];
let nextId = 1;

// Initialisation
function init() {
    // Ajouter les écouteurs d'événements
    baseShapeSelect.addEventListener('change', updatePreview);
    addElementBtn.addEventListener('click', addElement);
    exportSvgBtn.addEventListener('click', exportSvg);
    roundedCornersCheckbox.addEventListener('change', toggleRoundnessControls);
    roundnessSlider.addEventListener('input', updateRoundnessValue);
    
    // Premier rendu
    updatePreview();
}

// Afficher/masquer les contrôles d'arrondi
function toggleRoundnessControls() {
    roundnessContainer.style.display = roundedCornersCheckbox.checked ? 'block' : 'none';
    updatePreview();
}

// Mettre à jour l'affichage de la valeur d'arrondi
function updateRoundnessValue() {
    roundnessValue.textContent = roundnessSlider.value + '%';
    updatePreview();
}

// Ajouter un nouvel élément intérieur
function addElement() {
    const type = elementTypeSelect.value;
    const element = {
        id: nextId++,
        type: type,
        x: 50, // Position par défaut au centre
        y: 50,
        width: 20,
        height: 20,
        rotation: 0,
        rounded: elementRoundedCheckbox.checked
    };
    
    elements.push(element);
    renderElementsList();
    updatePreview();
}

// Mettre à jour la liste des éléments dans l'interface
function renderElementsList() {
    elementsList.innerHTML = '';
    
    elements.forEach(element => {
        const elementItem = document.createElement('div');
        elementItem.className = 'element-item';
        
        let innerHTML = `
            <div>
                <label>Type: ${element.type}${element.rounded ? ' (arrondi)' : ''}</label>
            </div>
            <div class="compact-row">
                <div>
                    <label>Position X:</label>
                    <input type="range" min="0" max="100" value="${element.x}" 
                           onchange="updateElementProperty(${element.id}, 'x', this.value, this)">
                    <span>${element.x}%</span>
                </div>
                <div>
                    <label>Position Y:</label>
                    <input type="range" min="0" max="100" value="${element.y}" 
                           onchange="updateElementProperty(${element.id}, 'y', this.value, this)">
                    <span>${element.y}%</span>
                </div>
            </div>
            <div class="compact-row">
                <div>
                    <label>Largeur:</label>
                    <input type="range" min="5" max="90" value="${element.width}" 
                           onchange="updateElementProperty(${element.id}, 'width', this.value, this)">
                    <span>${element.width}%</span>
                </div>
                <div>
                    <label>Hauteur:</label>
                    <input type="range" min="5" max="90" value="${element.height}" 
                           onchange="updateElementProperty(${element.id}, 'height', this.value, this)">
                    <span>${element.height}%</span>
                </div>
            </div>
            <div>
                <label>Rotation:</label>
                <input type="range" min="0" max="360" value="${element.rotation}" 
                       onchange="updateElementProperty(${element.id}, 'rotation', this.value, this)">
                <span>${element.rotation}°</span>
            </div>`;
            
        if (element.rounded) {
            innerHTML += `
            <div>
                <label>Arrondi:</label>
                <input type="range" min="0" max="50" value="${element.roundness || 10}" 
                       onchange="updateElementProperty(${element.id}, 'roundness', this.value, this)">
                <span>${element.roundness || 10}%</span>
            </div>`;
        }
        
        innerHTML += `
            <div class="element-controls">
                <button onclick="removeElement(${element.id});" class="remove-btn">Supprimer</button>
            </div>
        `;
        
        elementItem.innerHTML = innerHTML;
        elementsList.appendChild(elementItem);
    });
}

// Mettre à jour une propriété d'un élément
function updateElementProperty(id, property, value, inputElement) {
    const element = elements.find(el => el.id === id);
    if (element) {
        element[property] = parseInt(value);
        
        // Mettre à jour l'affichage de la valeur
        const span = inputElement.nextElementSibling;
        const unit = property === 'rotation' ? '°' : '%';
        span.textContent = value + unit;
        
        updatePreview();
    }
}

// Supprimer un élément
function removeElement(id) {
    elements = elements.filter(el => el.id !== id);
    renderElementsList();
    updatePreview();
}

// Mettre à jour l'aperçu SVG
function updatePreview() {
    // Vider le SVG
    iconPreview.innerHTML = '';
    
    // Ajouter la forme de base
    const baseShape = baseShapeSelect.value;
    const rounded = roundedCornersCheckbox.checked;
    const roundness = parseInt(roundnessSlider.value);
    addBaseShape(baseShape, rounded, roundness);
    
    // Ajouter les éléments intérieurs
    elements.forEach(element => {
        addInnerElement(element);
    });
}

// Ajouter la forme de base au SVG
function addBaseShape(type, rounded, roundness) {
    let shape;
    
    switch (type) {
        case 'circle':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', '50');
            shape.setAttribute('cy', '50');
            shape.setAttribute('r', '40');
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            break;
            
        case 'square':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', '10');
            shape.setAttribute('y', '10');
            shape.setAttribute('width', '80');
            shape.setAttribute('height', '80');
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            
            if (rounded) {
                const radius = roundness * 0.4; // 40% de la valeur d'arrondi
                shape.setAttribute('rx', radius);
                shape.setAttribute('ry', radius);
            }
            break;
            
        case 'diamond':
            if (rounded) {
                // Pour un losange arrondi, on utilise un path
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                const path = createRoundedPolygonPath([
                    [50, 10],
                    [90, 50],
                    [50, 90],
                    [10, 50]
                ], radius);
                shape.setAttribute('d', path);
            } else {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shape.setAttribute('points', '50,10 90,50 50,90 10,50');
            }
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            break;
            
        case 'triangle':
            if (rounded) {
                // Pour un triangle arrondi, on utilise un path
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                const path = createRoundedPolygonPath([
                    [50, 10],
                    [90, 90],
                    [10, 90]
                ], radius);
                shape.setAttribute('d', path);
            } else {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shape.setAttribute('points', '50,10 90,90 10,90');
            }
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            break;
            
        case 'cross':
            // Pour la croix, nous utilisons un groupe avec deux rectangles
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            horizontal.setAttribute('x', '10');
            horizontal.setAttribute('y', '45');
            horizontal.setAttribute('width', '80');
            horizontal.setAttribute('height', '10');
            horizontal.setAttribute('fill', 'black');
            
            const vertical = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            vertical.setAttribute('x', '45');
            vertical.setAttribute('y', '10');
            vertical.setAttribute('width', '10');
            vertical.setAttribute('height', '80');
            vertical.setAttribute('fill', 'black');
            
            if (rounded) {
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                horizontal.setAttribute('rx', radius);
                horizontal.setAttribute('ry', radius);
                vertical.setAttribute('rx', radius);
                vertical.setAttribute('ry', radius);
            }
            
            shape.appendChild(horizontal);
            shape.appendChild(vertical);
            break;
            
        case 'hexagon':
            if (rounded) {
                // Pour un hexagone arrondi, on utilise un path
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                const path = createRoundedPolygonPath([
                    [50, 10],
                    [85, 25],
                    [85, 75],
                    [50, 90],
                    [15, 75],
                    [15, 25]
                ], radius);
                shape.setAttribute('d', path);
            } else {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shape.setAttribute('points', '50,10 85,25 85,75 50,90 15,75 15,25');
            }
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            break;
            
        case 'star':
            if (rounded) {
                // Pour une étoile arrondie, on utilise un path
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const radius = roundness * 0.1; // 10% de la valeur d'arrondi
                const path = createRoundedPolygonPath([
                    [50, 10],
                    [61, 35],
                    [90, 35],
                    [65, 55],
                    [75, 80],
                    [50, 65],
                    [25, 80],
                    [35, 55],
                    [10, 35],
                    [39, 35]
                ], radius);
                shape.setAttribute('d', path);
            } else {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shape.setAttribute('points', '50,10 61,35 90,35 65,55 75,80 50,65 25,80 35,55 10,35 39,35');
            }
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            break;
            
        case 'semicircle':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shape.setAttribute('d', 'M10,50 A40,40 0 0,1 90,50 L90,50 L10,50 Z');
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            shape.setAttribute('fill', 'white');
            break;
    }
    
    iconPreview.appendChild(shape);
}

// Créer un chemin pour un polygone avec des angles arrondis
function createRoundedPolygonPath(points, radius) {
    if (radius === 0) {
        return `M${points[0][0]},${points[0][1]} ` + 
               points.slice(1).map(p => `L${p[0]},${p[1]}`).join(' ') + 
               ' Z';
    }
    
    let path = '';
    const len = points.length;
    
    for (let i = 0; i < len; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % len];
        
        // Point actuel
        const [x1, y1] = p1;
        // Point suivant
        const [x2, y2] = p2;
        
        // Si c'est le premier point, commencer le chemin
        if (i === 0) {
            path += `M${x1},${y1} `;
        }
        
        // Calculer la distance entre les points
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Limiter le rayon à la moitié de la distance
        const actualRadius = Math.min(radius, distance / 2);
        
        // Ajouter une ligne courbe vers le point suivant
        path += `Q${x2},${y2} ${x2},${y2} `;
    }
    
    // Fermer le chemin
    path += 'Z';
    
    return path;
}

// Ajouter un élément intérieur au SVG
function addInnerElement(element) {
    let shape;
    
    // Calculer les dimensions réelles en pixels (basées sur le pourcentage)
    const width = element.width * 0.8; // 80% de la largeur totale
    const height = element.height * 0.8; // 80% de la hauteur totale
    
    // Position centrée basée sur les pourcentages
    const x = element.x;
    const y = element.y;
    
    // Valeur d'arrondi (si applicable)
    const roundness = element.roundness || 10;
    const radius = roundness * 0.2; // 20% de la valeur d'arrondi
    
    switch (element.type) {
        case 'circle':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', x);
            shape.setAttribute('cy', y);
            shape.setAttribute('r', Math.min(width, height) / 2);
            shape.setAttribute('fill', 'black');
            break;
            
        case 'square':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', x - width / 2);
            shape.setAttribute('y', y - height / 2);
            shape.setAttribute('width', width);
            shape.setAttribute('height', height);
            shape.setAttribute('fill', 'black');
            
            if (element.rounded) {
                shape.setAttribute('rx', radius);
                shape.setAttribute('ry', radius);
            }
            break;
            
        case 'diamond':
            if (element.rounded) {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const diamondPoints = [
                    [x, y - height / 2],
                    [x + width / 2, y],
                    [x, y + height / 2],
                    [x - width / 2, y]
                ];
                const path = createRoundedPolygonPath(diamondPoints, radius);
                shape.setAttribute('d', path);
            } else {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const diamondPoints = [
                    [x, y - height / 2],
                    [x + width / 2, y],
                    [x, y + height / 2],
                    [x - width / 2, y]
                ];
                shape.setAttribute('points', diamondPoints.map(p => p.join(',')).join(' '));
            }
            shape.setAttribute('fill', 'black');
            break;
            
        case 'triangle':
            if (element.rounded) {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const trianglePoints = [
                    [x, y - height / 2],
                    [x + width / 2, y + height / 2],
                    [x - width / 2, y + height / 2]
                ];
                const path = createRoundedPolygonPath(trianglePoints, radius);
                shape.setAttribute('d', path);
            } else {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const trianglePoints = [
                    [x, y - height / 2],
                    [x + width / 2, y + height / 2],
                    [x - width / 2, y + height / 2]
                ];
                shape.setAttribute('points', trianglePoints.map(p => p.join(',')).join(' '));
            }
            shape.setAttribute('fill', 'black');
            break;
            
        case 'line':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', x - width / 2);
            shape.setAttribute('y', y - height / 10); // Ligne fine
            shape.setAttribute('width', width);
            shape.setAttribute('height', height / 5);
            shape.setAttribute('fill', 'black');
            
            if (element.rounded) {
                shape.setAttribute('rx', radius);
                shape.setAttribute('ry', radius);
            }
            break;
            
        case 'cross':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            hLine.setAttribute('x', x - width / 2);
            hLine.setAttribute('y', y - height / 10);
            hLine.setAttribute('width', width);
            hLine.setAttribute('height', height / 5);
            hLine.setAttribute('fill', 'black');
            
            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            vLine.setAttribute('x', x - width / 10);
            vLine.setAttribute('y', y - height / 2);
            vLine.setAttribute('width', width / 5);
            vLine.setAttribute('height', height);
            vLine.setAttribute('fill', 'black');
            
            if (element.rounded) {
                hLine.setAttribute('rx', radius);
                hLine.setAttribute('ry', radius);
                vLine.setAttribute('rx', radius);
                vLine.setAttribute('ry', radius);
            }
            
            shape.appendChild(hLine);
            shape.appendChild(vLine);
            break;
            
        case 'dot':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', x);
            shape.setAttribute('cy', y);
            shape.setAttribute('r', Math.min(width, height) / 4); // Plus petit que le cercle standard
            shape.setAttribute('fill', 'black');
            break;
            
        case 'arc':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const arcRadius = Math.min(width, height) / 2;
            shape.setAttribute('d', `M${x - arcRadius},${y} A${arcRadius},${arcRadius} 0 0,1 ${x + arcRadius},${y}`);
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', height / 10);
            shape.setAttribute('fill', 'none');
            break;
            
        case 'zigzag':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            const zigzagPoints = [
                [x - width / 2, y],
                [x - width / 4, y - height / 3],
                [x, y],
                [x + width / 4, y - height / 3],
                [x + width / 2, y]
            ];
            shape.setAttribute('points', zigzagPoints.map(p => p.join(',')).join(' '));
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', height / 10);
            shape.setAttribute('fill', 'none');
            break;
    }
    
    // Appliquer la rotation
    if (element.rotation !== 0) {
        shape.setAttribute('transform', `rotate(${element.rotation} ${x} ${y})`);
    }
    
    iconPreview.appendChild(shape);
}

// Exporter le SVG
function exportSvg() {
    // Créer une copie du SVG pour l'export
    const svgCopy = iconPreview.cloneNode(true);
    svgCopy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Convertir le SVG en chaîne de caractères
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgCopy);
    
    // Encoder en base64 pour le téléchargement
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Créer un lien de téléchargement
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'icone-bauhaus.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Initialiser l'application au chargement
window.onload = init;

// Rendre les fonctions accessibles globalement
window.updateElementProperty = updateElementProperty;
window.removeElement = removeElement;
window.updateRoundnessValue = updateRoundnessValue;
window.toggleRoundnessControls = toggleRoundnessControls; 