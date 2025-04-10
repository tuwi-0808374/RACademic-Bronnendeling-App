import sqlite3
from pathlib import Path
import bcrypt

class DatabaseGenerator:
    def __init__(self, database_file, overwrite=False, initial_data=False):
        self.database_file = Path(database_file)
        self.create_initial_data = initial_data
        self.database_overwrite = overwrite
        self.test_file_location()
        self.conn = sqlite3.connect(self.database_file)
        #dit zorgt ervoor dat FK's werkelijk echt zijn
        self.conn.execute("PRAGMA foreign_keys = ON")

    # Runs all db generation functions
    def generate_database(self):
        self.create_table_user()
        self.create_table_post()
        self.create_table_comments()
        self.create_table_ratings()
        self.create_table_tags()
        self.create_table_badges()
        if self.create_initial_data:
            self.insert_initial_users()

    # Create database table for users
    def create_table_user(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@hr.nl'),
            display_name TEXT NOT NULL,
            first_name TEXT NOT NULL,
            prefix TEXT,
            last_name TEXT NOT NULL,
            password TEXT NOT NULL,
            is_admin BOOLEAN NOT NULL default false,
            is_public BOOLEAN NOT NULL default false,
            is_banned BOOLEAN NOT NULL default false
        );
        """
        self.__execute_transaction_statement(create_statement)

    # Create database table for ratings
    def create_table_ratings(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS ratings (
            user_id INTEGER NOT NULL,
            post_id INTEGER,
            comment_id INTEGER,
            is_favorite BOOLEAN DEFAULT false,
            is_reported BOOLEAN DEFAULT false,
            report_reason TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (comment_id) REFERENCES comments(id)
        );
        """
        self.__execute_transaction_statement(create_statement)


    # Create database table for posts
    def create_table_post(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            total_rating INTEGER NOT NULL DEFAULT 0,
            posted_date INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """
        self.__execute_transaction_statement(create_statement)

    # Create database table for comments
    def create_table_comments(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            post_id INTEGER,
            total_rating INTEGER NOT NULL DEFAULT 0,
            posted_date INTEGER NOT NULL,
            reaction_on INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (reaction_on) REFERENCES comments(id)
        );
        """
        self.__execute_transaction_statement(create_statement)

    # Create database table for tags
    def create_table_tags(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        );
        """
        self.__execute_transaction_statement(create_statement)

    # Create database table for badges
    def create_table_badges(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            requirement TEXT NOT NULL
        );
        """
        self.__execute_transaction_statement(create_statement)

    # Create database join table for badges and users
    def create_table_user_badges(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS user_badges (
        user_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (badge_id) REFERENCES badges(id)
        )
        """
        self.__execute_transaction_statement(create_statement)

    # Create database join table for posts and tags
    def create_table_post_tags(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
        )
        """
        self.__execute_transaction_statement(create_statement)

    #data is gemaakt door chatgpt en de code was van wp3
    def insert_initial_users(self):
        users = [
            {"email": "student@hr.nl", "display_name": "User1", "first_name": "John", "prefix": "",
             "last_name": "Doe", "password": "1", "is_admin": False, "is_public": True, "is_banned": False},
            {"email": "1234567@hr.nl", "display_name": "User2", "first_name": "Jane", "prefix": "",
             "last_name": "Smith", "password": "password2", "is_admin": False, "is_public": True,
             "is_banned": False},
            {"email": "1034367@hr.nl", "display_name": "User3", "first_name": "Alice", "prefix": "",
             "last_name": "Johnson", "password": "password3", "is_admin": False, "is_public": True,
             "is_banned": False},
            {"email": "1230003@hr.nl", "display_name": "User4", "first_name": "Bob", "prefix": "",
             "last_name": "Brown", "password": "password4", "is_admin": False, "is_public": True,
             "is_banned": False},
            {"email": "admin@hr.nl", "display_name": "Admin1", "first_name": "Admin", "prefix": "",
             "last_name": "One", "password": "1", "is_admin": True, "is_public": True, "is_banned": False},
            {"email": "1230008@hr.nl", "display_name": "User5", "first_name": "Charlie", "prefix": "",
             "last_name": "Davis", "password": "password5", "is_admin": False, "is_public": True,
             "is_banned": False},
            {"email": "1230001@hr.nl", "display_name": "Admin2", "first_name": "Admin", "prefix": "",
             "last_name": "Two", "password": "adminpassword2", "is_admin": True, "is_public": True,
             "is_banned": False},
            {"email": "0000000@hr.nl", "display_name": "User6", "first_name": "David", "prefix": "",
             "last_name": "Wilson", "password": "password6", "is_admin": False, "is_public": True,
             "is_banned": False}
        ]

        for user in users:
            user["password"] = bcrypt.hashpw(user["password"].encode('utf-8'), bcrypt.gensalt())

        list_of_parameters = [
            (user["email"], user["display_name"], user["first_name"], user["prefix"], user["last_name"],
             user["password"], user["is_admin"], user["is_public"], user["is_banned"])
            for user in users
        ]

        create_statement = """INSERT INTO users (email, display_name, first_name, prefix, last_name, password, is_admin, is_public, is_banned) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"""

        # Call the method to execute the insert
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)


    def __execute_many_transaction_statement(
            self, create_statement, list_of_parameters=()
    ):
        c = self.conn.cursor()
        c.executemany(create_statement, list_of_parameters)
        self.conn.commit()



    # Executes a single SQL query with error checking, copied from previous project
    def __execute_transaction_statement(self, statement, params=None):
        try:
            with self.conn:
                if params:
                    self.conn.execute(statement, params)
                else:
                    self.conn.execute(statement)
        except sqlite3.Error as e:
            raise RuntimeError(f"Database execution failed: {e}")

    # Check if the database file location is valid, copied from previous project
    def test_file_location(self):
        if not self.database_file.parent.exists():
            raise ValueError(
                f"Database file location {self.database_file.parent} does not exist"
            )
        if self.database_file.exists():
            if not self.database_overwrite:
                raise ValueError(
                    f"Database file {self.database_file} already exists, set overwrite=True to overwrite"
                )
            else:
                self.database_file.unlink()
                print("✅ Database already exists, deleted")
        if not self.database_file.exists():
            try:
                self.database_file.touch()
                print("✅ New database setup")
            except Exception as e:
                raise ValueError(
                    f"Could not create database file {self.database_file} due to error {e}"
                )

if __name__ == "__main__":
    my_path = Path(__file__).parent.resolve()
    project_root = my_path.parent
    database_path = project_root / "databases" / "database.db"

    database_generator = DatabaseGenerator(
        database_path, overwrite=True, initial_data=True
    )
    database_generator.generate_database()
