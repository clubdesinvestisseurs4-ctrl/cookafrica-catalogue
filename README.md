# Catalogue Cook Africa

Catalogue numérique du menu Cook Africa, accessible par QR code : on le feuillette comme un vrai
magazine (animation de tournage de page), on peut sauter directement à un jour, et le télécharger
en PDF. Le catalogue propose aussi une réduction téléchargeable, une fiche de contact client en
dernière page, un espace pour les chefs promoteurs qui collectent des fiches sur le terrain, et un
dashboard admin pour piloter tout ça. Architecture :

```
CATALOGUE-COOKAFRICA/
├── frontend/    PWA Vue 3 + Vite — déployée sur Vercel
├── backend/     API Express + Firestore — déployée EN DOUBLE sur Render (principal)
│                et Cloud Run (secours), pour la redondance
├── render.yaml                              Blueprint de déploiement Render
└── .github/workflows/deploy-backend.yml      CI/CD du backend sur Cloud Run (GitHub Actions)
```

Le frontend embarque une copie statique du catalogue (`frontend/src/data/catalog.js`) : le
feuilletage du menu fonctionne donc **même sans backend déployé**. Le backend + Firestore servent
pour : modifier le menu sans redéployer, collecter les fiches clients (promoteurs + formulaire
public), et gérer les comptes des chefs promoteurs depuis le dashboard admin.

---

## 1. Développement local

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend (optionnel en local, nécessite Firebase configuré — voir §3)

```bash
cd backend
npm install
cp .env.example .env   # puis renseigner les variables (Firebase, ADMIN_PASSWORD, JWT_SECRET...)
npm run dev             # http://localhost:8080
```

Pour que le frontend interroge ce backend local plutôt que d'utiliser les données embarquées,
créez `frontend/.env.local` avec :

```
VITE_API_URL=http://localhost:8080
```

---

## 2. Mettre à jour les images du menu

