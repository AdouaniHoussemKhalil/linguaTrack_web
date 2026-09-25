# LinguaTrack — front

Interface web de LinguaTrack, l'application de correction de textes en français assistée par IA :
l'utilisateur soumet un texte et un mode, l'API renvoie le texte corrigé, un score /100 et les erreurs
expliquées. Le tableau de bord et l'historique permettent de suivre sa progression.

L'API (FastAPI) vit dans un dépôt séparé : `linguaTrack_back_end`.

## Stack

- React 19, TypeScript, Vite 7, React Router 7
- [QuickadUI](https://quickadui-docs-nu.vercel.app/) (`@quickadui/*`) + Tailwind CSS v4 pour toute l'interface
- TanStack Query (données serveur), Axios, react-hook-form + zod (formulaires)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
```

Créer un fichier `.env.local` (non commité) pour pointer vers l'API :

```bash
VITE_API_URL=http://localhost:8000
```

Sans cette variable, le front appelle `http://localhost:8000`.

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript + build de production dans `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Sert le build de production |

Avec Docker : `docker-compose up --build -V` (`-V` recrée le `node_modules` du conteneur après un changement de dépendances).

## Organisation

```
src/
├── App.tsx              # routes (pages chargées à la demande)
├── index.css            # Tailwind + thème QuickadUI (couleurs clair / sombre)
├── app/                 # layouts (Auth, Private, Public), routes, page 404
├── components/          # composants partagés : Navbar, Sidebar, PageHeader, EmptyState, ScoreRing…
├── features/            # une feature = pages/, components/, hooks/, services/, types/
│   ├── auth/            # connexion, inscription
│   ├── dashboard/       # statistiques
│   ├── history/         # historique des analyses
│   └── texts/           # analyse et résultat d'un texte
├── hooks/, lib/, utils/ # utilitaires (axios, erreurs, formatage, périodes)
└── styles/              # correctifs des échelles de couleurs QuickadUI
```

Conventions :

- Les appels API se font uniquement dans `features/*/services/`, exposés par des hooks TanStack Query dans `features/*/hooks/`.
- Une feature n'importe une autre feature que via son `index.ts`.
- Couleurs : uniquement les tokens sémantiques QuickadUI (`bg-neutral-1`, `text-neutral-12`, `bg-accent-9`…), jamais de couleur codée en dur, pour que les thèmes clair et sombre fonctionnent.
- Textes de l'interface en français.
