from flask import *
from blueprints.tag.models.tag_model import Tag
from flask_cors import CORS

tag_bp = Blueprint('tag', __name__)
base = Blueprint('base', __name__)
CORS(tag_bp)

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
    tags = tag.get_tags()
    tag_ids= tag.get_tags_by_post_id(post_id)
    data = {
        'tags':tags,
        'tag_ids': tag_ids
    }
    if not tags:
        return jsonify({'status': 'error', 'message': 'No tags found'}), 404
    return jsonify({'status': 'success', 'data': data}), 200

@tag_bp.route('/tag', methods=['POST'])
def create_posts():
    tag = Tag()
    if request.method == "POST":
        data = request.get_json()
        created_tag = tag.post_create_tag(data)
        if not created_tag:
            return jsonify({'status': 'error', 'message': 'error creating tag'}), 404


        return jsonify({'status': 'success', 'data': created_tag}), 200