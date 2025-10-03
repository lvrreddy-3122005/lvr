from flask import Flask
from flask_login import LoginManager
from models import db
from routes.auth import auth_bp
from routes.main import main_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = "auth.login"

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)

# Initialize DB
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
