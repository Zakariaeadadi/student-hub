# Student Hub 🎓

**Student Hub** est une marketplace étudiante full-stack permettant aux étudiants de publier, rechercher et échanger des annonces (livres, matériel, services). Projet développé dans une optique d'apprentissage approfondi, avec une architecture backend/frontend séparée, une authentification JWT complète, et des fonctionnalités avancées (favoris, avis/notations, upload d'images).

## ✨ Fonctionnalités

### Cœur de l'application
- **Authentification JWT** complète (inscription, connexion, routes protégées)
- **CRUD complet** des annonces avec contrôle d'ownership (seul le propriétaire peut modifier/supprimer son post)
- **Catégories** pour classer les annonces
- **Recherche, filtrage par catégorie et pagination** combinables

### Fonctionnalités avancées
- **Upload d'images** avec validation (type MIME, taille max), stockage local et remplacement sécurisé
- **Favoris** : ajout/retrait d'annonces, page dédiée
- **Avis et notations** : système de reviews avec règles métier (un avis par utilisateur par post, impossibilité de noter son propre post), calcul de note moyenne
- **Statut de l'annonce** : marquer un post comme vendu / disponible
- **Contact direct** : boutons d'appel et d'email vers le vendeur
- **Suppression de compte** avec cascade complète (favoris, avis, posts et images associés)
- **Gestion d'erreurs** cohérente : les messages d'erreur précis du backend sont relayés jusqu'à l'utilisateur

## 🛠️ Stack technique

**Backend**
- Java 21 / Spring Boot 4.1.1
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL 8 (via Docker) — H2 disponible pour un démarrage rapide sans dépendance externe
- Validation (Bean Validation / `@Valid`)

**Frontend**
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- [Lucide React](https://lucide.dev/) pour les icônes

**Infrastructure**
- Docker / Docker Compose pour la base de données MySQL

## 🏗️ Architecture

Le backend suit une architecture en couches classique :

```
Controller  → gestion HTTP, validation des entrées
Service     → logique métier, règles d'autorisation (ownership)
Repository  → persistance (Spring Data JPA)
Entity      → modèle de données JPA
DTO         → forme des données échangées avec le client
Security    → filtre JWT, UserDetailsService, configuration Spring Security
Exception   → gestion centralisée des erreurs (@ControllerAdvice)
```

Le frontend est structuré par responsabilité :

```
api/        → instances axios et appels aux différentes ressources
pages/      → vues au niveau des routes
components/ → composants réutilisables
context/    → gestion de l'authentification (AuthContext)
routes/     → définition des routes et protection des routes privées
utils/      → helpers (gestion des erreurs, etc.)
```

## 🚀 Installation

### Prérequis
- Java 21+
- Node.js 18+
- Docker et Docker Compose
- Maven (ou utiliser le wrapper `./mvnw` fourni)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Zakariaeadadi/student-hub.git
cd student-hub
```

### 2. Backend

#### Base de données (MySQL via Docker)

Dans `backend/`, créer un fichier `.env` :

```env
MYSQL_DATABASE=studenthub
MYSQL_USER=studenthub_user
MYSQL_PASSWORD=studenthub_pass
MYSQL_ROOT_PASSWORD=root_pass
```

Démarrer la base :

```bash
cd backend
docker compose up -d
```

#### Variables d'environnement

Le projet utilise des variables d'environnement pour les secrets (JWT, identifiants MySQL) — elles ne sont jamais commitées dans le code :

```bash
export JWT_SECRET=$(openssl rand -base64 32)
export MYSQL_USER=studenthub_user
export MYSQL_PASSWORD=studenthub_pass
```

> Astuce : ajoutez ces lignes à votre `~/.bashrc` (ou équivalent) pour qu'elles soient disponibles à chaque session.

#### Lancer le backend

```bash
./mvnw spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`. Par défaut, le profil actif est `mysql` (configurable dans `application.properties`). Un profil `h2` est également disponible pour tester rapidement sans Docker.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## 📡 Aperçu des endpoints API

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/categories

GET    /api/posts                 (recherche, filtre, pagination)
POST   /api/posts
GET    /api/posts/{id}
PUT    /api/posts/{id}
DELETE /api/posts/{id}
GET    /api/posts/my
PATCH  /api/posts/{id}/status
POST   /api/posts/{id}/image

POST   /api/posts/{id}/favorite
DELETE /api/posts/{id}/favorite
GET    /api/users/me/favorites

POST   /api/posts/{id}/reviews
GET    /api/posts/{id}/reviews

DELETE /api/users/me
```

Toutes les routes de lecture publique (posts, catégories, avis) sont accessibles sans authentification ; les actions de création/modification nécessitent un JWT valide.

## 🔒 Sécurité

- Mots de passe hashés (BCrypt)
- JWT stateless avec expiration configurable
- Contrôle d'ownership systématique en couche Service (un utilisateur ne peut agir que sur ses propres ressources)
- Validation des fichiers uploadés (type MIME, taille, nommage sécurisé)
- Secrets externalisés via variables d'environnement, jamais commités

## 📌 Pistes d'évolution

- Tests automatisés (unitaires et d'intégration)
- Déploiement en ligne (backend + frontend + base de données)
- Rôle administrateur pour la modération

## 📄 Licence

Projet réalisé à des fins pédagogiques.
