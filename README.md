<p align="center">
  <img src="frontend/src/assets/poly.png" alt="École Polytechnique de Sousse" height="80"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="frontend/public/favicon.svg" alt="Vultester" height="80"/>
</p>

<h1 align="center">Vultester</h1>
<h3 align="center">Système Expert de Détection de Vulnérabilités Serveur</h3>

---

## Description

Vultester est un système expert développé pour détecter automatiquement les vulnérabilités de configuration serveur. Il utilise un moteur d'inférence basé sur le chaînage (avant, arrière et mixte) avec une base de 50 règles expertes.

## Fonctionnalités

- **50 règles expertes** couvrant 7 catégories de sécurité
- **3 moteurs d'inférence**: Chaînage avant, arrière et mixte
- **4 niveaux de diagnostic**: Critique, Dangereux, Attention, Acceptable
- **Recommandations de correction** pour chaque vulnérabilité
- **Trace d'inférence** expliquant le raisonnement
- **Interface web moderne** React + Tailwind CSS

## Catégories de Vulnérabilités

| Catégorie | Description | Exemples |
|-----------|-------------|----------|
| Ports | Ports réseau exposés | SSH, Telnet, FTP, MySQL |
| SSL/TLS | Configuration chiffrement | Certificats, TLS versions |
| SSH | Accès distant | Root login, authentification |
| Permissions | Droits fichiers | 777, clés privées |
| Logiciels | Versions services | Apache, Nginx, PHP |
| Base de données | Configuration BDD | Redis, MongoDB, PostgreSQL |
| Réseau | Pare-feu et routage | Firewall, IP forwarding |

## Architecture

```
server-vulnerability-expert/
├── backend/
│   ├── app.py              # API Flask + Moteur d'inférence
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/          # Home, Scanner, KnowledgeBase, About
│   │   ├── components/     # Navbar, Button
│   │   ├── data/           # Configuration des options
│   │   └── types/          # Types TypeScript
│   └── ...
└── rapport/
    └── rapport.tex         # Rapport technique LaTeX
```

## Installation

### Backend (Python/Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Le serveur démarre sur `http://localhost:5000`

### Frontend (React/Vite)

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`

## Utilisation

1. Accéder à l'interface web
2. Cliquer sur "Lancer l'analyse"
3. Sélectionner les configurations serveur (7 étapes)
4. Choisir la méthode de chaînage
5. Consulter les résultats et recommandations

## API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/analyze` | POST | Analyser une configuration |
| `/api/rules` | GET | Liste des 50 règles |
| `/api/rules/<id>` | GET | Détail d'une règle |
| `/api/health` | GET | État du système |

## Technologies

- **Backend**: Python 3, Flask, Flask-CORS
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Moteur d'inférence**: Implémentation manuelle (sans bibliothèques)

## Licence

Projet académique - École Polytechnique de Sousse
