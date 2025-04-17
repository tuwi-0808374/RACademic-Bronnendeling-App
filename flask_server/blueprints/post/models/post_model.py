import sqlite3, os
from datetime import datetime

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
    
    def get_post_by_id(self, post_id):
        query = "SELECT * FROM posts WHERE id = ?"
        self.cursor.execute(query, (post_id,))
        post = self.cursor.fetchone()

        dict_post = dict(post) if post else None

        comments = self.get_comments_by_post_id(post_id)
        dict_post['comments'] = comments if comments else []

        if dict_post:
            return dict_post
        return None
    
    def get_comments_by_post_id(self, post_id):
        query = "SELECT * FROM comments WHERE post_id = ?"
        self.cursor.execute(query, (post_id,))
        comments = self.cursor.fetchall()

        if comments:
            result_dicts = [dict(row) for row in comments]
            return result_dicts
        return None

    #bron https://docs.python.org/3/library/datetime.html
    def post_create_post(self, user_id, data):
        posted_date = datetime.now().strftime("%Y-%m-%d %H:%M")
        query = "INSERT INTO posts (title, content, user_id, posted_date) VALUES (?,?,?,?);"
        result = self.cursor.execute(query, (data["title"], data["content"], user_id, posted_date))
        self.con.commit()
        print(id)
        if result:
            return True
        return False


    def get_posts_id(self):
        query = "SELECT id FROM posts ORDER BY id DESC LIMIT 1"
        self.cursor.execute(query)
        posts = self.cursor.fetchall()
        result_dicts = [dict(row) for row in posts]
        return result_dicts



