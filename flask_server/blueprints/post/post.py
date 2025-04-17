from flask import *

from flask_server.blueprints.post.models.post_model import Post

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

# bron https://flask-restful.readthedocs.io/en/latest/quickstart.html#resourceful-routing
@post_bp.route('/posts', methods=['POST'])
def create_posts():
    post = Post()
    user_id = 1
    if request.method == "POST":
        data = request.get_json()
        posts = post.post_create_post(user_id, data)
        if not posts:
            return jsonify({'status': 'error', 'message': 'Post not found'}), 404
        return jsonify({'status': 'success', 'data': posts}), 200


@post_bp.route('/post_id', methods=['GET'])
def get_posts_id():
    post = Post()
    posts = post.get_posts_id()
    if not posts:
        return jsonify({'status': 'error', 'message': 'No posts found'}), 404
    return jsonify({'status': 'success', 'data': posts}), 200

