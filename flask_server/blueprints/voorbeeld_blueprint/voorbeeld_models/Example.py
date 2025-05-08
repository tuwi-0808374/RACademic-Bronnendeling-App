# import Database
Database=''

class Example:
    def __init__(self):
        database = Database('./databases/database.db')
        self.cursor, self.con = database.connect_db()

    def get_example(self, email):
        # moet een query komen te staan die met de db connect result = self.cursor.execute("SELECT * FROM admins WHERE email = ?",(email,)).fetchone()

        result = 'voorbeeld'
        if result:
            return {
                "id": result[0],
                "email": result[1],
                "hashed_password": result[2],
                "display_name": result[3],
                "role": "admin"
            }
        return None