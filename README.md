# CampusChef

CampusChef est une application web de recettes pensée pour les étudiants : retrouver des idées de repas rapides, économiques et faciles à préparer, puis gérer ses recettes favorites.

## Présentation

Le projet est une interface front-end en HTML, CSS et JavaScript, sans backend ni base de données. Il permet :

- de consulter une sélection de recettes locales,
- de filtrer les résultats selon plusieurs critères,
- de rechercher des recettes sur le web via TheMealDB,
- d’ajouter des recettes en favoris dans le navigateur,
- d’ouvrir une modale avec les ingrédients et les instructions détaillées.

## Fonctionnalités

- 4 recettes locales avec image, temps de préparation, coût estimé, difficulté et ingrédients.
- Filtres : toutes, moins de 10 min, petit budget, équilibré, favoris.
- Recherche en ligne par nom ou ingrédient.
- Retour à la liste locale après une recherche web.
- Sauvegarde des favoris dans `localStorage`.
- Modale détaillée avec instructions et liste des ingrédients ; les instructions en ligne sont traduites en français via MyMemory.
- États de chargement, erreur et liste vide.

## Structure du projet

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
└── README.md
```

- `index.html` : structure principale de la page, recherche, filtres et modale.
- `css/style.css` : styles du site, cartes de recettes et responsive design.
- `js/script.js` : recettes locales, logique de filtres, gestion des favoris, recherche web et traduction.
- `.github/workflows/deploy.yml` : déploiement automatique du site sur GitHub Pages.

## Lancer le projet

Aucune installation ni dépendance n’est nécessaire.

Ouvrir `index.html` dans un navigateur. La recherche web et la traduction nécessitent une connexion Internet.

## Hébergement sur GitHub Pages

Le site est configuré pour être publié automatiquement sur GitHub Pages à chaque push sur la branche `main`. Le workflow se trouve dans `.github/workflows/deploy.yml`.

Pour activer le déploiement dans le dépôt GitHub :

1. Ouvrir **Settings > Pages**.
2. Dans **Build and deployment**, choisir **GitHub Actions** comme source.
3. Envoyer un commit sur `main` ou lancer manuellement le workflow **Deploy to GitHub Pages** dans l’onglet **Actions**.

Après la réussite du workflow, le site sera accessible à l’adresse [https://hugopelissier24-sketch.github.io/campuschef/](https://hugopelissier24-sketch.github.io/campuschef/). La première publication peut prendre quelques minutes.

## Limites actuelles

- La recherche web dépend de services tiers (TheMealDB et MyMemory).
- Les requêtes internet nécessitent une connexion active.
- La recherche en français est limitée et la recherche par ingrédient peut renvoyer des résultats incomplets.
- En recherche en ligne, les filtres des recettes locales ne s’appliquent pas. La traduction est limitée aux 450 premiers caractères ; en cas d’échec, le texte original est affiché.
- Les favoris ne sont sauvegardés que dans le navigateur utilisé et ne sont pas synchronisés entre appareils.
- Le projet est un prototype front-end sans backend ni tests automatisés. Le workflow GitHub Actions sert uniquement à publier les fichiers statiques ; aucune étape de build n’est nécessaire.

## Prochaines améliorations

- améliorer la recherche en français,
- mieux gérer les résultats de recherche par ingrédient,
- ajouter plus de recettes,
- améliorer l’accessibilité et le responsive,
- mettre en place des tests automatisés et une meilleure architecture du code.
