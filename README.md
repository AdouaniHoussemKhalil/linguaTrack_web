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

L'API doit tourner sur `http://localhost:8000` : le serveur de développement lui relaie les préfixes
`/auth`, `/users`, `/texts` et `/health` (proxy Vite). Front et API partagent ainsi la même origine, ce
qui permet la session en cookies `httpOnly` : le front ne stocke aucun token.

Variables facultatives, dans un fichier `.env.local` (non commité) :

```bash
# Client ID OAuth Google (public) : affiche « Continuer avec Google » ; absent, le bouton est masqué
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
# URL de l'API si elle n'est pas servie sous la même origine (déconseillé : cookies)
# VITE_API_URL=
```

Autre cible pour le proxy (Docker, autre port) : variable d'environnement `API_PROXY_TARGET`.
En production, servir le front et l'API sur le même domaine (reverse proxy avec les mêmes préfixes).

### Authentification

Les comptes sont gérés par le service d'authentification **auth-web-app-api**, via l'API LinguaTrack qui
sert de relais (voir le README du back) : inscription avec vérification de l'adresse email, connexion avec
vérification en deux étapes (code par email), connexion Google, mot de passe oublié. La MFA s'active dans
**Paramètres**. Les messages d'erreur du service (`error.code`) sont traduits dans `src/lib/errors.ts`.

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript + build de production dans `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Tests (Vitest + Testing Library) ; `npm run test:watch` en continu |
| `npm run preview` | Sert le build de production |

Les tests sont à côté du code testé (`*.test.ts(x)`). La CI GitHub Actions
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) lance lint, tests et build sur chaque Pull Request et
chaque push vers `develop` et `main`.

Avec Docker : `docker-compose up --build -V` (`-V` recrée le `node_modules` du conteneur après un changement de dépendances).

## Organisation

```
src/
├── App.tsx              # routes (pages chargées à la demande)
├── index.css            # Tailwind + thème QuickadUI (couleurs clair / sombre)
├── app/                 # layouts (Auth, Private, Public), routes, page 404
├── components/          # composants partagés : Navbar, Sidebar, PageHeader, EmptyState, ScoreRing…
├── features/            # une feature = pages/, components/, hooks/, services/, types/
│   ├── auth/            # connexion (+ MFA, Google), inscription, vérification d'email, mot de passe oublié
│   ├── account/         # paramètres : profil, mot de passe, vérification en deux étapes
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
