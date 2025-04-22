import sqlite3, os
from flask_server.blueprints.post.models.post_model import Post

class Rating:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db')
        self.cursor, self.con = self.connect_db()

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con

    # kan niet alleen post maar ook comment een rating geven
    def rate(self, user_id, target_id, rating, target):
        if target == "post":
            query = "SELECT rating FROM ratings WHERE user_id = ? AND post_id = ?"

        elif target == "comment":
            query = "SELECT rating FROM ratings WHERE user_id = ? AND comment_id = ?"
        else:
            query = None

        if query:
            self.cursor.execute(query, (user_id, target_id))
            result = self.cursor.fetchone()
            if result and result['rating'] != rating:
                result = self.update_rating(user_id, target_id, rating, target)
                print('updated ', result)
                return result
            elif not result and result['rating'] != rating:
                result = self.create_rating(user_id, target_id, rating, target)
                print('created ', result)
                return result
            else:
                return None
        return None

    def create_rating(self, user_id, target_id, rating, target):
        print('create',user_id, target_id, rating, target)
        post = Post()
        if target == "post":
            query = 'INSERT INTO ratings (user_id,post_id, rating, userRated) VALUES (?,?, ?, 1)'
            result = self.cursor.execute(query, (user_id, target_id, rating))
            self.con.commit()
            if result:
                result = post.calculate_post_rating(target_id, rating)
                if result:
                    return True
                return False
        # moet nog een comment model enzo aanmaken, maar dat is voor later
        # elif target == "comment":


    def update_rating(self, user_id, target_id, rating, target):
        print('update',user_id, target_id, rating, target)
        post = Post()
        if target == "post":
            query = 'UPDATE ratings SET user_id = ?, post_id = ?, rating = ? WHERE user_id = ? and post_id = ?'
            result = self.cursor.execute(query, (user_id, target_id, rating,user_id, target_id))
            self.con.commit()
            if result:
                result = post.calculate_post_rating(target_id, rating)
                if result:
                    return True
                return False

        # comment model aanmaken
        # elif target == "comment":