Les images sources (exports Photoshop) vivent hors du dépôt, dans `C:\Users\abayi\MENU\`. La
correspondance fichier → page est définie dans `frontend/scripts/image-map.mjs`.

1. Exportez/remplacez le(s) JPG dans `C:\Users\abayi\MENU\<JOUR>\...` (ou changez le chemin dans
   `image-map.mjs` si vous renommez un fichier).
2. Régénérez les pages optimisées, les icônes et le PDF :
   ```bash
   cd frontend
   npm run prep
   ```
   > ⚠️ Ces scripts lisent les fichiers sources depuis `C:\Users\abayi\MENU\` (votre machine). Ils
   > ne sont **pas** exécutés automatiquement au build (ni Vercel ni Render/Cloud Run n'ont accès à
   > ce dossier) — c'est pour ça qu'il faut les lancer en local puis committer les fichiers générés
   > (`public/assets/pages/`, `public/icons/`, `public/catalogue-cookafrica.pdf`).
3. Si le texte des plats a changé, mettez aussi à jour `frontend/src/data/catalog.js`
   (et, si le backend est en service, republiez via `npm run seed` côté backend — voir §3.4).
4. Commitez **et ajoutez les fichiers générés** (`git add public/`), puis poussez : Vercel
   redéploie automatiquement (§4).

---

## 3. Firebase (Firestore) — menu, fiches clients, chefs promoteurs

> Vous avez choisi de créer un **nouveau projet Firebase dédié** à ce catalogue (séparé de celui de
> COOKAFRICA-APP). Étapes :

### 3.1 Créer le projet

1. https://console.firebase.google.com → **Ajouter un projet** → nommez-le par ex.
   `cookafrica-catalogue`.
2. Dans le projet : **Compilation > Firestore Database** → **Créer une base de données** → mode
   production → région `eur3 (europe-west)` (ou la plus proche de vos clients).

### 3.2 Créer un compte de service (pour le backend)

1. **Paramètres du projet** (roue dentée) → **Comptes de service** → **Générer une nouvelle clé
   privée** → télécharge un fichier JSON.
2. Dans ce JSON, récupérez `project_id`, `client_email`, `private_key`.
3. Localement, copiez-les dans `backend/.env` (voir `backend/.env.example`). **Ces trois valeurs
   doivent être renseignées à l'identique sur Render ET sur Cloud Run** (§5), puisque les deux
   backends lisent/écrivent la même base Firestore.

### 3.3 Collections Firestore

Trois collections, toutes lues/écrites uniquement par le backend (clé de service) — jamais
directement depuis le navigateur :

- `catalog/current` — le document unique contenant le menu (pages, jours, plats).
- `promoters` — un document par chef promoteur (`username`, `displayName`, `passwordHash`, `active`).
- `leads` — une fiche par soumission de formulaire (`nom`, `prenoms`, `contact`, `fonction`,
  `source`: `"promoteur"` ou `"catalogue"`, `promoterId`/`promoterName` si applicable, `createdAt`).

Les règles par défaut (tout refuser côté client) suffisent donc. Dans **Firestore > Règles** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3.4 Importer le catalogue dans Firestore

```bash
cd backend
npm run seed
```

Cela pousse le contenu de `frontend/src/data/catalog.js` dans le document
`catalog/current`. À refaire chaque fois que vous voulez republier une mise à jour du JSON vers
Firestore.

### 3.5 Modifier le menu en production sans redéployer

Une fois le backend déployé (§5), connectez-vous d'abord en admin pour obtenir un jeton, puis
utilisez-le pour remplacer le catalogue :

```bash
TOKEN=$(curl -s -X POST https://<votre-backend>/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"<ADMIN_PASSWORD>"}' | jq -r .token)

curl -X PUT https://<votre-backend>/api/catalog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @catalogue-modifie.json
```

Le frontend récupère ces données au chargement via `GET /api/catalog` (avec repli automatique sur
les données embarquées si aucun des deux backends n'est joignable).

---

## 4. Déploiement du frontend (Vercel)

1. Poussez ce dossier sur GitHub (un dépôt dédié, ou un dépôt contenant `CATALOGUE-COOKAFRICA/` —
   dans ce cas indiquez à Vercel le **Root Directory** = `CATALOGUE-COOKAFRICA/frontend`).
2. https://vercel.com → **Add New Project** → importez le dépôt GitHub.
3. Réglages du projet :
   - **Root Directory** : `frontend` (ou `CATALOGUE-COOKAFRICA/frontend`)
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `dist`
   - **Variables d'environnement** (une fois les backends déployés, §5) :
     - `VITE_API_URL` = URL Render (backend principal)
     - `VITE_API_URL_FALLBACK` = URL Cloud Run (backend de secours)
4. Déployez. Chaque `git push` sur la branche principale redéploie automatiquement (continu).

Le frontend essaie toujours `VITE_API_URL` en premier ; s'il est inaccessible ou répond en erreur
serveur (5xx), il retente automatiquement sur `VITE_API_URL_FALLBACK` avant d'abandonner — aucune
intervention manuelle nécessaire en cas de panne d'un des deux hébergeurs.

---

## 5. Déploiement du backend — double hébergement (Render + Cloud Run)

Le même backend est déployé sur **deux hébergeurs indépendants** branchés sur la même base
Firestore : Render en principal, Cloud Run (free tier) en secours si Render est indisponible
(scénario déjà vécu sur d'autres projets). Les deux doivent partager **exactement les mêmes**
variables d'environnement Firebase et **le même `JWT_SECRET`** — sinon un jeton (admin ou
promoteur) émis par l'un ne serait pas valide sur l'autre en cas de bascule en cours de session.

### 5.1 Render (principal)

1. https://dashboard.render.com → **New > Blueprint** → connectez le dépôt GitHub → Render
   détecte `render.yaml` à la racine de `CATALOGUE-COOKAFRICA/`.
2. Render crée le service `cookafrica-catalogue-api` (plan gratuit, `rootDir: backend`). Avant le
   premier déploiement, renseignez dans l'onglet **Environment** du service :
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (§3.2)
   - `ADMIN_PASSWORD` — choisissez-le (ex. via un gestionnaire de mots de passe)
   - `JWT_SECRET` — générez-le une fois (`openssl rand -hex 32`) et **réutilisez la même valeur
     sur Cloud Run** (§5.2)
   - `CORS_ORIGINS` — l'URL Vercel du frontend (§4), ou `*` en attendant
3. Render redéploie automatiquement à chaque `git push` sur `main` (intégration GitHub native, pas
   besoin de GitHub Actions ici).
4. Notez l'URL du service (ex. `https://cookafrica-catalogue-api.onrender.com`) → c'est la valeur
   de `VITE_API_URL` sur Vercel (§4).

> Le plan gratuit Render met le service en veille après une période d'inactivité (premier appel
> après veille plus lent — quelques secondes). C'est sans incidence pour un catalogue consulté
> occasionnellement.

