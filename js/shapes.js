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

// Ajouter une forme de base au SVG
function addBaseShape(svg, shape, roundness = 0, rotation = 0, color = 'black', strokeColor = 'black', strokeWidth = 2, hasStroke = true) {
    const baseElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    baseElement.setAttribute('transform', `rotate(${rotation}, 50, 50)`);
    
    let shapeElement;
    
    switch (shape) {
        case 'square':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapeElement.setAttribute('x', '10');
            shapeElement.setAttribute('y', '10');
            shapeElement.setAttribute('width', '80');
            shapeElement.setAttribute('height', '80');
            shapeElement.setAttribute('rx', roundness ? roundness / 2 : 0);
            shapeElement.setAttribute('ry', roundness ? roundness / 2 : 0);
            break;
            
        case 'circle':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapeElement.setAttribute('cx', '50');
            shapeElement.setAttribute('cy', '50');
            shapeElement.setAttribute('r', '40');
            break;
            
        case 'triangle':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapeElement.setAttribute('points', '50,10 90,90 10,90');
            break;
            
        case 'diamond':
            if (roundness > 0) {
                // Pour un losange arrondi, on utilise un path
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                const path = createRoundedPolygonPath([
                    [50, 10],
                    [90, 50],
                    [50, 90],
                    [10, 50]
                ], radius);
                shapeElement.setAttribute('d', path);
            } else {
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shapeElement.setAttribute('points', '50,10 90,50 50,90 10,50');
            }
            break;
            
        case 'hexagon':
            if (roundness > 0) {
                // Pour un hexagone arrondi, on utilise un path
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                const path = createRoundedPolygonPath([
                    [50, 10],
                    [85, 25],
                    [85, 75],
                    [50, 90],
                    [15, 75],
                    [15, 25]
                ], radius);
                shapeElement.setAttribute('d', path);
            } else {
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shapeElement.setAttribute('points', '50,10 85,25 85,75 50,90 15,75 15,25');
            }
            break;
            
        case 'star':
            if (roundness > 0) {
                // Pour une étoile arrondie, on utilise un path
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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
                shapeElement.setAttribute('d', path);
            } else {
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shapeElement.setAttribute('points', '50,10 61,35 90,35 65,55 75,80 50,65 25,80 35,55 10,35 39,35');
            }
            break;
            
        case 'semicircle':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shapeElement.setAttribute('d', 'M10,50 A40,40 0 0,1 90,50 L90,50 L10,50 Z');
            break;
            
        case 'cross':
            // Pour la croix, nous utilisons un groupe avec deux rectangles
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            horizontal.setAttribute('x', '10');
            horizontal.setAttribute('y', '45');
            horizontal.setAttribute('width', '80');
            horizontal.setAttribute('height', '10');
            horizontal.setAttribute('fill', color);
            
            const vertical = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            vertical.setAttribute('x', '45');
            vertical.setAttribute('y', '10');
            vertical.setAttribute('width', '10');
            vertical.setAttribute('height', '80');
            vertical.setAttribute('fill', color);
            
            if (roundness > 0) {
                const radius = roundness * 0.2; // 20% de la valeur d'arrondi
                horizontal.setAttribute('rx', radius);
                horizontal.setAttribute('ry', radius);
                vertical.setAttribute('rx', radius);
                vertical.setAttribute('ry', radius);
            }
            
            if (hasStroke) {
                horizontal.setAttribute('stroke', strokeColor);
                horizontal.setAttribute('stroke-width', strokeWidth);
                vertical.setAttribute('stroke', strokeColor);
                vertical.setAttribute('stroke-width', strokeWidth);
            }
            
            shapeElement.appendChild(horizontal);
            shapeElement.appendChild(vertical);
            
            baseElement.appendChild(shapeElement);
            svg.appendChild(baseElement);
            return; // Sortir de la fonction car nous avons déjà ajouté la forme
    }
    
    // Appliquer la couleur de remplissage
    shapeElement.setAttribute('fill', color);
    
    // Appliquer le contour si nécessaire
    if (hasStroke) {
        shapeElement.setAttribute('stroke', strokeColor);
        shapeElement.setAttribute('stroke-width', strokeWidth);
    }
    
    baseElement.appendChild(shapeElement);
    svg.appendChild(baseElement);
}

