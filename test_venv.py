#!/usr/bin/env python3
"""
Test imports in virtual environment
"""
import sys
import subprocess

# Path to venv python
venv_python = r"backend\.venv\Scripts\python.exe"

print('Testing virtual environment...')

try:
    # Run test script in venv
    result = subprocess.run([
        venv_python, "backend/test_imports.py"
    ], capture_output=True, text=True, cwd=".")

    print("STDOUT:")
    print(result.stdout)
    if result.stderr:
        print("STDERR:")
        print(result.stderr)

    print(f"Return code: {result.returncode}")

except Exception as e:
    print(f"Error running test: {e}")
