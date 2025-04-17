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