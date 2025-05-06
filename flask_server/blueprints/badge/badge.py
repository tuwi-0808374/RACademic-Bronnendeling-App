from flask import *

from blueprints.badge.models.badge_model import Badge

badge_bp = Blueprint('badge', __name__)
base = Blueprint('base', __name__)


@badge_bp.route('/badge/<int:user_id>', methods=['GET'])
def get_badges_of_user(user_id):
    badge = Badge()
    badges = badge.get_bages_of_user(user_id)
    if not badges:
        return jsonify({'status': 'error', 'message': 'No badges found'}), 404
    return jsonify({'status': 'success', 'data': badges}), 200