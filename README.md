# CampusChef

CampusChef est une application web de recettes pensée pour les étudiants : trouver des idées de repas rapides et abordables, consulter les ingrédients et les instructions, et enregistrer ses recettes préférées.

## État actuel

Le projet est un prototype front-end en HTML, CSS et JavaScript. Il n’y a ni serveur applicatif ni base de données. La page et les styles sont en place, et le code JavaScript contient les fonctionnalités décrites ci-dessous.

La page charge le code JavaScript depuis `js/script.js`. Les fonctionnalités décrites sont donc reliées à la page.

### Fonctionnalités implémentées dans le code JavaScript

- Quatre recettes locales avec ingrédients, instructions, temps, coût indicatif et difficulté.
- Affichage des recettes sous forme de cartes avec image, étiquettes et bouton favori.
- Ajout et retrait des favoris ; la liste des favoris est conservée dans le stockage local du navigateur (`localStorage`).
- Filtres locaux : toutes les recettes, recettes de 10 minutes ou moins, recettes à 1,50 € ou moins, recettes équilibrées et favoris.
- Recherche en ligne avec TheMealDB : recherche par nom, puis tentative de recherche par ingrédient.
- Fenêtre modale avec ingrédients et préparation ; les instructions des recettes en ligne sont traduites en français via MyMemory, jusqu’à 450 caractères.
- Affichage d’états de chargement, d’erreur et de liste vide.

### Limites connues

- La recherche et la traduction requièrent une connexion Internet et dépendent de services tiers.
- La recherche en ligne ne convertit pas automatiquement les termes français en anglais. La recherche par ingrédient peut renvoyer des informations partielles, selon la réponse de TheMealDB.
- Pendant une recherche en ligne, les filtres de recettes locales ne filtrent pas les résultats.
- La traduction est limitée aux 450 premiers caractères ; en cas d’échec, le texte original est utilisé.
- Les favoris sont enregistrés uniquement dans le navigateur et ne sont pas synchronisés entre appareils.
- Aucun test automatisé ni outil de build n’est configuré.

## Structure

```text
.
├── .vscode/
│   └── launch.json
├── css/
│   └── style.css
├── js/
│   └── script.js
├── site/
│   └── index.html
└── README.md
```

- `site/index.html` définit la page, les boutons de recherche et de filtres, la grille de recettes et la fenêtre modale.
- `css/style.css` définit l’apparence de la page, des cartes, des favoris et de la fenêtre modale, avec une adaptation aux petits écrans.
- `js/script.js` contient les recettes locales, la recherche, le rendu des cartes, les filtres, les favoris et la traduction.
- `.vscode/launch.json` configure le débogage pour ouvrir directement `site/index.html` dans Chrome, sans serveur local.

## Lancer le projet

Aucune dépendance ni aucun serveur local ne sont requis pour lancer la page.

1. Ouvrir le dossier du projet dans VS Code.
2. Dans **Exécuter et déboguer**, choisir **Ouvrir CampusChef**, puis démarrer le débogage pour ouvrir directement `site/index.html` dans Chrome.
3. La recherche et la traduction nécessitent une connexion Internet ; leur fonctionnement peut dépendre des restrictions du navigateur lorsqu’une page est ouverte comme fichier local.

## Prochaines étapes

1. Tester les filtres, la recherche, le retour aux recettes locales, les favoris et leur persistance après rechargement.
2. Améliorer la recherche en français et gérer plus précisément les résultats de recherche par ingrédient.
3. Ajouter des recettes et des tests ; poursuivre les vérifications d’accessibilité et d’affichage mobile.
