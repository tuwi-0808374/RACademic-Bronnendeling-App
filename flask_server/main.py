from flask import Flask, jsonify
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/members')
def members():
    return jsonify({
        "members": ["Member1", "Member2", "Member3", "Membertest"] 
    })


if __name__ == "__main__":
    app.run(debug=True)