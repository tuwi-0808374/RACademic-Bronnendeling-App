import sqlite3, os

class Badge:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db') 
        self.cursor, self.con = self.connect_db()
        
    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con
    
    def get_bages_of_user(self, user_id):
        self.cursor.execute('''
            SELECT badges.*, user_badges.user_id
            FROM badges 
            JOIN user_badges ON badges.id = user_badges.badge_id 
            WHERE user_badges.user_id = ?''', (user_id,))
        badges = self.cursor.fetchall()
        result_dicts = [dict(row) for row in badges]
        return result_dicts