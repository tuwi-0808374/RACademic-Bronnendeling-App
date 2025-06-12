import base64
import os
import sqlite3
import uuid

import bcrypt
from flask_jwt_extended import *


class Account:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, "../../../databases/database.db")
        self.upload_folder = os.path.join(base_dir, "../../../uploads")
        os.makedirs(self.upload_folder, exist_ok=True)

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con

    def get_user_by_email(self, email):
        cursor, con = self.connect_db()
        try:
            result = cursor.execute(
                """
                SELECT email, 
                first_name,
                id,
                password,
                last_name,
                first_name || ' ' || last_name AS full_name,
                username,
                is_admin,
                is_banned
            
                FROM users
                WHERE email = ?
                """,
                (email,),
            ).fetchone()

            if result:
                return {
                    "email": result[0],
                    "first_name": result[1],
                    "id": result[2],
                    "hashed_password": result[3],
                    "full_name": result[5],
                    "username": result[6],
                    "is_admin": result[7],
                    "is_banned": result[8],
                }
            return None
        finally:
            if con:
                con.close()

    def get_user_id_from_token(self, token):
        decoded = decode_token(token)
        user_id = decoded["user_id"]
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
                is_public,
                username,
                profile_image
                FROM users
                WHERE id = ?
                """,
                (user_id,),
            ).fetchone()

            if result:
                return dict(result)
            return None
        finally:
            if con:
                con.close()

    # Bron:
    #     ChatGPT,
    #     https://medium.com/@blturner3527/storing-images-in-your-database-with-base64-react-682f5f3921c2
    def save_base64_image(self, base64_str):
        if not base64_str:
            return None

        try:
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]

            image_data = base64.b64decode(base64_str)

            filename = f"{uuid.uuid4().hex}.jpg"
            filepath = os.path.join(self.upload_folder, filename)

            with open(filepath, "wb") as f:
                f.write(image_data)

            return filename

        except Exception as e:
            print(f"Fout bij opslaan afbeelding: {e}")
            return None

    def change_password(self, user_id, old_password, new_password):
        cursor, con = self.connect_db()
        try:
            user_query_result = cursor.execute(
                "SELECT password FROM users WHERE id = ?", (user_id,)
            ).fetchone()

            if not user_query_result:
                return False, "Gebruiker niet gevonden."

            stored_hashed_password = user_query_result["password"]

            if not bcrypt.checkpw(old_password.encode("utf-8"), stored_hashed_password):
                return False, "Huidige wachtwoord is incorrect."

            new_hashed_password = bcrypt.hashpw(
                new_password.encode("utf-8"), bcrypt.gensalt()
            )
            cursor.execute(
                "UPDATE users SET password = ? WHERE id = ?",
                (new_hashed_password, user_id),
            )
            con.commit()
            return True, "Wachtwoord succesvol gewijzigd."
        except Exception as e:
            print(f"Fout bij wijzigen wachtwoord {user_id}: {e}")
            return False
        finally:
            if con:
                con.close()

    def update_profile(
        self,
        user_id,
        first_name=None,
        last_name=None,
        email=None,
        username=None,
        is_public=None,
        profile_image=None,
    ):
        cursor, con = self.connect_db()
        try:
            current_user = cursor.execute(
                "SELECT profile_image FROM users WHERE id = ?", (user_id,)
            ).fetchone()
            current_image = current_user["profile_image"] if current_user else None

            new_image_filename = None

            if profile_image == "remove":
                if current_image:
                    if self.delete_old_image(current_image):
                        print("Bestand succesvol verwijderd")
                    else:
                        print("Kon bestand niet verwijderen")
                new_image_filename = None

            elif isinstance(profile_image, str) and profile_image.startswith("data:"):
                if current_image:
                    self.delete_old_image(current_image)
                new_image_filename = self.save_base64_image(profile_image)

            is_public = bool(is_public) if is_public is not None else False
            cursor.execute(
                "UPDATE users SET first_name=?, last_name=?, email=?, username=?, is_public=?, profile_image=? WHERE id=?",
                (
                    first_name,
                    last_name,
                    email,
                    username,
                    is_public,
                    new_image_filename,
                    user_id,
                ),
            )
            con.commit()

            return True

        except Exception as e:
            print(f"Error: {str(e)}")
            return False
        finally:
            if con:
                con.close()

    def delete_old_image(self, filename):
        if not filename:
            return False

        try:
            filepath = os.path.join(self.upload_folder, filename)

            if not os.path.exists(filepath):
                return False

            os.remove(filepath)
            return True

        except Exception as e:
            print(f"Error: {str(e)}")
            return False

    def register_user(self, user_data):
        cursor, con = self.connect_db()
        try:
            hashed_password = bcrypt.hashpw(
                user_data["password"].encode("utf-8"), bcrypt.gensalt()
            )

            image_filename = self.save_base64_image(user_data.get("profile_image"))

            cursor.execute(
                """
                INSERT INTO users (
                    email, 
                    display_name, 
                    first_name, 
                    username, 
                    last_name, 
                    password, 
                    is_public,  
                    profile_image,
                    is_admin
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_data["email"],
                    user_data["display_name"],
                    user_data["first_name"],
                    user_data["username"],
                    user_data["last_name"],
                    hashed_password,
                    user_data["is_public"],
                    image_filename,
                    user_data.get("is_admin", False),
                ),
            )
            con.commit()
            return cursor.lastrowid
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
        finally:
            if con:
                con.close()

    def get_user_by_username(self, username, exclude_user_id=None):
        cursor, con = self.connect_db()
        try:
            query = "SELECT id, username FROM users WHERE username = ?"
            params = [username]

            if exclude_user_id:
                query += " AND id != ?"
                params.append(exclude_user_id)

            result = cursor.execute(query, params).fetchone()
            return dict(result) if result else None
        finally:
            if con:
                con.close()

    def get_users_with_overall_rating(self, limit=5):
        # Geeft de top 5 gebruikers met de hoogste totale rating,
        # dit op basis van de som van hun ratings op hun posts.
        cursor, con = self.connect_db()
        try:
            result = cursor.execute(
                """
                    SELECT users.id, users.first_name, sum(posts.total_rating) as overall_rating, count(posts.total_rating) as total_ratings_received
                    FROM users
                    LEFT JOIN posts ON users.id = posts.user_id
                    GROUP BY users.id
                    ORDER BY overall_rating DESC
                    LIMIT ?           
                """,
                (limit,),
            ).fetchall()
            return [dict(row) for row in result]
        finally:
            if con:
                con.close()

    def get_users_with_most_badges(self, limit=5):
        # Geeft de top 5 gebruikers met de meeste badges.
        cursor, con = self.connect_db()
        try:
            result = cursor.execute(
                """
                    SELECT users.id, users.first_name, count(user_badges.badge_id) as total_badges
                    FROM users
                    LEFT JOIN user_badges ON users.id = user_badges.user_id
                    GROUP BY users.id
                    ORDER BY total_badges DESC
                    LIMIT ?           
                """,
                (limit,),
            ).fetchall()
            return [dict(row) for row in result]
        finally:
            if con:
                con.close()

    def get_users(self):
        # Geeft een lijst van gebruikers met een limiet en offset.
        cursor, con = self.connect_db()
        try:
            result = cursor.execute(
                """
                    SELECT id, first_name, last_name, display_name, username, email, is_public, profile_image, is_banned, is_admin
                    FROM users
                """,
                (),
            ).fetchall()
            return [dict(row) for row in result]
        finally:
            if con:
                con.close()

    def ban_user(self, user_id):
        cursor, con = self.connect_db()
        try:
            cursor.execute("UPDATE users SET is_banned = 1 WHERE id = ?", (user_id,))
            con.commit()
            return True, "User banned successfully"
        except Exception as e:
            return False, "Error banning user: " + str(e)
        finally:
            if con:
                con.close()

    def unban_user(self, user_id):
        cursor, con = self.connect_db()
        try:
            cursor.execute("UPDATE users SET is_banned = 0 WHERE id = ?", (user_id,))
            con.commit()
            return True, "User unbanned successfully"
        except Exception as e:
            return False, "Error unbanning user: " + str(e)
        finally:
            if con:
                con.close()

    def make_admin(self, user_id):
        cursor, con = self.connect_db()
        try:
            cursor.execute("UPDATE users SET is_admin = 1 WHERE id = ?", (user_id,))
            con.commit()
            return True, "User made admin successfully"
        except Exception as e:
            return False, "Error making user admin: " + str(e)
        finally:
            if con:
                con.close()

    def remove_admin(self, user_id):
        cursor, con = self.connect_db()
        try:
            cursor.execute("UPDATE users SET is_admin = 0 WHERE id = ?", (user_id,))
            con.commit()
            return True, "Admin removed successfully"
        except Exception as e:
            return False, "Error removing admin: " + str(e)
        finally:
            if con:
                con.close()
