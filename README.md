This repository contains an interactive First-Order Logic (FOL) language toolkit, including:
- **Backend**: A parser, constraint solver integration (using Google OR-Tools), and server for FOL formula evaluation.
- **Frontend**: A React-based UI for inputting and visualizing FOL formulas and results.
- **Dev Container**: Docker configuration for a consistent development environment.

## Prerequisites

- **Docker** (for Dev Container) or Node.js (v14+) and Python (3.7+) installed locally.
- **Google OR-Tools** for backend solver integration (`pip install ortools`).
- **ANTLR** (if regenerating parsers): Java runtime and ANTLR tool.
- **npm** for frontend.
- **VS Code Remote - Containers** extension (optional, for Dev Container).

## Development Setup

### Using Docker Dev Container

### Docker Dev Container
We provide a Docker Dev Container with all the requirements installed. To use this, ensure you have VS Code and the [Dev Containers](https://marketplace.visualstudio.com/items/?itemName=ms-vscode-remote.remote-containers) extension installed. 

From VS Code, open the Command Palette with Shift + Command + P (Mac) / Ctrl + Shift + P (Windows/Linux). Enter `Dev Containers: Clone Repository in Container Volume` and paste the link to the repository. Then select the `main` branch. This will create a container running Ubuntu 24.04 with all the requirements and some useful extensions preinstalled.

### Manual Setup

If you prefer to run locally without Docker:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anlhu/cs267a-fol-language.git
   cd cs267a-fol-language-main
   ```
2. **Backend**:
   - Ensure Python 3.7+ is installed.
   - Install dependencies:
     ```bash
     pip install black antlr4-tools antlr4-python3-runtime ortools
     ```
3. **Frontend**:
   - Ensure Node.js (v14+) and npm are installed.
   - From `frontend/`:
     ```bash
     cd frontend
     npm install
     ```

## Backend

The backend handles parsing FOL formulas and solving constraints.


### Running the Server

The server is implemented in `server.js` (Node.js). Ensure you have Node.js installed.

```bash
cd backend
npm install      
node server.js
```

## Frontend

A React app for interacting with the backend and visualizing formulas.

### Installation

```bash
cd frontend
npm install
```

### Running the App

```bash
npm start
```

This runs the development server at http://localhost:3000.

### Building for Production

```bash
npm run build
```