// Ajouter un élément intérieur au SVG
function addInnerElement(svg, element) {
    const { type, x, y, width, height, rotation, roundness = 0, color = 'black', strokeColor = 'black', strokeWidth = 2, hasStroke = false } = element;
    
    // Calculer les coordonnées et dimensions
    const centerX = x;
    const centerY = y;
    const elementWidth = width;
    const elementHeight = height;
    
    // Créer le groupe pour l'élément
    const elementGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    elementGroup.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
    
    let shapeElement;
    
    switch (type) {
        case 'square':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapeElement.setAttribute('x', centerX - elementWidth / 2);
            shapeElement.setAttribute('y', centerY - elementHeight / 2);
            shapeElement.setAttribute('width', elementWidth);
            shapeElement.setAttribute('height', elementHeight);
            shapeElement.setAttribute('rx', roundness ? roundness / 2 : 0);
            shapeElement.setAttribute('ry', roundness ? roundness / 2 : 0);
            break;
            
        case 'circle':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapeElement.setAttribute('cx', centerX);
            shapeElement.setAttribute('cy', centerY);
            shapeElement.setAttribute('r', Math.min(elementWidth, elementHeight) / 2);
            break;
            
        case 'circleOutline':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapeElement.setAttribute('cx', centerX);
            shapeElement.setAttribute('cy', centerY);
            shapeElement.setAttribute('r', Math.min(elementWidth, elementHeight) / 2);
            shapeElement.setAttribute('fill', 'white');
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', '2');
            break;
            
        case 'triangle':
            const halfWidth = elementWidth / 2;
            const halfHeight = elementHeight / 2;
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapeElement.setAttribute('points', `
                ${centerX},${centerY - halfHeight}
                ${centerX + halfWidth},${centerY + halfHeight}
                ${centerX - halfWidth},${centerY + halfHeight}
            `);
            break;
            
        case 'diamond':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const diamondPoints = [
                [centerX, centerY - elementHeight / 2],
                [centerX + elementWidth / 2, centerY],
                [centerX, centerY + elementHeight / 2],
                [centerX - elementWidth / 2, centerY]
            ];
            shapeElement.setAttribute('points', diamondPoints.map(p => p.join(',')).join(' '));
            break;
            
        case 'line':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            shapeElement.setAttribute('x1', centerX - elementWidth / 2);
            shapeElement.setAttribute('y1', centerY);
            shapeElement.setAttribute('x2', centerX + elementWidth / 2);
            shapeElement.setAttribute('y2', centerY);
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', Math.max(1, elementHeight / 10));
            break;
            
        case 'arc':
            const radius = Math.min(elementWidth, elementHeight) / 2;
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shapeElement.setAttribute('d', `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`);
            shapeElement.setAttribute('fill', 'none');
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', Math.max(1, elementHeight / 10));
            break;
            
        case 'zigzag':
            const zigWidth = elementWidth / 4;
            const zigHeight = elementHeight / 2;
            const startX = centerX - elementWidth / 2;
            const startY = centerY;
            
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            shapeElement.setAttribute('d', `
                M ${startX} ${startY}
                L ${startX + zigWidth} ${startY - zigHeight}
                L ${startX + zigWidth * 2} ${startY + zigHeight}
                L ${startX + zigWidth * 3} ${startY - zigHeight}
                L ${startX + zigWidth * 4} ${startY}
            `);
            shapeElement.setAttribute('fill', 'none');
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', Math.max(1, elementHeight / 10));
            break;
            
        case 'dot':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapeElement.setAttribute('cx', centerX);
            shapeElement.setAttribute('cy', centerY);
            shapeElement.setAttribute('r', Math.min(elementWidth, elementHeight) / 4);
            break;
            
        case 'cross':
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            hLine.setAttribute('x', centerX - elementWidth / 2);
            hLine.setAttribute('y', centerY - elementHeight / 10);
            hLine.setAttribute('width', elementWidth);
            hLine.setAttribute('height', elementHeight / 5);
            hLine.setAttribute('fill', color);
            
            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            vLine.setAttribute('x', centerX - elementWidth / 10);
            vLine.setAttribute('y', centerY - elementHeight / 2);
            vLine.setAttribute('width', elementWidth / 5);
            vLine.setAttribute('height', elementHeight);
            vLine.setAttribute('fill', color);
            
            if (roundness > 0) {
                const radius = roundness * 0.2;
                hLine.setAttribute('rx', radius);
                hLine.setAttribute('ry', radius);
                vLine.setAttribute('rx', radius);
                vLine.setAttribute('ry', radius);
            }
            
            if (hasStroke) {
                hLine.setAttribute('stroke', strokeColor);
                hLine.setAttribute('stroke-width', strokeWidth);
                vLine.setAttribute('stroke', strokeColor);
                vLine.setAttribute('stroke-width', strokeWidth);
            }
            
            shapeElement.appendChild(hLine);
            shapeElement.appendChild(vLine);
            
            elementGroup.appendChild(shapeElement);
            svg.appendChild(elementGroup);
            return; // Sortir de la fonction car nous avons déjà ajouté l'élément
    }
    
    // Appliquer la couleur si ce n'est pas déjà fait
    if (type !== 'line' && type !== 'arc' && type !== 'zigzag' && type !== 'circleOutline') {
        shapeElement.setAttribute('fill', color);
    }
    
    // Ajouter un contour si nécessaire
    if (hasStroke && type !== 'line' && type !== 'arc' && type !== 'zigzag' && type !== 'circleOutline') {
        shapeElement.setAttribute('stroke', strokeColor);
        shapeElement.setAttribute('stroke-width', strokeWidth);
    }
    
    elementGroup.appendChild(shapeElement);
    svg.appendChild(elementGroup);
}

// Exporter les fonctions
export { 
    createRoundedPolygonPath, 
    addBaseShape, 
    addInnerElement,
    applyRotation
}; 