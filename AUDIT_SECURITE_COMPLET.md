# Audit de Sécurité Complet Multi-Domaines & Rapport de Remédiation
**Plateforme :** Manager Pro (Gestion de Flotte Automobile)  
**Date d'audit :** Septembre 2026  
**Statut :** Remédiations appliquées & Recommandations de production  
**Auteurs :** Antigravity & Équipe de Sécurité Applicative  

---

## Synthèse Exécutive

Dans le cadre du déploiement et de la stabilisation de **Manager Pro** sur Vercel, un audit de sécurité approfondi ainsi qu'une restructuration du parcours de navigation ont été menés. 

Cet audit a permis :
1. **La résolution de l'erreur Vercel 404 (NOT_FOUND)** par la configuration de règles de réécriture (*rewrites*) et l'intégration d'en-têtes HTTP de sécurité avancés (`vercel.json`).
2. **La fluidification du parcours utilisateur** garantissant une navigation cohérente entre la vitrine publique (**Accueil/Landing**), la page d'authentification (**Login/Auth**) et le tableau de bord métier (**App/Dashboard**).
3. **L'élimination immédiate de vulnérabilités critiques** dans la gestion de l'authentification (suppression des mots de passe maîtres codés en dur, des portes dérobées via `localStorage`, de l'exposition d'identifiants personnels et du rôle administrateur accordé par défaut).
4. **La cartographie exhaustive des risques résiduels** sur 7 domaines de sécurité (authentification, contrôle d'accès RLS, réseau & hébergement, gestion des secrets, chaîne logistique logicielle/npm, injection & XSS, conformité RGPD).

---

## 1. Analyse & Correction du Déploiement Vercel (Erreur 404)

### A. Diagnostic de l'Erreur (`Capture.PNG`)
- **Symptôme :** Accès direct ou rechargement sur `https://manager-pro-weld.vercel.app/landing` générant une erreur `404: NOT_FOUND` (Code: `NOT_FOUND`, ID: `cdg1::bcwrf-1788599184156-26ac3e04a646`).
- **Origine :** L'application est une Single Page Application (SPA) propulsée par Vite et React Router. Par défaut, le serveur web de Vercel tente de localiser une ressource statique physique correspondant au chemin demandé (`/landing`, `/auth`, `/app`, etc.). En l'absence de ce fichier sur le disque du serveur edge, un code 404 est renvoyé.

### B. Solution Implémentée (`vercel.json`)
Deux fichiers `vercel.json` ont été déployés (à la racine du dépôt et dans le sous-répertoire applicatif) assurant le routage universel vers `/index.html` et l'injection d'en-têtes HTTP de durcissement :

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

## 2. Parcours Utilisateur & Ergonomie de Navigation

L'exigence formulée :
> *"Je ne vais pas naviguer directement sur chaque ligne de la page. Je dois d'abord passer sur la page app, la page login, et la page accueil, donc ne navigue pas directement."*

### Structure des Redirections & Liens
| Page | Routes associées | Visiteur non connecté | Utilisateur connecté | Actions & Liens disponibles |
| :--- | :--- | :--- | :--- | :--- |
| **Accueil (Landing)** | `/landing`, `/accueil` | Page de présentation active | Page de présentation active | Bouton « Mon Espace / Accéder au tableau de bord » vers `/app` si connecté ; « Se connecter / S'abonner » vers `/auth` si anonyme. |
| **Connexion (Auth)** | `/auth`, `/login` | Formulaire Connexion / Inscription | Redirection automatique vers `/` | Bouton « ← Retour à l'accueil » (`/landing`) ; bascule rapide Connexion/Inscription. |
| **Application (Dashboard)** | `/`, `/app` | Redirection protégée vers `/landing` | Tableau de bord principal | Menu profil dans le Header avec lien direct « Page d'accueil » (`/landing`) et bouton de déconnexion sécurisé. |

---

## 3. Audit Approfondi des 7 Domaines de Sécurité

### Domaine 1 : Authentification & Gestion des Sessions (Supabase Auth)
- **Constat Initial (CRITIQUE) :**
  - Le fichier `AuthContext.tsx` contenait un tableau de mots de passe maîtres codés en dur (`MASTER_PASSWORDS = ['Admin67890', 'MasterAdmin2026!', 'admin', 'admin123', 'admin2026']`).
  - Présence d'un mécanisme de « Magic Session » contournant complètement Supabase via `localStorage.getItem('fleet_magic_role')`.
  - Attribution arbitraire d'un faux token JWT client (`magic-master-token`) valable 30 jours.
  - Attribution automatique du rôle `admin` si aucun rôle n'était trouvé dans la base (`setRole(userRole || 'admin')`).
  - Exposition en clair de l'adresse email personnelle du développeur (`dodooalberic6@gmail.com`).
- **Remédiation Immédiate Effectuée :**
  - Éradication totale de `MASTER_PASSWORDS`, des fonctions de backdoor `loginAsMasterAdmin` et des lectures/écritures de clés de stockage arbitraires (`fleet_magic_*`).
  - L'authentification s'effectue exclusivement via l'API sécurisée Supabase (`supabase.auth.signInWithPassword` et `supabase.auth.signUp`).
  - Application stricte du **principe de moindre privilège** : en cas d'absence de rôle ou d'erreur de résolution, l'utilisateur se voit assigner le rôle minimal `lecteur` (lecture seule), jamais `admin`.
  - Nettoyage des entrées de formulaires (`email.trim()`, `fullName.trim()`).

---

### Domaine 2 : Contrôle d'Accès & RBAC (Frontend vs Supabase RLS)
- **Analyse du Modèle :** L'application définit 3 rôles hiérarchiques :
  1. `admin` : Administration complète (véhicules, chauffeurs, paramètres, alertes, utilisateurs).
  2. `gestionnaire` : Gestion opérationnelle (saisie d'entretiens, carburant, pannes, réservations).
  3. `lecteur` : Consultation des tableaux de bord et états sans droit de modification.
- **Risque Identifié :** La vérification `canEdit` et `isAdmin` côté React (`ProtectedRoute.tsx`, boutons conditionnels) est une protection **purement cosmétique et d'interface**. Tout utilisateur peut techniquement exécuter des requêtes directes via le client JavaScript Supabase avec sa clé d'accès.
- **Recommandation Majeure (RLS en Base) :**
  Toutes les tables doivent disposer de la sécurité au niveau des lignes (*Row Level Security*) activée :
  ```sql
  -- Exemple de politique RLS sur la table des véhicules
  ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

  -- Politique de lecture pour tout utilisateur authentifié
  CREATE POLICY "Lecture véhicules pour tous" ON public.vehicles
  FOR SELECT TO authenticated USING (true);

  -- Politique de modification réservée aux gestionnaires et admins
  CREATE POLICY "Modification véhicules réservée aux gestionnaires et admins" ON public.vehicles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name IN ('admin', 'gestionnaire')
    )
  );
  ```

---

### Domaine 3 : Sécurité Réseau, Vercel & En-têtes HTTP
- **En-têtes configurés dans `vercel.json` :**
  - `X-Frame-Options: SAMEORIGIN` : Bloque l'inclusion de l'application dans des iframes tierces, neutralisant les attaques par Clickjacking.
  - `X-Content-Type-Options: nosniff` : Empêche les navigateurs de deviner le type MIME des fichiers (lutte contre les attaques par téléchargement malveillant).
  - `Referrer-Policy: strict-origin-when-cross-origin` : Protège la confidentialité des URL internes lors des requêtes sortantes.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` : Désactive l'accès aux capteurs matériels non requis par l'application.
- **Recommandation Complémentaire :**
  - Mettre en place un `Content-Security-Policy` (CSP) progressif pour restreindre les sources autorisées de scripts et de connexions (autoriser `https://*.supabase.co` et bloquer les scripts inline non signés).

---

### Domaine 4 : Gestion des Secrets & Variables d'Environnement
- **Audit des Fichiers de Configuration :**
  - Les clés présentes dans `.env` (`VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`) sont des clés publiques anon nécessaires au client React dans le navigateur.
  - Le fichier `.gitignore` a été vérifié et renforcé à la racine pour garantir que `.env`, `.env.*` (à l'exception de `.env.example`) ne soient jamais versionnés dans le dépôt Git public.
- **Règle Fondamentale :**
  - La clé **Service Role** de Supabase (`service_role key`) ne doit **JAMAIS** être préfixée par `VITE_` ni importée dans le frontend. Elle contourne toutes les règles RLS et doit rester confinée aux Edge Functions ou serveurs backend.

---

### Domaine 5 : Dépendances & Vulnérabilités Logicielles (`npm audit`)
- **Résultat de l'analyse automatique :**
  - **25 vulnérabilités détectées** (1 critique, 17 hautes, 6 modérées, 1 faible).
- **Vulnérabilités Notables :**
  1. **`jspdf` (Gravité : CRITIQUE)** : Vulnérabilité d'injection PDF dans `AcroForm` et `addJS` permettant l'exécution arbitraire de code JavaScript lors de la génération de rapports.
  2. **`xlsx` (SheetJS) (Gravité : HAUTE)** : Pollution de prototype (*Prototype Pollution*) et déni de service par expression régulière (ReDoS) lors du parsing de feuilles de calcul Excel.
  3. **`flatted`, `lodash`, `minimatch`, `glob`, `nanoid` (Gravité : HAUTE)** : Vulnérabilités de ReDoS, dépassements et pollutions d'objets sur les utilitaires de traitement de structures de données.
  4. **`rollup`, `esbuild` / `vite` (Gravité : HAUTE / MODÉRÉE)** : Failles de traversée de chemin (*Path Traversal*) et requêtes serveur dev non autorisées.
- **Plan d'Action Conseillé :**
  1. Exécuter `npm audit fix` pour mettre à jour automatiquement les sous-dépendances compatibles.
  2. Remplacer la bibliothèque non maintenue `xlsx` par des alternatives modernes sécurisées (telles que `exceljs`).
  3. Mettre à jour `jspdf` vers la dernière version stable ou sanitisante les métadonnées PDF.

---

### Domaine 6 : Injection, XSS & Uploads de Fichiers
- **Surface d'exposition :** Formulaires de saisie d'immatriculation, kilomètres, montants de carburant, fiches chauffeurs, pièces jointes d'entretiens.
- **Protections React Natives :** JSX échappe automatiquement les chaînes de caractères rendues dans le DOM, ce qui protège contre le XSS direct classique.
- **Gestion des Fichiers & Justificatifs :**
  - Les justificatifs de carburant et photos de véhicules doivent faire l'objet d'une validation stricte côté Supabase Storage :
    - Liste blanche de types MIME autorisés : `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.
    - Taille maximale par fichier : 5 Mo.
    - Utilisation de buckets privés avec URL signées temporaires (*Signed URLs*) pour les documents contractuels ou d'assurance.

---

### Domaine 7 : Confidentialité & Données Personnelles (RGPD / APDP)
- **Données Sensibles Identifiées :**
  - Identité complète des chauffeurs, numéros de permis, dates d'expiration, numéros de téléphone d'urgence.
  - Historique de géolocalisation et trajets de véhicules.
- **Mesures de Conformité Requises :**
  1. **Droit d'accès et d'effacement :** Implémenter une procédure permettant la purge ou l'anonymisation des données d'un chauffeur quittant l'entreprise.
  2. **Minimisation des données :** Ne collecter que les informations strictement nécessaires à la gestion de la flotte.
  3. **Journalisation (*Audit Logging*) :** Tracer les modifications sensibles (création/suppression de véhicules, attribution de rôles administratifs) afin de disposer d'un historique d'audit incontestable.

---

## 4. Matrice de Synthèse des Actions

| Composant / Règle | Statut Avant | Action Menée | Statut Actuel |
| :--- | :---: | :--- | :---: |
| **Routage Vercel (404)** | ❌ Échec direct sur `/landing` | Création de `vercel.json` avec réécriture `/index.html` | ✅ Corrigé |
| **En-têtes HTTP Sécurité** | ❌ Aucun en-tête | Ajout `X-Frame-Options`, `X-Content-Type-Options`, etc. | ✅ Sécurisé |
| **Navigation Accueil ↔ Login ↔ App** | ⚠️ Risque de rupture | Alias de routes, boutons de retour et liens croisés | ✅ Fluide |
| **Mots de passe maîtres & Backdoor** | ❌ Présents en dur | Retrait total de `MASTER_PASSWORDS` et `fleet_magic_*` | ✅ Éliminé |
| **Rôle par défaut** | ❌ Fallback `admin` | Application du moindre privilège : fallback `lecteur` | ✅ Sécurisé |
| **Protection du fichier `.env`** | ⚠️ Absent à la racine | `.gitignore` créé et vérifié | ✅ Sécurisé |
| **Dépendances npm** | ⚠️ 25 vulnérabilités | Audit documenté + recommandations de mise à niveau | 📋 À planifier en CI |

---

## Conclusion

L'application **Manager Pro** dispose désormais d'un environnement de déploiement stable sur Vercel sans erreur 404, d'un parcours de navigation ergonomique entre les espaces public et privé, et d'un noyau d'authentification exempt des vulnérabilités critiques identifiées.
Le respect des recommandations RLS et la mise à jour des dépendances permettront d'assurer un niveau de sécurité optimal en production.
