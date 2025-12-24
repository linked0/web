#!/usr/bin/env python3
"""
Script to start Jupyter Lab with project-specific configuration.
This ensures new notebooks are saved in the notebooks/ directory.
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    # Get the project root directory
    project_root = Path(__file__).parent.absolute()
    notebooks_dir = project_root / "notebooks"
    
    # Ensure notebooks directory exists
    notebooks_dir.mkdir(exist_ok=True)
    
    # Change to notebooks directory
    os.chdir(notebooks_dir)
    
    # Start Jupyter Lab
    print(f"Starting Jupyter Lab in: {notebooks_dir}")
    print("New notebooks will be saved in the notebooks/ directory by default.")
    
    try:
        subprocess.run(["uv", "run", "jupyter", "lab"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error starting Jupyter Lab: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nJupyter Lab stopped.")

if __name__ == "__main__":
    main()