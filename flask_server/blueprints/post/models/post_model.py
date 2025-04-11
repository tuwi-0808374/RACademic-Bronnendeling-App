import sqlite3

class Post:
    def __init__(self):
        self.cursor, self.con = ('./databases/database.db').connect_db()

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con
    
    def get_posts(self):
        query = "SELECT * FROM posts"
        self.cursor.execute(query)
        posts = self.cursor.fetchall()
        return posts