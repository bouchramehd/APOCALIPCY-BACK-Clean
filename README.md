# APOCALIPCY Backend

Backend Node.js avec Express, MongoDB et Ollama pour le traitement automatique de documents PDF avec IA.

## 🚀 Lancement rapide avec Docker

### Prérequis
- Docker installé
- Git installé

### Étapes de lancement

1. **Cloner le projet**
```bash
git clone <votre-repo-url>
cd APOCALIPCY-BACK-Clean
```

2. **Lancer avec Docker Compose**
```bash
docker-compose up --build
```

3. **Attendre le chargement**
- MongoDB démarre sur le port 27018
- Ollama télécharge le modèle Mistral (5-10 minutes)
- Backend démarre sur le port 3000

4. **Accéder à l'application**
- **API Backend** : http://localhost:3000
- **MongoDB Compass** : `mongodb://localhost:27018/apocalipcy`

## 📋 Commandes utiles

### Démarrer en arrière-plan
```bash
docker-compose up -d
```

### Voir les logs
```bash
docker-compose logs -f
```

### Arrêter les services
```bash
docker-compose down
```

## ⚠️ Notes importantes

- **Premier lancement** : Ollama télécharge le modèle Mistral (~4GB)
- **Port MongoDB** : Utilise le port 27018 pour éviter les conflits
- **Hot reload** : Les modifications de code sont automatiquement prises en compte

## 🔍 Dépannage

### Si Ollama ne répond pas :
```bash
docker-compose exec ollama ollama list
```

### Si les ports sont occupés :
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📝 API Endpoints

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/documents/upload` - Upload et résumé de document

