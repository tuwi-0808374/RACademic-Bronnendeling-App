import sqlite3
import os


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
