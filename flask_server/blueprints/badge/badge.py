from flask import *

from blueprints.badge.models.badge_model import Badge

badge_bp = Blueprint('badge', __name__)
base = Blueprint('base', __name__)


@badge_bp.route('/badge/<int:user_id>', methods=['GET'])
def get_badges_of_user(user_id):
    data = [
        {'id': 1, 'name': 'Voorbeeld 1'},
        {'id': 2, 'name': 'Voorbeeld 2'}
    ]
    return jsonify({'status': 'success', 'data': data})