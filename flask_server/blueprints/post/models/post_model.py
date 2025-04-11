import sqlite3, os

class Post:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db') 
        self.cursor, self.con = self.connect_db()

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con
    
    def get_posts(self):
        query = "SELECT * FROM posts"
        self.cursor.execute(query)
        posts = self.cursor.fetchall()
        result_dicts = [dict(row) for row in posts]
        return result_dicts