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
    
    def get_favorite_posts(self, user_id):
        query = """
                SELECT posts.* FROM posts
                JOIN ratings ON posts.id = ratings.post_id
                WHERE ratings.user_id = ? AND ratings.is_favorite = 1
                """
        self.cursor.execute(query, (user_id,))
        favorite_posts = self.cursor.fetchall()
        result_dicts = [dict(row) for row in favorite_posts]
        return result_dicts

    def add_post_as_favorite(self, post_id, user_id):
        # CREATE TABLE "ratings" (
        #     "user_id"	INTEGER NOT NULL,
        #     "post_id"	INTEGER,
        #     "comment_id"	INTEGER,
        #     "is_favorite"	BOOLEAN DEFAULT false,
        #     "is_reported"	BOOLEAN DEFAULT false,
        #     "report_reason"	TEXT,
        #     FOREIGN KEY("comment_id") REFERENCES "comments"("id"),
        #     FOREIGN KEY("post_id") REFERENCES "posts"("id"),
        #     FOREIGN KEY("user_id") REFERENCES "users"("id")
        # );
        
        query = """
                SELECT * FROM ratings
                WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
                """  
        self.cursor.execute(query, (user_id, post_id))
        already_has_a_rating = self.cursor.fetchone()

        if already_has_a_rating:
            query = """
                    UPDATE ratings
                    SET is_favorite = ?
                    WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
                    """
            self.cursor.execute(query, (True, user_id, post_id))
            self.con.commit()
            return True
        else:
            query = """INSERT INTO ratings (user_id, post_id, is_favorite) VALUES (?, ?, ?)"""
            self.cursor.execute(query, (user_id, post_id, True))
            self.con.commit()
            return True
        return False
        
