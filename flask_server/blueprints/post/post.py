from flask import *

from blueprints.post.models.post_model import Post
from blueprints.rating.models.rating_model import Rating
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
    search_query = request.args.get('search_query', default=None)
    tag_ids = request.args.getlist('tag_id')
    
    if search_query or tag_ids:
        posts = post.search_posts(search_query, tag_ids)

    else:
        posts = post.get_posts()
    if not posts:
        return jsonify({'status': 'error', 'message': 'No posts found'}), 404
    return jsonify({'status': 'success', 'data': posts}), 200

@post_bp.route('/posts/<int:user_id>', methods=['GET'])
def get_posts_by_user(user_id):
    post = Post()
    rating = Rating()
    data = request.get_json(silent=True) or {}

    search_query = data.get('search_query', None)
    tag_ids = data.get('tags', None)
    user_rating = None
    if search_query or tag_ids:
        posts = post.search_posts(search_query, tag_ids)

    else:
        posts = post.get_posts(user_id)

    if posts:
        post_ids = [post['id'] for post in posts]
        user_rating = rating.get_user_ratings(user_id, "post",post_ids)

    elif not posts:
        return jsonify({'status': 'error', 'message': 'No posts found'}), 404

    data = {
        "posts": posts,
        "user_rating": user_rating
    }
    print(data)
    return jsonify({'status': 'success', 'data': data}), 200



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
        created_posts = post.post_create_post(user_id, data)
        if not created_posts:
            return jsonify({'status': 'error', 'message': 'Post not found'}), 404

        post_id = post.get_latest_posts_id()
        recent_post_id = post_id['id']
        tag_ids = data['tag_ids']
        if not recent_post_id or not tag_ids:
            return jsonify({'status': 'error', 'message': 'No post_id or tag_ids found'}), 404

        created_post_tags = post.assign_post_tags(tag_ids, recent_post_id)
        if not created_post_tags:
            return jsonify({'status': 'error', 'message': 'Post_tags not found'}), 404

        return jsonify({'status': 'success', 'data': created_posts}), 200

@post_bp.route('/posts/favorite/<int:user_id>', methods=['GET'])
def get_favorite_posts(user_id):
    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID not found'}), 404
    
    post = Post()
    favorite_posts = post.get_favorite_posts(user_id)
    if not favorite_posts:
        return jsonify({'status': 'error', 'message': 'No favorite posts found'}), 404
    return jsonify({'status': 'success', 'data': favorite_posts}), 200


@post_bp.route('/posts/<int:post_id>/favorite/<int:user_id>', methods=['POST'])
def add_post_as_favorite(post_id, user_id):    
    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID not found'}), 404
    
    post = Post()
    result = post.add_post_as_favorite(post_id, user_id)
    if not result:
        return jsonify({'status': 'error', 'post': 'Post not found'}), 404
    return jsonify({'status': 'success', 'post': result}), 200

@post_bp.route('/posts/multiple_favorites/<int:user_id>', methods=['POST'])
def add_multiple_posts_as_favorite(user_id):
    data = request.get_json()
    
    if not data or 'post_ids' not in data:
        return jsonify({'status': 'error', 'message': 'No post_ids provided'}), 400
    
    if data['post_ids'] == []:
        return jsonify({'status': 'error', 'message': 'Empty post_ids list'}), 400
    
    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID not found'}), 404

    post = Post()
    result = post.add_multiple_posts_as_favorite(data['post_ids'], user_id)    
    
    if not result:
        return jsonify({'status': 'error', 'posts': 'Post not found'}), 404
    return jsonify({'status': 'success', 'posts': result}), 200

@post_bp.route('/posts/most_upvoted', methods=['GET'])
def get_most_upvoted_posts(user_id = None):  
    limit = request.args.get('limit', default=10, type=int)   
    post = Post()
    posts = post.get_most_upvoted_posts(user_id, limit=limit)
    return jsonify({'status': 'success', 'posts': posts}), 200

@post_bp.route('/posts/most_upvoted/<int:user_id>', methods=['GET'])
def get_most_upvoted_posts_of_user(user_id):
    limit = request.args.get('limit', default=10, type=int)
    post = Post()
    posts = post.get_most_upvoted_posts(user_id, limit=limit)
    return jsonify({'status': 'success', 'posts': posts}), 200