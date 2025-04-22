from flask import Flask, jsonify, blueprints, Blueprint
import os
from flask_cors import CORS

from blueprints.post.post import post_bp
from blueprints.tag.tag import tag_bp
from blueprints.rating.rating import rating_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(post_bp)
app.register_blueprint(tag_bp)
app.register_blueprint(rating_bp)

@app.route('/members')
def members():
    return jsonify({
        "members": ["Member1", "Member2", "Member3", "Membertest"] 
    })


if __name__ == "__main__":
    app.run(debug=True)