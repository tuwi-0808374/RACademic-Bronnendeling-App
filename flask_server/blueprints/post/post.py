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
    # For testing default to 1
    # Will be replaced with user_id from token or session
    user_id = request.args.get('user_id', default=1, type=int)
    posts = post.get_posts(user_id)
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

@post_bp.route('/posts/favorite', methods=['GET'])
def get_favorite_posts():
    print(request.args)
    # For testing default to 1
    # Will be replaced with user_id from token or session
    user_id = request.args.get('user_id', default=1, type=int)
    post = Post()
    print(user_id)
    favorite_posts = post.get_favorite_posts(user_id)
    if not favorite_posts:
        return jsonify({'status': 'error', 'message': 'No favorite posts found'}), 404
    return jsonify({'status': 'success', 'data': favorite_posts}), 200

@post_bp.route('/posts/<int:post_id>/favorite', methods=['POST'])
def add_post_as_favorite(post_id):
    print(request.args)
    # For testing default to 1
    # Will be replaced with user_id from token or session
    user_id = request.args.get('user_id', default=1, type=int)
    post = Post()
    result = post.add_post_as_favorite(post_id, user_id)
    if not result:
        return jsonify({'status': 'error', 'post': 'Post not found'}), 404
    return jsonify({'status': 'success', 'post': result}), 200