### 5.2 Cloud Run (secours), via GitHub Actions

#### Préparer le projet GCP

1. https://console.cloud.google.com → créez (ou réutilisez) un projet, ex. `cookafrica-catalogue`.
   Notez son **ID de projet**.
2. Activez les API nécessaires :
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```
3. Créez un compte de service dédié au déploiement CI/CD :
   ```bash
   gcloud iam service-accounts create github-deployer --display-name "GitHub Actions deployer"

   gcloud projects add-iam-policy-binding <PROJECT_ID> \
     --member="serviceAccount:github-deployer@<PROJECT_ID>.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding <PROJECT_ID> \
     --member="serviceAccount:github-deployer@<PROJECT_ID>.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"

   gcloud projects add-iam-policy-binding <PROJECT_ID> \
     --member="serviceAccount:github-deployer@<PROJECT_ID>.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"

   gcloud projects add-iam-policy-binding <PROJECT_ID> \
     --member="serviceAccount:github-deployer@<PROJECT_ID>.iam.gserviceaccount.com" \
     --role="roles/storage.admin"

   gcloud iam service-accounts keys create github-deployer-key.json \
     --iam-account=github-deployer@<PROJECT_ID>.iam.gserviceaccount.com
   ```
   Le fichier `github-deployer-key.json` contient la clé à mettre dans le secret `GCP_SA_KEY`
   (étape suivante) — **ne le commitez jamais** dans Git.

#### Secrets GitHub (Settings → Secrets and variables → Actions)

| Secret | Valeur |
|---|---|
| `GCP_SA_KEY` | contenu complet du fichier `github-deployer-key.json` |
| `FIREBASE_PROJECT_ID` | identique à Render (§5.1) |
| `FIREBASE_CLIENT_EMAIL` | identique à Render |
| `FIREBASE_PRIVATE_KEY` | identique à Render — **collez les retours à la ligne sous forme littérale `\n`** (le code les reconvertit automatiquement) |
| `ADMIN_PASSWORD` | identique à Render |
| `JWT_SECRET` | **identique à Render** (impératif, voir intro §5) |
| `CORS_ORIGINS` | l'URL Vercel du frontend (§4), ou `*` en attendant |

#### Déployer

Le workflow `.github/workflows/deploy-backend.yml` se déclenche automatiquement à chaque `push`
sur `main` qui touche `backend/**`. Vous pouvez aussi le lancer manuellement depuis l'onglet
**Actions** du dépôt GitHub (« Run workflow »).

Une fois le déploiement terminé, récupérez l'URL du service (visible dans les logs du workflow,
ou via `gcloud run services describe catalogue-cookafrica-api --region us-central1 --format='value(status.url)'`)
→ c'est la valeur de `VITE_API_URL_FALLBACK` sur Vercel (§4).

> **Coût** : Cloud Run facture à l'usage avec un palier gratuit mensuel généreux (2 millions de
> requêtes, 360 000 Gio-s de mémoire, 180 000 vCPU-s). `--min-instances=0` (déjà dans le workflow)
> garantit qu'on ne paie rien en l'absence de trafic. **Important** : ce palier gratuit n'est
> applicable que dans 3 régions précises — `us-central1`, `us-east1`, `us-west1` (d'où le choix de
> `us-central1` ici). Déployer dans une autre région (ex. `europe-west1`) fonctionne très bien mais
> sort du palier gratuit et facture dès la première requête.

---

## 6. Chefs promoteurs & dashboard admin

- **`/admin/login`** — connexion avec `ADMIN_PASSWORD`. Donne accès à `/admin` :
  - onglet **Chefs promoteurs** : créer un compte (identifiant + nom affiché + mot de passe),
    désactiver/réactiver un accès, réinitialiser un mot de passe, voir le nombre de fiches
    collectées par promoteur.
  - onglet **Fiches clients** : toutes les fiches soumises (par les promoteurs ou via le
    catalogue public), filtrables par promoteur, exportables en CSV.
- **`/promoteur/login`** — connexion d'un chef promoteur (identifiants créés par l'admin). Donne
  accès à `/promoteur` : la fiche de renseignements (Nom, Prénoms, Contact, Fonction), à remplir
  une fois par client rencontré sur le terrain — le formulaire se réinitialise après chaque envoi.
- **Dans le catalogue public** (`/`) : la même fiche apparaît comme dernière page du feuilletage
  (juste avant la couverture de fin), pour les clients qui veulent laisser leurs coordonnées
  spontanément. Ces soumissions sont marquées `source: "catalogue"` (aucun promoteur rattaché).

Ces routes ne sont pas mises en avant dans la barre d'outils du catalogue public — elles sont à
partager directement (lien) avec l'admin et les promoteurs concernés.

---

## 7. QR code à imprimer

Une fois le frontend déployé (URL Vercel connue) :

```bash
cd frontend
node scripts/generate-qr.mjs https://catalogue-cookafrica.vercel.app
```

Génère :
- `public/qr-code.png` — utilisé par l'app elle-même si besoin de l'afficher à l'écran.
- `qr-code-print.svg` (à la racine de `frontend/`, non commité) — vectoriel, haute qualité pour
  impression sur table, flyer ou affiche.

---

## 8. Notes techniques

- **Animation de feuilletage** : librairie [`page-flip`](https://github.com/Nodlik/StPageFlip),
  glisser/cliquer le coin d'une page (clic au milieu de la page désactivé, pour ne pas gêner la
  saisie dans le formulaire de la dernière page), flèches clavier ←/→, mode portrait (1 page) sur
  mobile et spread (2 pages) sur tablette/desktop.
- **PWA** : installable, fonctionne hors-ligne pour les pages déjà consultées (mise en cache
  progressive des images via Service Worker, pas de téléchargement forcé de tout le catalogue à
  l'installation).
- **Icônes** : générées par défaut à partir d'un monogramme « CA » aux couleurs de la charte
  (rouge `#7a0e0e` / or `#d4af37`). Remplaçables par un vrai logo transparent : déposez un PNG
  carré et adaptez `frontend/scripts/generate-icons.mjs`.
- **Téléchargement PDF du catalogue** : généré au build (`scripts/build-pdf.mjs`), pas de
  génération à la volée côté serveur — fichier statique `public/catalogue-cookafrica.pdf`.
- **Pop-up de réduction** : au premier chargement (remplacée ensuite par le bouton 🎟 de la barre
  d'outils), affiche un coupon « -15% sur l'addition » généré côté client (`<canvas>`, voir
  `src/composables/useCoupon.js`) avec un code unique et une date de validité calculée à J+5 à
  partir du moment où le visiteur le voit/télécharge. Le visuel est dessiné dynamiquement (pas
  d'image statique) car la date change pour chaque visiteur.
- **Authentification** : JWT signés par le backend (`JWT_SECRET`) — 12h pour l'admin, 30 jours
  pour un chef promoteur. Mots de passe promoteurs hachés avec `bcryptjs`, jamais stockés en clair.
- **Redondance backend** : voir `frontend/src/lib/apiClient.js` — toute requête API (catalogue,
  auth, fiches) essaie `VITE_API_URL` puis, en cas d'échec réseau ou d'erreur 5xx, retente sur
  `VITE_API_URL_FALLBACK`, avant d'abandonner (ou de retomber sur les données embarquées pour le
  catalogue).



Mot de passe admin : gn8iW5xSZTKsoUWl (pour /admin/login)

Comment utiliser le catalogue une fois le frontend sur Vercel :

Clients (scan QR) : pop-up de réduction au premier chargement → bouton « Télécharger mon coupon » (-15%, valable 5 jours). Puis ils feuillettent le menu (glisser le coin de page, flèches ←/→, ou le sélecteur de jour dans la barre d'outils), peuvent télécharger le PDF complet, et remplir une fiche de contact facultative en dernière page.
Chefs promoteurs : <votre-url-vercel>/promoteur/login — connexion avec l'identifiant/mot de passe que vous leur créez depuis le dashboard admin (voir ci-dessous). Ils remplissent une fiche par client rencontré ; le formulaire se réinitialise après chaque envoi.
Vous (admin) : <votre-url-vercel>/admin/login avec gn8iW5xSZTKsoUWl →
onglet Chefs promoteurs : créer un compte (identifiant + nom + mot de passe), désactiver/réactiver, réinitialiser un mot de passe.
onglet Fiches clients : toutes les fiches collectées (promoteurs + soumissions publiques), filtrables par promoteur, exportables en CSV.