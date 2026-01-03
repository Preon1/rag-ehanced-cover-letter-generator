@echo off
echo Testing virtual environment...
backend\.venv\Scripts\python.exe -c "import fastapi, uvicorn, sqlalchemy, psycopg2, passlib; from jose import jwt; print('All imports successful!')"
echo.
echo Testing server start...
backend\.venv\Scripts\python.exe -m uvicorn backend.main_simple:app --host 127.0.0.1 --port 8000 --log-level critical
pause
