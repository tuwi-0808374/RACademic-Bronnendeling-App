import sqlite3, os


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
                SELECT {target}_id, rating, is_favorite
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

            return None

        # haalt op basis id van post of comment de rating op
        if target == "posts":
            query = "SELECT post_id, rating, userRated FROM ratings WHERE user_id = ? AND post_id = ?"
        elif target == "comments":
            query = "SELECT rating , userRated FROM ratings WHERE user_id = ? AND comment_id = ?"

        if query:
            self.cursor.execute(query, (user_id, target_id))
            result = self.cursor.fetchone()

            # checkt of de rating bestaat en of de rating value niet gelijk zijn
            if result:
                result = self.update_rating(user_id, target_id, rating, target, result['rating'])
                self.con.commit()
                return result

            # checkt of de rating niet bestaat
            elif not result:
                result = self.create_rating(user_id, target_id, rating, target)
                self.con.commit()
                return result
            else:
                return False

        return None

    def create_rating(self, user_id, target_id, rating, target):

        if target == "posts":
            query = 'INSERT INTO ratings (user_id,post_id, rating, userRated) VALUES (?,?, ?, 1)'
            result = self.cursor.execute(query, (user_id, target_id, rating))

            if result:
                result = self.calculate_post_rating(target_id, rating, None)
                self.con.commit()
                if result:
                    return True
                return False
        # moet nog een comment model enzo aanmaken, maar dat is voor later
        # elif target == "comments":

    def update_rating(self, user_id, target_id, rating, target, old_rating):
        if target == "posts":
            query = 'UPDATE ratings SET rating = ? WHERE user_id = ? and post_id = ?'
            if old_rating != rating:
                updated_rating = self.cursor.execute(query, (rating, user_id, target_id))
                if updated_rating:
                    result = self.calculate_post_rating(target_id, rating, old_rating)
                    self.con.commit()
                    if result:
                        return True
                    return False

            else:
                updated_rating = self.cursor.execute(query, (None, user_id, target_id))
                select_updated_rating = self.cursor.execute("SELECT is_favorite, is_reported, userRated FROM ratings WHERE user_id = ? AND post_id = ?", (user_id, target_id))
                if updated_rating:
                    changed_total = self.calculate_post_rating(target_id, rating, old_rating)

                    self.con.commit()
                    if changed_total:
                        return True
                    return False

    def calculate_post_rating(self, post_id, new_rating, old_rating):

        self.cursor.execute('SELECT total_rating FROM posts WHERE id = ?', (post_id,))
        calculated_rating = None
        total_rating = self.cursor.fetchone()

        # create
        if not old_rating:
            calculated_rating = total_rating['total_rating'] + new_rating

        # update remove rating
        elif not new_rating:
            calculated_rating = total_rating['total_rating'] - old_rating

        # update switch rating
        elif old_rating != new_rating:
            calculated_rating = total_rating['total_rating'] + (new_rating * 2)

        elif old_rating == new_rating:
            calculated_rating = total_rating['total_rating'] - old_rating

        query = 'UPDATE posts SET total_rating = ? WHERE id = ?'

        result = self.cursor.execute(query, (calculated_rating, post_id))

        if result:
            return True
        return False

                    # else:
                    #     self.delete_user_rating(user_id, target_id)
        # comment model aanmaken
        # elif target == "comments":
    # def delete_user_rating(self,user_id, target_id):
    #     # query = "SELECT is_favorite, is_reported, userRated FROM ratings WHERE user_id = ? AND post_id = ?"
    #     query = 'DELETE FROM ratings WHERE user_id = ? AND post_id = ?'
    #     print(query)