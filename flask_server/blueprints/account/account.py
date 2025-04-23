from flask import Blueprint, request, jsonify
from flask_jwt_extended import *
from blueprints.account.models.account_model import Account
import bcrypt

account_bp = Blueprint('account', __name__)

@account_bp.route('/api/login', methods=['POST'])
def login_api():
    data = request.json
    login_email = data.get('email')
    login_password = data.get('password')

    if not login_email or not login_password:
        return jsonify({"message": "Email en wachtwoord zijn vereist"}), 400

    account_model = Account()
    user = account_model.get_user_by_email(login_email)

    if not user:
        return jsonify({"message": "Gebruiker niet gevonden"}), 404

    if bcrypt.checkpw(login_password.encode('utf-8'), user['hashed_password']):
        access_token = create_access_token(
            identity=login_email,
            additional_claims={
                "user_id": user["id"]
            }
        )
        
        return jsonify({"access_token": access_token}), 200

    return jsonify({"message": "Foutieve login!"}), 401