from flask import *
from blueprints.tag.models.tag_model import Tag

tag_bp = Blueprint('tag', __name__)
base = Blueprint('base', __name__)

@tag_bp.route('/tags', methods=['GET'])
def get_tags():
    tag = Tag()
    tags = tag.get_tags()
    if not tags:
        return jsonify({'status': 'error', 'message': 'No tags found'}), 404
    return jsonify({'status': 'success', 'data': tags}), 200


@tag_bp.route('/tags_by_post_id/<int:post_id>', methods=['GET'])
def get_tags_by_post_id(post_id):
    tag = Tag()
    tags = tag.get_tags_by_post_id(post_id)
    if not tags:
        return jsonify({'status': 'error', 'message': 'No tags found'}), 404
    return jsonify({'status': 'success', 'data': tags}), 200