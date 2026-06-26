# Catalogue Cook Africa

Catalogue numérique du menu Cook Africa, accessible par QR code : on le feuillette comme un vrai
magazine (animation de tournage de page), on peut sauter directement à un jour, et le télécharger
en PDF. Architecture :

```
CATALOGUE-COOKAFRICA/
├── frontend/   PWA Vue 3 + Vite — déployée sur Vercel
├── backend/    API Express + Firestore — déployée sur Cloud Run (free tier)
└── .github/workflows/deploy-backend.yml   CI/CD du backend (GitHub Actions)
```

Le frontend embarque une copie statique du catalogue (`frontend/src/data/catalog.js`) : le site
fonctionne donc **même sans backend déployé**. Le backend + Firestore servent uniquement si vous
voulez pouvoir modifier le menu (ordre des pages, libellés, images) sans refaire un déploiement
Vercel.

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
cp .env.example .env   # puis renseigner les variables FIREBASE_*
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
   npm run prep:images
   npm run prep:pdf
   ```
3. Si le texte des plats a changé, mettez aussi à jour `frontend/src/data/catalog.js`
   (et, si le backend est en service, republiez via `npm run seed` côté backend — voir §3.4).
4. Commitez et poussez : Vercel redéploie automatiquement (§4).

---

## 3. Firebase (Firestore) — pour modifier le menu sans redéployer

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
3. Localement, copiez-les dans `backend/.env` (voir `backend/.env.example`).

### 3.3 Règles Firestore

Le document est lu uniquement via le backend (clé de service, accès total), jamais directement
depuis le navigateur — donc les règles par défaut (tout refuser côté client) suffisent. Dans
**Firestore > Règles** :

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

Une fois le backend déployé (§5), vous pouvez aussi modifier directement le document Firestore
(console Firebase, onglet Firestore) — ou via l'API :

```bash
curl -X PUT https://<votre-service>.run.app/api/catalog \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  --data-binary @catalogue-modifie.json
```

`ADMIN_TOKEN` est le secret que vous choisissez (§5.2). Le frontend récupère ces données au
chargement via `GET /api/catalog` (avec repli automatique sur les données embarquées si l'API est
hors-ligne).

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
   - **Variable d'environnement** (optionnel) : `VITE_API_URL` = URL Cloud Run du §5, une fois
     connue.
4. Déployez. Chaque `git push` sur la branche principale redéploie automatiquement (continu).

---

## 5. Déploiement du backend (Cloud Run, gratuit, via GitHub Actions)

### 5.1 Préparer le projet GCP

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

### 5.2 Secrets GitHub (Settings → Secrets and variables → Actions)

| Secret | Valeur |
|---|---|
| `GCP_SA_KEY` | contenu complet du fichier `github-deployer-key.json` |
| `FIREBASE_PROJECT_ID` | `project_id` du compte de service Firebase (§3.2) |
| `FIREBASE_CLIENT_EMAIL` | `client_email` du compte de service Firebase |
| `FIREBASE_PRIVATE_KEY` | `private_key` du compte de service Firebase — **collez les retours à la ligne sous forme littérale `\n`** (le code les reconvertit automatiquement) |
| `ADMIN_TOKEN` | un secret généré par vous, ex. `openssl rand -hex 32` — protège `PUT /api/catalog` |
| `CORS_ORIGINS` | l'URL Vercel du frontend une fois connue (ex. `https://catalogue-cookafrica.vercel.app`), ou `*` en attendant |

### 5.3 Déployer

Le workflow `.github/workflows/deploy-backend.yml` se déclenche automatiquement à chaque `push`
sur `main` qui touche `backend/**`. Vous pouvez aussi le lancer manuellement depuis l'onglet
**Actions** du dépôt GitHub (« Run workflow »).

Une fois le déploiement terminé, récupérez l'URL du service (visible dans les logs du workflow,
ou via `gcloud run services describe catalogue-cookafrica-api --region europe-west1 --format='value(status.url)'`),
puis :

- Renseignez-la comme variable `VITE_API_URL` sur Vercel (§4) et redéployez le frontend.
- Mettez à jour le secret `CORS_ORIGINS` avec l'URL exacte de votre frontend Vercel.

> **Coût** : Cloud Run facture à l'usage avec un palier gratuit mensuel généreux (2 millions de
> requêtes, 360 000 Gio-s de mémoire). `--min-instances=0` (déjà dans le workflow) garantit qu'on
> ne paie rien en l'absence de trafic.

---

## 6. QR code à imprimer

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

## 7. Notes techniques

- **Animation de feuilletage** : librairie [`page-flip`](https://github.com/Nodlik/StPageFlip),
  glisser/cliquer un coin de page, flèches clavier ←/→, mode portrait (1 page) sur mobile et
  spread (2 pages) sur tablette/desktop.
- **PWA** : installable, fonctionne hors-ligne pour les pages déjà consultées (mise en cache
  progressive des images via Service Worker, pas de téléchargement forcé de tout le catalogue à
  l'installation).
- **Icônes** : générées par défaut à partir d'un monogramme « CA » aux couleurs de la charte
  (rouge `#7a0e0e` / or `#d4af37`). Remplaçables par un vrai logo transparent : déposez un PNG
  carré dans `frontend/scripts/generate-icons.mjs` (ou fournissez `logo.png` et adaptez le script).
- **Téléchargement PDF** : généré au build (`scripts/build-pdf.mjs`), pas de génération à la volée
  côté serveur — fichier statique `public/catalogue-cookafrica.pdf`.
