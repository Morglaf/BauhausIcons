/**
 * Fichier de traductions pour le générateur d'icônes Bauhaus
 */

// Définition des langues disponibles
const AVAILABLE_LANGUAGES = ['fr', 'en', 'de', 'es'];

// Traductions pour chaque langue
const translations = {
    // Français
    fr: {
        title: "Générateur d'Icônes Bauhaus",
        baseShape: "Forme de base",
        baseRotation: "Rotation",
        roundness: "Arrondi",
        innerElements: "Éléments intérieurs",
        elementType: "Type d'élément",
        add: "Ajouter",
        remove: "Supprimer",
        preview: "Aperçu",
        iconCode: "Code de l'icône",
        exportSvg: "Exporter SVG",
        save: "Sauvegarder",
        load: "Charger",
        exportJson: "Exporter JSON",
        importJson: "Importer JSON",
        savedIcons: "Icônes sauvegardées",
        noSavedIcons: "Aucune icône sauvegardée",
        darkMode: "Mode sombre",
        lightMode: "Mode clair",
        language: "Langue",
        width: "Largeur",
        height: "Hauteur",
        rotation: "Rotation",
        showGrid: "Afficher la grille",
        // Formes
        circle: "Rond",
        circleOutline: "Cercle contour",
        square: "Carré",
        diamond: "Losange",
        triangle: "Triangle",
        cross: "Croix",
        hexagon: "Hexagone",
        star: "Étoile",
        semicircle: "Demi-cercle",
        // Éléments
        line: "Ligne",
        dot: "Point",
        arc: "Arc",
        zigzag: "Zigzag",
        // Nouvelles traductions pour les couleurs
        colors: "Couleurs",
        baseColor: "Couleur de base",
        elementColor: "Couleur de l'élément",
        black: "Noir",
        white: "Blanc",
        red: "Rouge",
        blue: "Bleu",
        yellow: "Jaune",
        // Duplication d'éléments
        duplicate: "Dupliquer",
        // Exportation PNG
        exportPng: "Exporter PNG",
        transparentBg: "Fond transparent",
        // Contours
        hasStroke: "Contour",
        strokeColor: "Couleur du contour",
        strokeWidth: "Épaisseur du contour",
        // Messages
        iconNamePrompt: "Nom de l'icône:",
        invalidCode: "Code d'icône invalide",
        importSuccess: "Icônes importées avec succès",
        importError: "Erreur lors de l'importation",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cette icône ?",
        resetIcon: "Réinitialiser",
        confirmReset: "Êtes-vous sûr de vouloir réinitialiser l'icône ? Tous les éléments seront supprimés."
    },
    
    // Anglais
    en: {
        title: "Bauhaus Icon Generator",
        baseShape: "Base Shape",
        baseRotation: "Rotation",
        roundness: "Roundness",
        innerElements: "Inner Elements",
        elementType: "Element Type",
        add: "Add",
        remove: "Remove",
        preview: "Preview",
        iconCode: "Icon Code",
        exportSvg: "Export SVG",
        save: "Save",
        load: "Load",
        exportJson: "Export JSON",
        importJson: "Import JSON",
        savedIcons: "Saved Icons",
        noSavedIcons: "No saved icons",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        language: "Language",
        width: "Width",
        height: "Height",
        rotation: "Rotation",
        showGrid: "Show Grid",
        // Shapes
        circle: "Filled Circle",
        circleOutline: "Circle Outline",
        square: "Square",
        diamond: "Diamond",
        triangle: "Triangle",
        cross: "Cross",
        hexagon: "Hexagon",
        star: "Star",
        semicircle: "Semicircle",
        // Elements
        line: "Line",
        dot: "Dot",
        arc: "Arc",
        zigzag: "Zigzag",
        // Nouvelles traductions pour les couleurs
        colors: "Colors",
        baseColor: "Base Color",
        elementColor: "Element Color",
        black: "Black",
        white: "White",
        red: "Red",
        blue: "Blue",
        yellow: "Yellow",
        // Duplication d'éléments
        duplicate: "Duplicate",
        // Exportation PNG
        exportPng: "Export PNG",
        transparentBg: "Transparent Background",
        // Contours
        hasStroke: "Stroke",
        strokeColor: "Stroke Color",
        strokeWidth: "Stroke Width",
        // Messages
        iconNamePrompt: "Icon name:",
        invalidCode: "Invalid icon code",
        importSuccess: "Icons imported successfully",
        importError: "Error importing icons",
        confirmDelete: "Are you sure you want to delete this icon?",
        resetIcon: "Reset",
        confirmReset: "Are you sure you want to reset the icon? All elements will be removed."
    },
    
    // Allemand
    de: {
        title: "Bauhaus-Symbolgenerator",
        baseShape: "Grundform",
        baseRotation: "Drehung",
        roundness: "Rundheit",
        innerElements: "Innere Elemente",
        elementType: "Elementtyp",
        add: "Hinzufügen",
        remove: "Entfernen",
        preview: "Vorschau",
        iconCode: "Symbol-Code",
        exportSvg: "SVG exportieren",
        save: "Speichern",
        load: "Laden",
        exportJson: "JSON exportieren",
        importJson: "JSON importieren",
        savedIcons: "Gespeicherte Symbole",
        noSavedIcons: "Keine gespeicherten Symbole",
        darkMode: "Dunkelmodus",
        lightMode: "Hellmodus",
        language: "Sprache",
        width: "Breite",
        height: "Höhe",
        rotation: "Drehung",
        showGrid: "Raster anzeigen",
        // Formen
        circle: "Gefüllter Kreis",
        circleOutline: "Kreisumriss",
        square: "Quadrat",
        diamond: "Raute",
        triangle: "Dreieck",
        cross: "Kreuz",
        hexagon: "Sechseck",
        star: "Stern",
        semicircle: "Halbkreis",
        // Elemente
        line: "Linie",
        dot: "Punkt",
        arc: "Bogen",
        zigzag: "Zickzack",
        // Nouvelles traductions pour les couleurs
        colors: "Farben",
        baseColor: "Grundfarbe",
        elementColor: "Elementfarbe",
        black: "Schwarz",
        white: "Weiß",
        red: "Rot",
        blue: "Blau",
        yellow: "Gelb",
        // Duplication d'éléments
        duplicate: "Duplizieren",
        // Exportation PNG
        exportPng: "PNG exportieren",
        transparentBg: "Transparenter Hintergrund",
        // Contours
        hasStroke: "Umriss",
        strokeColor: "Umrissfarbe",
        strokeWidth: "Umrissbreite",
        // Nachrichten
        iconNamePrompt: "Symbolname:",
        invalidCode: "Ungültiger Symbol-Code",
        importSuccess: "Symbole erfolgreich importiert",
        importError: "Fehler beim Importieren",
        confirmDelete: "Sind Sie sicher, dass Sie dieses Symbol löschen möchten?",
        resetIcon: "Zurücksetzen",
        confirmReset: "Sind Sie sicher, dass Sie das Symbol zurücksetzen möchten? Alle Elemente werden entfernt."
    },
    
    // Espagnol
    es: {
        title: "Generador de Iconos Bauhaus",
        baseShape: "Forma Base",
        baseRotation: "Rotación",
        roundness: "Redondez",
        innerElements: "Elementos Interiores",
        elementType: "Tipo de Elemento",
        add: "Añadir",
        remove: "Eliminar",
        preview: "Vista Previa",
        iconCode: "Código del Icono",
        exportSvg: "Exportar SVG",
        save: "Guardar",
        load: "Cargar",
        exportJson: "Exportar JSON",
        importJson: "Importar JSON",
        savedIcons: "Iconos Guardados",
        noSavedIcons: "No hay iconos guardados",
        darkMode: "Modo Oscuro",
        lightMode: "Modo Claro",
        language: "Idioma",
        width: "Ancho",
        height: "Alto",
        rotation: "Rotación",
        showGrid: "Mostrar Cuadrícula",
        // Formas
        circle: "Círculo Relleno",
        circleOutline: "Contorno de Círculo",
        square: "Cuadrado",
        diamond: "Rombo",
        triangle: "Triángulo",
        cross: "Cruz",
        hexagon: "Hexágono",
        star: "Estrella",
        semicircle: "Semicírculo",
        // Elementos
        line: "Línea",
        dot: "Punto",
        arc: "Arco",
        zigzag: "Zigzag",
        // Nouvelles traductions pour les couleurs
        colors: "Colores",
        baseColor: "Color base",
        elementColor: "Color del elemento",
        black: "Negro",
        white: "Blanco",
        red: "Rojo",
        blue: "Azul",
        yellow: "Amarillo",
        // Duplication d'éléments
        duplicate: "Duplicar",
        // Exportation PNG
        exportPng: "Exportar PNG",
        transparentBg: "Fondo transparente",
        // Contours
        hasStroke: "Contorno",
        strokeColor: "Color del contorno",
        strokeWidth: "Grosor del contorno",
        // Mensajes
        iconNamePrompt: "Nombre del icono:",
        invalidCode: "Código de icono inválido",
        importSuccess: "Iconos importados con éxito",
        importError: "Error al importar iconos",
        confirmDelete: "¿Está seguro de que desea eliminar este icono?",
        resetIcon: "Reiniciar",
        confirmReset: "¿Está seguro de que desea reiniciar el icono? Todos los elementos serán eliminados."
    }
};

// Fonction pour obtenir la langue du navigateur
function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    const shortLang = lang.split('-')[0];
    
    // Vérifier si la langue est supportée
    if (AVAILABLE_LANGUAGES.includes(shortLang)) {
        return shortLang;
    }
    
    // Par défaut, utiliser le français
    return 'fr';
}

// Langue actuelle (initialisée avec la langue du navigateur ou fr par défaut)
let currentLanguage = getBrowserLanguage();

// Obtenir une traduction
function getTranslation(key) {
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    
    // Fallback sur le français si la clé n'existe pas
    if (translations.fr[key]) {
        return translations.fr[key];
    }
    
    // Si la clé n'existe pas du tout, retourner la clé elle-même
    return key;
}

// Changer la langue
function setLanguage(lang) {
    if (AVAILABLE_LANGUAGES.includes(lang)) {
        currentLanguage = lang;
        return true;
    }
    return false;
}

// Obtenir la langue actuelle
function getCurrentLanguage() {
    return currentLanguage;
}

// Obtenir toutes les langues disponibles
function getAvailableLanguages() {
    return AVAILABLE_LANGUAGES;
}

// Exporter les fonctions
export {
    getTranslation,
    setLanguage,
    getCurrentLanguage,
    getAvailableLanguages
}; 