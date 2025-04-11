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
    return jsonify({'status': 'success', 'data': posts})

