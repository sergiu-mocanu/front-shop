# Maison Moderne

Boutique de démonstration construite avec React et TypeScript strict. Le catalogue et les commandes sont chargés depuis les fichiers JSON statiques de `public/data/` ; aucun serveur API n'est nécessaire.

## Démarrer

```sh
npm install
npm run dev
```

## Parcours disponibles

- `/` : accueil et sélection de produits
- `/products` : catalogue complet
- `/products/:id` : détail d'un produit
- `/orders` : liste et regroupement des commandes par statut
- Toute autre URL : page 404

Le panier est partagé entre les pages pendant la session. Les routes utilisent React Router pour naviguer sans rechargement.

## Vérifier le projet

```sh
npm run build
npm run lint
```

Le mode strict est activé dans `tsconfig.app.json`. Les images du catalogue et les polices sont chargées en ligne.
