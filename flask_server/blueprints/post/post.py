from flask import *
from flask_cors import CORS
from blueprints.post.models.post_model import Post
from blueprints.rating.models.rating_model import Rating
from blueprints.tag.models.tag_model import Tag
from flask_jwt_extended import *
post_bp = Blueprint('post', __name__)
base = Blueprint('base', __name__)
CORS(post_bp)
CORS(base)


@post_bp.route('/posts/<int:user_id>', methods=['GET'])
def get_posts_with_user(user_id):
    post = Post()
    tag = Tag()

    search_query = request.args.get('search_query', None)
    tag_ids = []
    if not search_query or search_query == 'undefined':
        search_query = None
    if request.args.get('tag_ids'):
        tag_ids = request.args.get('tag_ids', None).split(',')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID not found'}), 404

    if search_query or tag_ids:
        result = post.search_posts(user_id, search_query, tag_ids)
    else:
        result = post.get_posts(user_id)

    if not result:
        return jsonify({'status': 'error', 'message': 'No posts found'}), 404

    tags = tag.get_tags()
    if not tags:
        return jsonify({'status': 'error', 'message': 'No tags found'}), 404
    posts = []
    for post in result:
        tag_id_list = post['tag_ids'].split(',') if post['tag_ids'] else []
        matched_tags = []
        for tag_id in tag_id_list:
            for tag in tags:
                if str(tag['id']) == tag_id:
                    matched_tags.append(tag)
        post['tag_objects'] = matched_tags
        posts.append(post)
    return jsonify({'status': 'success', 'data': posts}), 200




@post_bp.route('/post_by_post_id/<int:id>', methods=['GET'])
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
    if request.method == "POST":
        data = request.get_json()
        created_posts = post.post_create_post(data)
        if not created_posts:
            return jsonify({'status': 'error', 'message': 'Post not found'}), 404

        post_id = post.get_latest_posts_id()
        recent_post_id = post_id['id']
        tag_ids = data['tag_ids']
        if not recent_post_id or not tag_ids:
            return jsonify({'status': 'error', 'message': 'No post_id or tag_ids found'}), 404

        created_post_tags = post.post_assign_post_tags(tag_ids, recent_post_id)
        if not created_post_tags:
            return jsonify({'status': 'error', 'message': 'Post_tags not found'}), 404

        return jsonify({'status': 'success', 'data': created_posts}), 200


@post_bp.route('/edit_post/<int:id>', methods=['PATCH'])
def edit_posts(id):
    post = Post()
    data = request.get_json()
    edit_post = post.patch_edit_post(id, data)
    if not edit_post:
        return jsonify({'status': 'error', 'message': 'Post not Edited'}), 404

    post_id = id
    tag_ids = data['tag_ids']
    if not post_id or not tag_ids:
        return jsonify({'status': 'error', 'message': 'No post_id or tag_ids found'}), 404

    delete_post_tags = post.delete_assigned_post_tags(post_id)
    if not delete_post_tags:
        return jsonify({'status': 'error', 'message': 'failed to delete post_tags'}), 404

    created_post_tags = post.post_assign_post_tags(tag_ids, post_id)
    if not created_post_tags:
        return jsonify({'status': 'error', 'message': 'Post_tags not found'}), 404

    return jsonify({'status': 'success', 'data': edit_post}), 200


@post_bp.route('/delete_post/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = Post()
    delete_post = post.delete_post(id)
    if not delete_post:
        return jsonify({'status': 'error', 'message': 'Post not found'}), 404
    return jsonify({'status': 'success', 'data': delete_post}), 200


@post_bp.route('/posts_by_user_id/<int:user_id>', methods=['GET'])
def get_posts_by_user_id(user_id):
    print(user_id)
    post = Post()
    posts = post.get_posts_by_user_id(user_id)
    if not posts:
        return jsonify({'status': 'error', 'message': 'Post not found'}), 404
    return jsonify({'status': 'success', 'data': posts}), 200


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


@post_bp.route('/posts/<int:post_id>/favorite/<int:user_id>', methods=['GET'])
def is_post_favorite(post_id, user_id):
    post = Post()
    result = post.is_post_favorite(post_id, user_id)
    if not result:
        return jsonify({'status': 'error', 'message': 'Post not found'}), 404
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