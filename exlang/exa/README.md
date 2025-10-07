# webai

A web AI project for experimentation and development using Jupyter notebooks and Python.

This project provides an organized environment for AI/ML experimentation with proper notebook management and configuration.

## 📓 Jupyter Lab Configuration

This project is configured to organize Jupyter notebooks in a dedicated `notebooks/` folder for better project structure.

### Starting Jupyter Lab

**Option 1: Use the Custom Script (Recommended)**
```bash
python start_jupyter.py
```
This script automatically:
- Changes to the `notebooks/` directory
- Starts Jupyter Lab from there
- Ensures new notebooks are saved in `notebooks/` by default

**Option 2: Manual Configuration**
```bash
# Start Jupyter Lab with the config file
uv run jupyter lab --config=jupyter_lab_config.py
```

**Option 3: Change Directory First**
```bash
cd notebooks
uv run jupyter lab
```

### Project Structure
```
webai/
├── notebooks/           # All Jupyter notebooks go here
│   ├── experiment_01.ipynb
│   ├── experiment_02.ipynb
│   ├── experiment_03.ipynb
│   └── ai_experiment.ipynb
├── ai/                  # AI module
├── start_jupyter.py     # Convenient Jupyter starter script
├── jupyter_lab_config.py # Jupyter configuration
└── pyproject.toml       # Project dependencies
```
## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- [uv](https://docs.astral.sh/uv/) package manager

### Installation

1. Clone the project
```bash
git clone <your-repo-url>
cd webai
```

2. Install dependencies
```bash
uv sync
```

3. Start Jupyter Lab
```bash
python start_jupyter.py
```

### Running the Main Application
```bash
uv run python main.py
```


## 🧪 Development

### Running Tests
```bash
uv run pytest .
```

### Adding New Notebooks
When you create new notebooks in Jupyter Lab (using any of the methods above), they will automatically be saved in the `notebooks/` directory, keeping your project organized.

### Project Dependencies
The project uses `uv` for dependency management. Key dependencies include:
- `jupyterlab>=4.4.7` - Jupyter Lab interface
- `notebook>=7.4.5` - Jupyter notebook support

See `pyproject.toml` for the complete dependency list.

