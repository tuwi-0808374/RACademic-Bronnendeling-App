import sqlite3
import os
from flask_jwt_extended import *
import bcrypt
import base64


class Account:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db')
        self.cursor, self.con = self.connect_db()

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con

    def get_user_by_email(self, email):
        
        result = self.cursor.execute(
            """
            SELECT email, 
            first_name,
            id,
            password,
            last_name,
            first_name || ' ' || last_name AS full_name
        
            FROM users
            WHERE email = ?
            """,
            (email,)
        ).fetchone()

        if result:
            return {
                "email": result[0],
                "first_name": result[1],
                "id": result[2],
                "hashed_password": result[3],
                "full_name": result[5],
                
            }
        return None
    
    def get_user_id_from_token(self, token):
        decoded = decode_token(token)
        user_id = decoded['user_id']
        return user_id
    
    def get_user_by_id(self, user_id):
        cursor, con = self.connect_db()
        try:
            result = cursor.execute(
                """
                SELECT email,
                first_name,
                id,
                last_name,
                first_name 
                FROM users
                WHERE id = ?
                """,
                (user_id,)
            ).fetchone()

            if result:
                return dict(result) 
            return None
        finally:
            if con:
                con.close() 
                
    def update_profile(self, user_id, first_name=None, last_name=None, email=None):
        cursor, con = self.connect_db()  
        try:
            cursor.execute(  
                "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
                (first_name, last_name, email, user_id)
            )
            con.commit()
            return True
        except Exception as e:
            print(f"Error bij bijwerken van gebruiker {user_id}: {e}")
            return False   
        finally:
            if con:
                con.close()
                
    def register_user(self, user_data):
        try:
            hashed_password = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())

            image_base64 = user_data.get("profile_image")
            image_data = None
            
            if image_base64:
                if ',' in image_base64:
                    image_base64 = image_base64.split(',')[1]
                image_data = base64.b64decode(image_base64)

            self.cursor.execute(
                """
                INSERT INTO users (
                    email, 
                    display_name, 
                    first_name, 
                    username, 
                    last_name, 
                    password, 
                    is_public,  
                    profile_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_data["email"],
                    user_data["display_name"],
                    user_data["first_name"],
                    user_data["username"],
                    user_data["last_name"],
                    hashed_password,
                    user_data["is_public"],
                    image_data  
                )
            )
            self.con.commit()
            return self.cursor.lastrowid
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None

