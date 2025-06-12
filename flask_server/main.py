from flask import Flask, jsonify, blueprints, Blueprint
import os
from flask_cors import CORS
from flask_jwt_extended import JWTManager


from blueprints.post.post import post_bp
from blueprints.tag.tag import tag_bp
from blueprints.account.account import account_bp
from blueprints.rating.rating import rating_bp
from blueprints.badge.badge import badge_bp

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

app.config["JWT_SECRET_KEY"] = "geheim"

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
jwt = JWTManager(app)


app.register_blueprint(post_bp)
app.register_blueprint(tag_bp)
app.register_blueprint(rating_bp)
app.register_blueprint(account_bp)
app.register_blueprint(badge_bp)


if __name__ == "__main__":
    app.run(host="0.0.0.0")