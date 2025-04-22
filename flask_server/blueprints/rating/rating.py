from flask import *

from flask_server.blueprints.rating.models.rating_model import Rating

rating_bp = Blueprint('rating', __name__)
base = Blueprint('base', __name__)

@rating_bp.route('/rating', methods=['POST'])
def rate_post():
    rating = Rating()
    user_id = 1

    if request.method == "POST":
        target_id = request.args.get("target_id", type=int)
        rating_value = request.args.get("rating", type=int)
        target = request.args.get("target", type=str)
        result = rating.rate(user_id, target_id, rating_value, target)

        if not result:
            return jsonify({'status': 'error', 'message': f'No {target} found'}), 404
        return jsonify({'status': 'success', 'data': result}), 200