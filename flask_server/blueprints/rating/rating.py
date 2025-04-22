from flask import *

from flask_server.blueprints.rating.models.rating_model import Rating

rating_bp = Blueprint('rating', __name__)
base = Blueprint('base', __name__)

@rating_bp.route('/rating', methods=['POST'])
def create_rating():
    rating = Rating()
    required_fields = ['user_id', 'target_id', 'rating', 'target']

    data = request.get_json()
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'status': 'error', 'message': f'Missing {field}'}), 400
    user_id = data.get('user_id')
    target_id = data.get("target_id")
    rating_value = data.get("rating")
    target = data.get("target")

    result = rating.rate(user_id, target_id, rating_value, target)
    if result is None:
        return jsonify({'status': 'error', 'message': f'{target} not found'}), 404
    elif result is False:
        return jsonify({'status': 'error', 'message': f'No change in rating for {target}'}), 400
    return jsonify({'status': 'success', 'data': result}), 201

@rating_bp.route('/rating/<int:userRated>', methods=['PATCH'])
def update_rating(userRated):
    rating = Rating()
    required_fields = ['user_id', 'target_id', 'rating', 'target']

    data = request.get_json()
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'status': 'error', 'message': f'Missing {field}'}), 400
    user_id = data.get('user_id')
    target_id = data.get("target_id")
    rating_value = data.get("rating")
    target = data.get("target")

    result = rating.rate(user_id, target_id, rating_value, target)
    
    if result is None:
        return jsonify({'status': 'error', 'message': f'{target} not found'}), 404
    elif result is False:
        return jsonify({'status': 'error', 'message': f'No change in rating for {target}'}), 400

    return jsonify({'status': 'success', 'data': result}), 200

