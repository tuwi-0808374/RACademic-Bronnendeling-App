from flask import request
from blueprints.account.models.account_model import Account

def get_user_id_from_request():
    token = request.headers.get('token', default=None)
    if not token:
        user_id = request.args.get('user_id', default=1, type=int)
        print("No token provided, using user_id from request args or defaulting to 1:", user_id)
    else:
        account = Account()
        user_id = account.get_user_id_from_token(token)
        print("User ID from token:", user_id)
    return user_id