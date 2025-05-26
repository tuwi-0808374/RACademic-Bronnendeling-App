from flask import *
from flask_cors import CORS
from blueprints.rating.models.rating_model import Rating

rating_bp = Blueprint('rating', __name__)
base = Blueprint('base', __name__)
CORS(rating_bp)
CORS(base)

@rating_bp.route('/rating/<int:user_id>', methods=['POST'])
def create_rating(user_id):
    data = request.get_json()
    return handle_rating_process(data, user_id,'POST')


# @rating_bp.route('/rating/<int:user_rated>', methods=['PATCH'])
@rating_bp.route('/rating/<int:user_id>', methods=['PATCH'])
def update_rating(user_id):
    data = request.get_json()
    return handle_rating_process(data , user_id, 'PATCH')

def handle_rating_process(data ,user_id=None, method=None):
    rating = Rating()
    required_fields = ['target_id', 'rating', 'target']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'status': 'error', 'message': f'Missing {field}'}), 400
    if not user_id :
        return jsonify({'status': 'error', 'message': f'Missing user id '}), 400

    target_id = data.get("target_id")
    rating_value = data.get("rating")
    target = data.get("target")

    result = rating.rate(user_id, target_id, rating_value, target)
    # kijkt of het een update is of een create en geeft de juiste error codes
    if method=="POST":
        if result is None:
            return jsonify({'status': 'error', 'message': f'{target} not found'}), 404
        elif result is False:
            return jsonify({'status': 'error', 'message': f'Already rated this {target}'}), 400
        return jsonify({'status': 'success', 'data': result}), 201
    else:
        if result is None:
            return jsonify({'status': 'error', 'message': f'{target} not found'}), 404
        elif result is False:
            return jsonify({'status': 'error', 'message': f'No change in rating for {target}'}), 400
        return jsonify({'status': 'success', 'data': result}), 200