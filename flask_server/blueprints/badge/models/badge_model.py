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
    
    def has_user_badge(self, user_id, badge_id):
        self.cursor.execute('''
            SELECT * FROM user_badges 
            WHERE user_id = ? AND badge_id = ?''', (user_id, badge_id))
        result = self.cursor.fetchone()
        if result:
            return True
        return False

    
    def give_badge_to_user(self, user_id, badge_id):
        message = "Badge already given to user"
        if self.has_user_badge(user_id, badge_id):
            return False, message
        
        self.cursor.execute('''
            INSERT INTO user_badges (user_id, badge_id) 
            VALUES (?, ?)''', (user_id, badge_id))
        self.con.commit()
        
        message = "Badge given to user"
        return True, message