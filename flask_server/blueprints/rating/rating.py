from flask import *
from lib.utils import get_user_id_from_request

from blueprints.rating.models.rating_model import Rating
rating_bp = Blueprint('rating', __name__)
base = Blueprint('base', __name__)

@rating_bp.route('/rating', methods=['POST'])
def create_rating():
    data = request.get_json()
    return handle_rating_process(data)


@rating_bp.route('/rating/<int:user_rated>', methods=['PATCH'])
def update_rating(user_rated):
    data = request.get_json()
    return handle_rating_process(data, user_rated)

# @rating_bp.route('rating/<int:user_rated>', methods=['DELETE'])
# def delete_user_rating(user_rated):
#     data = request.get_json()


def handle_rating_process(data, user_rated=None):
    user_id = get_user_id_from_request()
    rating = Rating()
    required_fields = ['target_id', 'rating', 'target']
    for field in required_fields:
        if data.get(field) is None:
            return jsonify({'status': 'error', 'message': f'Missing {field}'}), 400

    target_id = data.get("target_id")
    rating_value = data.get("rating")
    target = data.get("target")

    result = rating.rate(user_id, target_id, rating_value, target, user_rated)
    # kijkt of het een update is of een create en geeft de juiste error codes
    print('this',result)
    if user_rated is None:
        if result is None:
            return jsonify({'status': 'error', 'message': f'{target} not found'}), 404
        elif result is False:
            return jsonify({'status': 'error', 'message': f'Already rated this {target}'}), 400
        print(data)
        return jsonify({'status': 'success', 'data': result}), 201
    else:
        if result is None:
            return jsonify({'status': 'error', 'message': f'{target} not found'}), 404
        elif result is False:
            return jsonify({'status': 'error', 'message': f'No change in rating for {target}'}), 400
        print(data)
        return jsonify({'status': 'success', 'data': result}), 200