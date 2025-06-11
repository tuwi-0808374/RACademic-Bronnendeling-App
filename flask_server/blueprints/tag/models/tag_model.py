import sqlite3, os

class Tag:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db')
        self.cursor, self.con = self.connect_db()

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con

    def get_tags(self):
        query = "SELECT * FROM tags"
        self.cursor.execute(query)
        tags = self.cursor.fetchall()
        result_dicts = [dict(row) for row in tags]
        return result_dicts

    def get_tags_by_post_id(self, post_id):
        query = "SELECT tag_id FROM post_tags WHERE post_id = ?"
        self.cursor.execute(query, (post_id,))
        tags = self.cursor.fetchall()
        result_dicts = [row[0] for row in tags]
        if result_dicts:
            return result_dicts
        return False

    def get_post_by_tags(self, tag_ids):
        query = "SELECT post_id FROM post_tags WHERE 1=1 "
        total_params = ','.join(['?'] * len(tag_ids))
        query += f"AND tag_id IN ({total_params}) "

        # checked of de post_id dezelfde aantal tags heeft of meer dan
        query += "GROUP BY post_id HAVING COUNT(DISTINCT tag_id) >= ?"

        # maak een tuple van tag ids en zet de tag ids om naar integers
        params = tuple(int(tag_id) for tag_id in tag_ids) + (len(tag_ids),)

        self.cursor.execute(query, params,)
        results = self.cursor.fetchall()
        dict_result = [dict(row) for row in results]

        # returns lijst met post ids
        post_ids = [row['post_id'] for row in dict_result]

        if post_ids:
            return post_ids
        return False

    def post_create_tag(self, data):
        query = "INSERT INTO tags (title, color) VALUES (?,?)"
        result = self.cursor.execute(query, (data["title"], data["color"]))
        self.con.commit()
        if result:
            return True
        return False