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

    def get_post_by_tags(self, tag_ids):
        result = []
        for tag_id in tag_ids:
            query = "SELECT post_id FROM post_tags WHERE tag_id = ?"
            self.cursor.execute(query, (tag_id,))
        results = self.cursor.fetchall()
        dict_result = [dict(row) for row in results]
        if dict_result:
            return dict_result
        return False