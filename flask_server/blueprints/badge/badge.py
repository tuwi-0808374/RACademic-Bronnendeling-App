from flask import *
from flask_cors import CORS
from blueprints.badge.models.badge_model import Badge

badge_bp = Blueprint('badge', __name__)
CORS(badge_bp)
base = Blueprint('base', __name__)
CORS(base)

@badge_bp.route('/badge/<int:user_id>', methods=['GET'])
def get_badges_of_user(user_id):
    badge = Badge()
    badges = badge.get_bages_of_user(user_id)
    if not badges:
        return jsonify({'status': 'error', 'message': 'No badges found'}), 404
    return jsonify({'status': 'success', 'data': badges}), 200

@badge_bp.route('/badge/<int:user_id>/<int:badge_id>', methods=['POST'])
def give_badge_to_user(user_id, badge_id):
    badge = Badge()
    result, message = badge.give_badge_to_user(user_id, badge_id)
    if not result:
        return jsonify({'status': 'error', 'message': message}), 400
    return jsonify({'status': 'success', 'message': message}), 200

@badge_bp.route('/badge/check_eligibility/<int:user_id>', methods=['GET'])
def check_if_user_is_eligible_for_badges(user_id):
    badge = Badge()
    badges = badge.check_if_user_is_eligible_for_badges(user_id)
    if not badges:
        return jsonify({'status': 'error', 'message': 'No new badges for user'}), 404
    return jsonify({'status': 'success', 'data': badges}), 200