from flask import *
from flask_server.blueprints.tag.models.tag_model import Tag

tag_bp = Blueprint('tag', __name__)
base = Blueprint('base', __name__)

@tag_bp.route('/tags', methods=['GET'])
def get_tags():
    tag = Tag()
    tags = tag.get_tags()
    if not tags:
        return jsonify({'status': 'error', 'message': 'No posts found'}), 404
    return jsonify({'status': 'success', 'data': tags}), 200