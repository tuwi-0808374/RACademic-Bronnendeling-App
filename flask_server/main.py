from flask import Flask
import os

from flask_server.blueprints.voorbeeld_blueprint.voorbeeld_models.Example import Example
voorbeeld_bp = Example()

app = Flask(__name__)
app.register_blueprint(voorbeeld_bp)

if __name__ == "__main__":
    app.run(debug=True)