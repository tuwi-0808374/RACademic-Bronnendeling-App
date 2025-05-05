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
        if target_ids:

            params = (user_id,) + tuple(target_ids)
            total_params = ','.join(['?'] * len(target_ids))
            query = f'''
                SELECT {target}_id, rating
                FROM ratings
                WHERE user_id = ? AND {target}_id IN ({total_params})
            '''
        else:
            return False
        if query:
            self.cursor.execute(query,params,)
            result = self.cursor.fetchall()
            if result:
                result_dicts = [dict(row) for row in result]
                return result_dicts
            else:
                return False

    # kan niet alleen post maar ook comment een rating geven
    def rate(self, user_id, target_id, rating, target):
        # checkt of de comment/post bestaat
        query = f'SELECT * FROM {target} WHERE id = ?'
        target_exists = self.cursor.execute(query, (target_id,))
        result = target_exists.fetchone()

        if result is None:
            print('target bestaat niet ', result)
            return None

        # haalt op basis id van post of comment de rating op
        if target == "posts":
            query = "SELECT post_id, rating, userRated FROM ratings WHERE user_id = ? AND post_id = ?"
        elif target == "comments":
            query = "SELECT rating , userRated FROM ratings WHERE user_id = ? AND comment_id = ?"
            print('query a target check, ', query, (user_id, target_id))

        if query:
            self.cursor.execute(query, (user_id, target_id))
            result = self.cursor.fetchone()

            # checkt of de rating bestaat en of de rating value niet gelijk zijn
            # print(result['post_id'])
            if result:
                result = self.update_rating(user_id, target_id, rating, target, result['rating'])
                return result

            # checkt of de rating niet bestaat
            elif not result:
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
                result = post.calculate_post_rating(target_id, rating, None)
                if result:
                    return True
                return False
        # moet nog een comment model enzo aanmaken, maar dat is voor later
        # elif target == "comments":


    def update_rating(self, user_id, target_id, rating, target, old_rating):
        post = Post()
        if target == "posts":
            query = 'UPDATE ratings SET rating = ? WHERE user_id = ? and post_id = ?'
            if old_rating != rating:
                result = self.cursor.execute(query, (rating, user_id, target_id))
                self.con.commit()
                if result:
                    result = post.calculate_post_rating(target_id, rating, old_rating)
                    if result:
                        return True
                    return False

            else:
                result = self.cursor.execute(query, (None, user_id, target_id))
                self.con.commit()
                if result:
                    result = post.calculate_post_rating(target_id, rating, old_rating)
                    if result:
                        return True
                    return False
        # comment model aanmaken
        # elif target == "comments":
