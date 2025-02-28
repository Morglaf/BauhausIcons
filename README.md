# Générateur d'Icônes Bauhaus

Un générateur d'icônes interactif inspiré du style Bauhaus, permettant de créer des symboles géométriques en noir et blanc et de les exporter en SVG.

## Fonctionnalités

- Sélection de formes de base variées:
  - Cercle, Carré, Losange, Triangle, Croix
  - Hexagone, Étoile, Demi-cercle
- Personnalisation complète:
  - Niveau d'arrondi des angles (0-50%)
  - Rotation des formes de base (0-360°)
  - Position, taille et rotation des éléments
- Ajout d'éléments intérieurs combinables:
  - Formes géométriques classiques
  - Points, Arcs, Zigzags
- Gestion des icônes:
  - Aperçu en temps réel
  - Export au format SVG
  - Sauvegarde locale des icônes
  - Export/import au format JSON
  - Code compact pour partager les icônes
- Interface personnalisable:
  - Mode sombre/clair
  - Support multilingue (Français, Anglais, Allemand, Espagnol)

## Comment démarrer

En raison des restrictions de sécurité des navigateurs modernes concernant les modules JavaScript, vous devez utiliser un serveur local pour exécuter l'application:

### Option 1: Serveur Python (recommandé)

1. Assurez-vous que Python est installé sur votre système
2. Ouvrez un terminal dans le dossier du projet
3. Exécutez la commande: `python -m http.server`
4. Accédez à l'application via: `http://localhost:8000`

### Option 2: Autre serveur local

Vous pouvez utiliser n'importe quel serveur HTTP local:
- Extension Live Server dans VS Code
- XAMPP, WAMP, ou autre serveur web local

## Comment utiliser

1. **Sélectionner une forme de base** dans le menu déroulant
2. **Ajuster le niveau d'arrondi** si désiré avec le curseur (0-50%)
3. **Définir la rotation** de la forme de base avec le curseur (0-360°)
4. **Ajouter des éléments intérieurs** en choisissant un type d'élément et en cliquant sur "Ajouter"
5. **Personnaliser chaque élément** en ajustant sa position, sa taille, sa rotation et son arrondi
6. **Sauvegarder votre icône** en cliquant sur "Sauvegarder" et en lui donnant un nom
7. **Exporter l'icône** en SVG en cliquant sur le bouton "Exporter SVG"
8. **Partager le code** de l'icône en copiant le texte du champ de code

## Gestion des icônes

- **Sauvegarder**: Enregistre l'icône actuelle dans le stockage local du navigateur
- **Charger**: Charge une icône à partir de son code
- **Exporter JSON**: Exporte toutes les icônes sauvegardées dans un fichier JSON
- **Importer JSON**: Importe des icônes depuis un fichier JSON précédemment exporté

## Personnalisation de l'interface

- **Changer de thème**: Basculez entre le mode clair et le mode sombre avec le bouton en haut à droite
- **Changer de langue**: Sélectionnez votre langue préférée dans le menu déroulant en haut à droite

## Style Bauhaus

Le style Bauhaus se caractérise par:
- Des formes géométriques simples
- Un design minimaliste
- L'utilisation de couleurs primaires (ici limité au noir et blanc)
- Une approche fonctionnelle du design

## Exemples d'utilisation

Vous pouvez créer différents types d'icônes en combinant les formes:
- Un cercle avec un petit cercle à l'intérieur
- Un carré arrondi avec une croix
- Un triangle avec une ligne horizontale
- Un losange avec plusieurs petits carrés
- Une étoile avec un point central
- Un hexagone avec un zigzag
- Et bien d'autres combinaisons!

## Technique

Cette application utilise:
- HTML5 pour la structure
- CSS3 pour le style
- JavaScript (modules ES6) pour l'interactivité
- SVG pour le rendu vectoriel des icônes
- LocalStorage pour la sauvegarde des icônes

---

Créé avec passion pour les amateurs de design Bauhaus. 


## roadmap :

Palette de couleurs personnalisable :
Ajouter la possibilité de choisir des couleurs pour les formes et les éléments
Respecter l'esthétique Bauhaus avec une palette limitée (rouge, jaune, bleu, noir)

Duplication d'éléments

Exportations Format PNG avec transparence