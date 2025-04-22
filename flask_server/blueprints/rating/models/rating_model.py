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
    def rate(self, user_id, target_id, rating, target, task):
        if target == "post":
            query = "SELECT rating FROM ratings WHERE user_id = ? AND post_id = ?"

        elif target == "comment":
            query = "SELECT * FROM ratings WHERE user_id = ? AND comment_id = ?"
        else:
            query = None

        if query:
            self.cursor.execute(query, (user_id, target_id))
            result = self.cursor.fetchone()
            print('result, ',result)
            print('result rating', result['rating'])

            if result or result != rating:
                result = self.update_rating(user_id, target_id, rating, target)
                print('updated ', result)
                return result
            else:
                result = self.create_rating(user_id, target_id, rating, target)
                print('created ', result)
                return result
        return None

    def create_rating(self, user_id, target_id, rating, target):
        print('create',user_id, target_id, rating, target)
        if target == "post":
            query = 'INSERT INTO ratings (user_id,post_id, rating) VALUES (?,?, ?)'
        elif target == "comment":
            query = 'INSERT INTO ratings (user_id, comment_id, rating) VALUES (?,?,?)'
        else:
            query = None

        result = self.cursor.execute(query, (user_id, target_id, rating))
        self.con.commit()

        if result:
            return True
        return False

    def update_rating(self, user_id, target_id, rating, target):
        print('update',user_id, target_id, rating, target)
        if target == "post":
            query = 'UPDATE ratings SET user_id = ?, post_id = ?, rating = ? WHERE user_id = ? and post_id = ?'
        elif target == "comment":
            query = 'UPDATE ratings SET user_id = ?, comment_id = ?, rating = ? WHERE user_id = ? and comment_id = ?'
        else:
            query = None
        print(query)
        result = self.cursor.execute(query, (user_id, target_id, rating,user_id, target_id))
        self.con.commit()

        if result:
            return True
        return False