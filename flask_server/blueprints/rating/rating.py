from flask import *

from flask_server.blueprints.rating.models.rating_model import Rating

rating_bp = Blueprint('rating', __name__)
base = Blueprint('base', __name__)

@rating_bp.route('/rating', methods=['POST'])
def create_rating():
    rating = Rating()
    if request.method == "POST":
        user_id = 1
        target_id = request.args.get("target_id", type=int)
        rating_value = request.args.get("rating", type=int)
        target = request.args.get("target", type=str)
        result = rating.rate(user_id, target_id, rating_value, target,'create')

        if not result:
            return jsonify({'status': 'error', 'message': f'Not able to rate {target}'}), 404
        return jsonify({'status': 'success', 'data': result}), 201

@rating_bp.route('/rating', methods=['PATCH'])
def update_rating():
    rating = Rating()

    if request.method == "PATCH":
        user_id = 1
        target_id = request.args.get("target_id", type=int)
        rating_value = request.args.get("rating", type=int)
        target = request.args.get("target", type=str)

        result = rating.rate(user_id, target_id, rating_value, target)

        if not result:
            return jsonify({'status': 'error', 'message': f'Not able to rate {target}'}), 404
        return jsonify({'status': 'success', 'data': result}), 200

