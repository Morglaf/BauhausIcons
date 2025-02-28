/**
 * Fonctions pour la création et la manipulation des formes SVG
 */

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

// Appliquer une rotation à un élément SVG
function applyRotation(element, rotation, centerX = 50, centerY = 50) {
    if (rotation !== 0) {
        element.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);
    }
}

// Ajouter la forme de base au SVG
function addBaseShape(iconPreview, type, roundness, rotation = 0) {
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
            
            if (roundness > 0) {
                const radius = roundness * 0.4; // 40% de la valeur d'arrondi
                shape.setAttribute('rx', radius);
                shape.setAttribute('ry', radius);
            }
            break;
            
        case 'diamond':
            if (roundness > 0) {
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
            if (roundness > 0) {
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
            
            if (roundness > 0) {
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
            if (roundness > 0) {
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
            if (roundness > 0) {
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
    
    // Appliquer la rotation à la forme de base
    applyRotation(shape, rotation);
    
    iconPreview.appendChild(shape);
}

// Ajouter un élément intérieur au SVG
function addInnerElement(iconPreview, element) {
    let shape;
    
    // Calculer les dimensions réelles en pixels (basées sur le pourcentage)
    const width = element.width * 0.8; // 80% de la largeur totale
    const height = element.height * 0.8; // 80% de la hauteur totale
    
    // Position centrée basée sur les pourcentages
    const x = element.x;
    const y = element.y;
    
    // Valeur d'arrondi (si applicable)
    const roundness = element.roundness || 0;
    const radius = roundness * 0.2; // 20% de la valeur d'arrondi
    
    switch (element.type) {
        case 'circle':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', x);
            shape.setAttribute('cy', y);
            shape.setAttribute('r', Math.min(width, height) / 2);
            shape.setAttribute('fill', 'black');
            break;
            
        case 'circleOutline':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', x);
            shape.setAttribute('cy', y);
            shape.setAttribute('r', Math.min(width, height) / 2);
            shape.setAttribute('fill', 'white');
            shape.setAttribute('stroke', 'black');
            shape.setAttribute('stroke-width', '2');
            break;
            
        case 'square':
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', x - width / 2);
            shape.setAttribute('y', y - height / 2);
            shape.setAttribute('width', width);
            shape.setAttribute('height', height);
            shape.setAttribute('fill', 'black');
            
            if (roundness > 0) {
                shape.setAttribute('rx', radius);
                shape.setAttribute('ry', radius);
            }
            break;
            
        case 'diamond':
            if (roundness > 0) {
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
            if (roundness > 0) {
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
            
            if (roundness > 0) {
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
            
            if (roundness > 0) {
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
    
    // Appliquer la rotation à l'élément
    applyRotation(shape, element.rotation, x, y);
    
    iconPreview.appendChild(shape);
}

// Exporter les fonctions
export { 
    createRoundedPolygonPath, 
    addBaseShape, 
    addInnerElement,
    applyRotation
}; 