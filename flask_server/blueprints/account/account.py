from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import *
from blueprints.account.models.account_model import Account
import bcrypt
from flask_cors import CORS
from flask_cors import cross_origin
import base64, os
from flask import send_from_directory
import re

account_bp = Blueprint('account', __name__)
CORS(account_bp)

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

@account_bp.route('/profile/<int:user_id>', methods=['GET'])
@jwt_required()
def get_profile_by_id(user_id):
    account_model = Account() 
    user = account_model.get_user_by_id(user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'Gebruiker niet gevonden'}), 404
    
    if user.get('profile_image'):
        user['profile_image_url'] = f"http://127.0.0.1:5000/uploads/{user['profile_image']}"

    return jsonify({'status': 'success', 'data': user}), 200

@account_bp.route('/change_password/<int:user_id>', methods=['PATCH'])
@jwt_required()
def change_password_route(user_id):
    jwt_payload = get_jwt()
    token_user_id = jwt_payload.get('user_id')

    if token_user_id != user_id:
        return jsonify({"message": "Je kunt alleen eigen wachtwoord wijzigen."}), 403

    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"message": "Huidig wachtwoord en nieuw wachtwoord zijn vereist"}), 400

    account_model = Account()
    success, message = account_model.change_password(user_id, old_password, new_password)

    if success:
        return jsonify({'status': 'success', 'message': message}), 200
    else:
        status_code = 400 
        if "Serverfout" in message:
            status_code = 500
        elif "Gebruiker niet gevonden" in message: 
            status_code = 404
        return jsonify({'status': 'error', 'message': message}), status_code


@account_bp.route('/update_profile/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_profile(user_id):
    account_model = Account()
    data = request.get_json()
    
    profile_image = data.get('profile_image')
    
    if profile_image == "remove":
        pass  
    elif profile_image is None or profile_image.lower() == "null":
        profile_image = None
    elif isinstance(profile_image, str) and profile_image.startswith('data:image'):
        profile_image = profile_image  
    else:
        profile_image = None  

    success = account_model.update_profile(
        user_id=user_id,
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        username=data.get('username'),
        profile_image=profile_image  
    )
    
    if success:
        return jsonify({'status': 'success', 'message': 'Profiel succesvol bijgewerkt'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Bijwerken mislukt'}), 500

@account_bp.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@account_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return jsonify({"error": "Email and password are required"}), 400

            user_data = {
                "email": email,
                "display_name": data.get("display_name", ""),
                "first_name": data.get("first_name", ""),
                "username": data.get("username", ""),
                "last_name": data.get("last_name", ""),
                "password": password,
                "is_public": data.get("is_public", False),
                "profile_image": data.get("profile_image", None)  
            }

            account_model = Account()
            account_id = account_model.register_user(user_data)

            if not account_id:
                return jsonify({"error": "Failed to add user"}), 500
            
            return jsonify({"message": "User successfully added", "id": account_id}), 201

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return jsonify({"error": "Registration failed", "details": str(e)}), 500
        
    
@account_bp.route('/check_username', methods=['POST'])
def check_username():
    data = request.json
    username = data.get('username')
    current_user_id = data.get('current_user_id')
    
    if not username:
        return jsonify({"available": False, "message": "Gebruikersnaam is verplicht"}), 400
    
    account_model = Account()
    existing_user = account_model.get_user_by_username(username, current_user_id)
    
    if existing_user:
        return jsonify({"available": False, "message": "Gebruikersnaam al in gebruik"}), 200
    else:
        return jsonify({"available": True, "message": "Gebruikersnaam is beschikbaar"}), 200

@account_bp.route('/check_email', methods=['POST'])
def check_email():
    data = request.json
    email = data.get('email')
    current_user_id = data.get('current_user_id')
    
    if not email:
        return jsonify({"available": False, "message": "Emailadres is verplicht"}), 400
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"available": False, "message": "Ongeldig email formaat"}), 400
    
    account_model = Account()
    existing = account_model.get_user_by_email(email)
    existing_email = account_model.get_user_by_email(email)
    
    if existing and (not current_user_id or existing['id'] != current_user_id):
        return jsonify({"available": False, "message": "Email al in gebruik"}), 200
    else:
        return jsonify({"available": True, "message": "Email is beschikbaar"}), 200