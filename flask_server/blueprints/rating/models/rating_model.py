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

    # kan niet alleen post maar ook comment een rating geven
    def rate(self, user_id, target_id, rating, target):
        if target == "post":
            query = "SELECT * FROM ratings WHERE user_id = ? AND post_id = ? AND rating != ?"
        elif target == "comment":
            query = "SELECT * FROM ratings WHERE user_id = ? AND comment_id = ? AND rating != ?"
        else:
            query = None

        if query:
            self.cursor.execute(query, (user_id, target_id, rating))
            result = self.cursor.fetchone()

            if result:
                print('update')
            else:
                result = self.create_rating(user_id, target_id, rating, target)
                print('created ', result)
                return result
        return None

    def create_rating(self, user_id, target_id, rating, target):
        print(user_id, target_id, rating, target)
        if target == "post":
            query = 'INSERT INTO ratings (user_id,post_id, rating) VALUES (?,?, ?)'
        elif target == "comment":
            query = 'INSERT INTO ratings (user_id, comment_id, rating) VALUES (?,?,?)'
        else:
            query = None

        result = self.cursor.execute(query, (user_id, target_id, rating))

        if result:
            return result
        return None