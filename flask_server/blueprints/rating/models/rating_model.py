import sqlite3, os
from blueprints.post.models.post_model import Post

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

    #!!! target is hier post of comment, niet posts of comments !!!
    def get_user_ratings(self,user_id,target,target_ids):
        print(target_ids, 'target')
        if target_ids:
            params =()
            query = f'SELECT post_id, rating FROM ratings WHERE user_id={user_id} AND userRated = True '
            total_params = ','.join(['?'] * len(target_ids))
            query += f"OR {target}_id IN ({total_params}) "
            params += tuple(target_ids)
        else:
            return False
        if query:
            self.cursor.execute(query, params,)
            result = self.cursor.fetchall()
            if result:
                result_dicts = [dict(row) for row in result]
                return result_dicts
            else:
                return False

    # kan niet alleen post maar ook comment een rating geven
    def rate(self, user_id, target_id, rating, target,user_rated):
        # checkt of de comment/post bestaat
        query = f'SELECT * FROM {target} WHERE id = ?'
        target_exists = self.cursor.execute(query, (target_id,))
        if target_exists.fetchone() is None:
            return None

        # haalt op basis id van post of comment de rating op
        if target == "posts":
            query = "SELECT rating FROM ratings WHERE user_id = ? AND post_id = ?"
        elif target == "comments":
            query = "SELECT rating FROM ratings WHERE user_id = ? AND comment_id = ?"
            print('query a target check, ', query, (user_id, target_id))

        if query:
            self.cursor.execute(query, (user_id, target_id))
            result = self.cursor.fetchone()

            # checkt of de rating bestaat en of de rating value niet gelijk zijn
            if result and result['rating'] and result['rating'] != rating and user_rated:
                result = self.update_rating(user_id, target_id, rating, target)
                return result

            # checkt of de rating niet bestaat
            elif (not result or not result['rating']) and not user_rated:
                result = self.create_rating(user_id, target_id, rating, target)
                return result
            else:
                return False

        return None

    def create_rating(self, user_id, target_id, rating, target):
        post = Post()

        if target == "posts":
            query = 'INSERT INTO ratings (user_id,post_id, rating, userRated) VALUES (?,?, ?, 1)'
            result = self.cursor.execute(query, (user_id, target_id, rating))
            self.con.commit()

            if result:
                result = post.calculate_post_rating(target_id, rating)
                if result:
                    return True
                return False
        # moet nog een comment model enzo aanmaken, maar dat is voor later
        # elif target == "comments":


    def update_rating(self, user_id, target_id, rating, target):
        post = Post()
        if target == "posts":
            query = 'UPDATE ratings SET user_id = ?, post_id = ?, rating = ? WHERE user_id = ? and post_id = ?'
            result = self.cursor.execute(query, (user_id, target_id, rating,user_id, target_id))
            self.con.commit()
            if result:
                result = post.calculate_post_rating(target_id, rating)
                if result:
                    return True
                return False

        # comment model aanmaken
        # elif target == "comments":
