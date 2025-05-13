from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import *
from blueprints.account.models.account_model import Account
import bcrypt
from flask_cors import cross_origin
import base64, os
from flask import send_from_directory


account_bp = Blueprint('account', __name__)

@account_bp.route('/api/login', methods=['POST'])
@cross_origin()
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
@cross_origin()
def get_profile_by_id(user_id):
    account_model = Account() 
    user = account_model.get_user_by_id(user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'Gebruiker niet gevonden'}), 404
    
    if user.get('profile_image'):
        user['profile_image_url'] = f"http://127.0.0.1:5000/uploads/{user['profile_image']}"

    return jsonify({'status': 'success', 'data': user}), 200


@account_bp.route('/update_profile/<int:user_id>', methods=['PATCH'])
@jwt_required()
@cross_origin()
def update_profile(user_id):
    account_model = Account()
    data = request.get_json()
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    username = data.get('username')
    
    profile_image = data.get('profile_image')
    image_filename = None
    
    if profile_image and isinstance(profile_image, str) and profile_image.startswith('data:image'):
        image_filename = account_model.save_base64_image(profile_image)
        if not image_filename:
            return jsonify({'status': 'error', 'message': 'Fout bij opslaan profielfoto'}), 400
    
    success = account_model.update_profile(
        user_id=user_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        username=username,
        profile_image=image_filename
    )
    if success:
        return jsonify({'status': 'success', 'message': 'Profiel succesvol bijgewerkt'}), 200
    else:
        return jsonify({'status': 'error', 'message': f'Bijwerken mislukt: {success}'}), 500


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