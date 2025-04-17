from flask import *

from blueprints.post.models.post_model import Post

post_bp = Blueprint('post', __name__)
base = Blueprint('base', __name__)

@post_bp.route('/example', methods=['GET'])
def get_examples():
    data = [
        {'id': 1, 'name': 'Voorbeeld 1'},
        {'id': 2, 'name': 'Voorbeeld 2'}
    ]
    return jsonify({'status': 'success', 'data': data})

@post_bp.route('/posts', methods=['GET'])
def get_posts():
    post = Post()
    posts = post.get_posts()
    if not posts:
        return jsonify({'status': 'error', 'message': 'No posts found'}), 404
    return jsonify({'status': 'success', 'data': posts}), 200


@post_bp.route('/posts/<int:id>', methods=['GET'])
def get_posts_by_id(id):
    post = Post()
    posts = post.get_post_by_id(id)
    if not posts:
        return jsonify({'status': 'error', 'message': 'Post not found'}), 404
    return jsonify({'status': 'success', 'data': posts}), 200

@post_bp.route('/posts/favorite', methods=['GET'])
def get_favorite_posts(id):

    return jsonify({'status': 'success', 'data': ''}), 200

@post_bp.route('/posts/<int:post_id>/favorite', methods=['POST'])
def add_post_as_favorite(post_id):
    request_data = request.get_json()
    user_id = request_data.get('user_id', 1)
    post = Post()
    result = post.add_post_as_favorite(post_id, user_id)
    if not result:
        return jsonify({'status': 'error', 'message': 'Post not found'}), 404
    return jsonify({'status': 'success', 'message': 'Post added as favorite'}), 200

