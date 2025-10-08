# TypeMaster

A small Flask-based typing/practice web app (project skeleton). This repository contains a lightweight Flask application with authentication routes, templates, static assets, and a small SQLite instance database.

> Quick note: I created this README from the repository files present in this workspace. If you want, I can also add a `requirements.txt` or a setup script to fully pin dependencies.

## Project structure

- `app.py` — application factory / app entrypoint
- `config.py` — configuration settings
- `models.py` — database models
- `routes/` — route blueprints
  - `auth.py` — authentication routes (login/register/logout)
  - `main.py` — main application routes
- `templates/` — Jinja2 HTML templates (`base.html`, `index.html`, `login.html`, `register.html`, `stats.html`)
- `static/` — static files (CSS/JS)
- `instance/users.db` — local SQLite database (already included in the repo)

## Requirements

The app is built with Flask. The minimal Python packages commonly required are:

- Flask
- Flask-Login (if used by the app)
- Flask-SQLAlchemy (if models use SQLAlchemy)

You can install them manually or create a `requirements.txt` and install from it. Example packages (add to `requirements.txt` if you'd like):

```
Flask>=2.0
Flask-Login
Flask-SQLAlchemy
```

## Setup (PowerShell)

1. Create and activate a virtual environment

```powershell
python -m venv .venv
; .\.venv\Scripts\Activate.ps1
```

2. Install dependencies (either from `requirements.txt` or directly)

```powershell
# If you have a requirements.txt
pip install -r requirements.txt

# Or install minimal packages directly
pip install Flask Flask-Login Flask-SQLAlchemy
```

3. Run the application

Option A — using Flask CLI

```powershell
$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"  # optional
flask run --host=127.0.0.1 --port=5000
```

Option B — run directly with Python

```powershell
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## Initial database

This repo already contains `instance/users.db`. If the app expects migrations or a fresh DB, look inside `models.py` for any `db.create_all()` calls or a dedicated initialization script. If none exists, you can typically create the database by running an interactive Python session:

```powershell
python -c "from models import db; from app import create_app; app = create_app(); app.app_context().push(); db.create_all()"
```

(Adjust the import names if your app exposes a different factory or `db` object.)

## Common troubleshooting

- ImportError: missing package — install the missing package with `pip`.
- Database locked or inaccessible — ensure `instance/` exists and has correct permissions; Windows sometimes locks the file if another process holds it.
- Template errors — check `templates/` for missing blocks or incorrectly named templates referenced by routes.
- Environment variables in PowerShell — remember to use `$env:VAR = "value"` syntax.

## Development tips

- Add a `requirements.txt` to pin dependencies:

```powershell
pip freeze > requirements.txt
```

- Use an editor/IDE configured for Python 3.11 (the compiled bytecode in `__pycache__` indicates Python 3.11 was used).
- Add unit tests for `routes/` and `models.py` to catch regressions early.

## Next steps (optional)

- I can generate a `requirements.txt` from the environment or create one with the typical dependencies.
- I can add a small `setup_db.py` script to initialize or reset the SQLite DB safely.
- I can run the app locally to reproduce any runtime errors and fix them if you share the traceback.
 
I added `requirements.txt` and `setup_db.py` to this repository. Details below:

- `requirements.txt` — pins minimal dependencies used by the project (Flask, Flask-Login, Flask-SQLAlchemy).
- `setup_db.py` — utility script to safely drop and recreate the SQLite database used by the app.

### How to use the database setup script (PowerShell)

1. Activate your virtual env

```powershell
; .\.venv\Scripts\Activate.ps1
```

2. Install dependencies

```powershell
pip install -r requirements.txt
```

3. Run the DB initializer

```powershell
python setup_db.py
```

This will drop all tables and recreate them fresh. Use carefully if you have production data.


