- **Node.js**
- **MongoDB**
- **Ollama (avec le modèle Mistral)**
- **Express**
- **dotenv**

---

## 🚀 Démarrage Rapide

### 1. Cloner le Dépôt

```bash
git clone <ton-url-depot>
cd <nom-du-dossier>
2. Installer les Dépendances
bash
Copier
Modifier
npm install
3. Configurer les Variables d’Environnement
Crée un fichier .env à la racine du projet et ajoute :

env
Copier
Modifier
PORT=3000
MONGO_URI=ton_uri_mongodb
OLLAMA_HOST=http://localhost:11434
MODEL_NAME=mistral
⚠️ Remplace ton_uri_mongodb par ton lien de connexion réel à MongoDB.

▶️ Lancer le Serveur
Démarre le serveur avec :

bash
Copier
Modifier
node src/server.js
Le serveur écoute sur le port défini dans .env (par défaut : 3000).

🧠 Modèle IA (Ollama + Mistral)
Assure-toi d’avoir installé Ollama et téléchargé le modèle Mistral. Lance le modèle avec :

bash
Copier
Modifier
ollama run mistral
Si c’est ta première fois, Ollama va télécharger automatiquement le modèle.

Ollama : https://ollama.com

Mistral : https://mistral.ai

🗃️ Base de Données : MongoDB
L'application utilise MongoDB. Assure-toi que ton serveur MongoDB est actif et que MONGO_URI est correctement défini dans .env.

📁 Structure du Projet
bash
Copier
Modifier
├── src/
│   ├── server.js        # Point d’entrée du serveur
│   ├── routes/          # Routes Express (optionnel)
│   └── controllers/     # Logique métier (optionnel)
├── .env                 # Variables d’environnement
├── package.json
└── README.md
📬 API
Tu peux documenter tes routes API ici plus tard.

🛠️ Commandes Utiles
npm install	Installer les dépendances
node src/server.js	Lancer le serveur backend


✅ Exemple de fichier .env
env
Copier
Modifier
PORT=3000
MONGO_URI=mongodb://localhost:27017/nom-de-ta-db
OLLAMA_HOST=http://localhost:11434
MODEL_NAME=mistral
yaml
Copier
Modifier
