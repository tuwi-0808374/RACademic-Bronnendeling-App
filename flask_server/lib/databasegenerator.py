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
        self.conn.execute("PRAGMA foreign_keys = ON")

    # Runs all db generation functions
    def generate_database(self):
        self.create_table_user()
        self.create_table_post()
        self.create_table_comments()
        self.create_table_ratings()
        self.create_table_tags()
        self.create_table_badges()
        self.create_table_user_badges()
        self.create_table_post_tags()
        if self.create_initial_data:
            self.insert_initial_users()
            self.insert_initial_posts()
            self.insert_initial_comments()
            self.insert_initial_ratings()
            self.insert_initial_tags()
            self.insert_initial_badges()
            self.insert_initial_user_badges()
            self.insert_initial_post_tags()

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
        print("✅ Table users was created")

    # Create database table for ratings
    def create_table_ratings(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS ratings (
            user_id INTEGER NOT NULL,
            post_id INTEGER,
            comment_id INTEGER,
            rating INTEGER CHECK (rating IN (1, -1) OR rating IS NULL),
            is_favorite BOOLEAN DEFAULT false,
            is_reported BOOLEAN DEFAULT false,
            report_reason TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (comment_id) REFERENCES comments(id)
        );
        """
        self.__execute_transaction_statement(create_statement)
        print("✅ Table ratings was created")

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
        print("✅ Table posts was created")

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
        print("✅ Table comments was created")

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
        print("✅ Table tags was created")

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
        print("✅ Table badges was created")

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
        print("✅ Table user_badges was created")

    # Create database join table for posts and tags
    def create_table_post_tags(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS post_tags (
            post_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (post_id, tag_id),
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (tag_id) REFERENCES tags(id)
        )
        """
        self.__execute_transaction_statement(create_statement)
        print("✅ Table post_tags was created")
    # alle code van initialiseren van data is van wp3 en de data is gegenereerd door chatgpt
    # Insert initial users into the database
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
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial users inserted")

    # Insert initial posts into the database
    def insert_initial_posts(self):
        posts = [
            {"title": "Eerste post!", "content": "Dit is de eerste post", "user_id": 1, "posted_date": 1681100000},
            {"title": "Gerapporteerde post", "content": "Dit bericht is gerapporteerd", "user_id": 5,
             "posted_date": 1681200000},
            {"title": "markdown test", "content": """This is a markdown *test* ![screamingkiwi](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzL-qI5ImbMMkm9kZoZaIauxJDQ_8djZRpPWS9mVd7YASM2p0CdDe6aHcCKdl4OFnc_54&usqp=CAU)

Markdown is cool""", "user_id": 6,
             "posted_date": 1681300000},
            {"title": "OOP en design patterns", "content": "Alles over OOP en design patterns", "user_id": 7,
             "posted_date": 1681400000}
        ]
        list_of_parameters = [(post["title"], post["content"], post["user_id"], post["posted_date"]) for post in
                              posts]
        create_statement = """INSERT INTO posts (title, content, user_id, posted_date) VALUES (?, ?, ?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial posts inserted")

    # Insert initial comments into the database
    def insert_initial_comments(self):
        comments = [
            {"title": "Interessante discussie", "content": "Ik ben het niet helemaal eens, maar interessant.",
             "user_id": 2, "post_id": 3, "reaction_on": None, "posted_date": 1681500000},
            {"title": "Reageer op de Python post", "content": "Python is veel beter dan C++ voor beginners!",
             "user_id": 3, "post_id": 2, "reaction_on": None, "posted_date": 1681600000},
            {"title": "Nog een reactie", "content": "Laten we verder praten over OOP.", "user_id": 4, "post_id": 4,
             "reaction_on": 2, "posted_date": 1681700000},
            {"title": "Boeiend", "content": "Bedankt voor het delen!",
             "user_id": 2, "post_id": 1, "reaction_on": None, "posted_date": 1681500000},
            {"title": "Mooi mooi", "content": "Dit is heel erg interessant!",
             "user_id": 3, "post_id": 1, "reaction_on": None, "posted_date": 1681600000},
            {"title": "Een korte reactie", "content": "Wauw heel mooi om te zien dit", "user_id": 4, "post_id": 4,
             "reaction_on": 1, "posted_date": 1681700000}
        ]
        list_of_parameters = [(comment["title"], comment["content"], comment["user_id"], comment["post_id"],
                               comment["reaction_on"], comment["posted_date"]) for comment in comments]
        create_statement = """INSERT INTO comments (title, content, user_id, post_id, reaction_on, posted_date) VALUES (?, ?, ?, ?, ?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial comments inserted")

    # Insert initial ratings into the database
    def insert_initial_ratings(self):
        ratings = [
            {"user_id": 1, "post_id": 1, "comment_id": None,"rating": 1 , "is_favorite": True, "is_reported": False,
             "report_reason": None},
            {"user_id": 2, "post_id": None, "comment_id": 2,"rating": -1 , "is_favorite": False, "is_reported": True,
             "report_reason": "Ongepaste inhoud"},
            {"user_id": 3, "post_id": None, "comment_id": 1,"rating": -1, "is_favorite": False, "is_reported": False,
             "report_reason": None},
            {"user_id": 4, "post_id": None, "comment_id": 3,"rating": 1 ,"is_favorite": False, "is_reported": False,
             "report_reason": None}
        ]
        list_of_parameters = [(rating["user_id"], rating["post_id"], rating["comment_id"], rating["is_favorite"],
                               rating["is_reported"], rating["report_reason"]) for rating in ratings]
        create_statement = """INSERT INTO ratings (user_id, post_id, comment_id, is_favorite, is_reported, report_reason) VALUES (?, ?, ?, ?, ?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial ratings inserted")

    # Insert initial tags into the database
    def insert_initial_tags(self):
        tags = [
            {"title": "python", "content": "Dit is een Python gerelateerd bericht"},
            {"title": "c++", "content": "Dit is een C++ gerelateerd bericht"},
            {"title": "oop", "content": "Object georiënteerd programmeren"},
            {"title": "c#", "content": "Dit is een C# gerelateerd bericht"}
        ]
        list_of_parameters = [(tags["title"], tags["content"]) for tags in tags]
        create_statement = """INSERT INTO tags (title, content) VALUES (?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial tags inserted")

    # Insert initial badges into the database
    def insert_initial_badges(self):
        badges = [
            {"title": "First Post!", "requirement": "Eerste bericht geplaatst"},
            {"title": "5 Posts", "requirement": "Minimaal 5 berichten geplaatst"},
            {"title": "10 Posts", "requirement": "Minimaal 10 berichten geplaatst"}
        ]
        list_of_parameters = [(badge["title"], badge["requirement"]) for badge in badges]
        create_statement = """INSERT INTO badges (title, requirement) VALUES (?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial badges inserted")

    # Insert initial user badges into the database
    def insert_initial_user_badges(self):
        user_badges = [
            {"user_id": 1, "badge_id": 1},
            {"user_id": 1, "badge_id": 2},
            {"user_id": 2, "badge_id": 3}
        ]
        list_of_parameters = [(user_badge["user_id"], user_badge["badge_id"]) for user_badge in user_badges]
        create_statement = """INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial user badges inserted")

    # Insert initial post tags into the database
    def insert_initial_post_tags(self):
        post_tags = [
            {"id": 11, "post_id": 1, "tag_id": 1},
            {"id": 12, "post_id": 1, "tag_id": 2},
            {"id": 23, "post_id": 2, "tag_id": 3},
            {"id": 34, "post_id": 3, "tag_id": 4}
        ]
        list_of_parameters = [(post_tags["post_id"], post_tags["tag_id"]) for post_tags in post_tags]
        create_statement = """INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)"""
        self.__execute_many_transaction_statement(create_statement, list_of_parameters)
        print("✅ Initial post tags inserted")

    # Utility method to execute SQL transaction with one statement
    def __execute_transaction_statement(self, statement):
        cursor = self.conn.cursor()
        cursor.execute(statement)
        self.conn.commit()

    # Utility method to execute SQL transaction with multiple statements
    def __execute_many_transaction_statement(self, statement, parameters):
        cursor = self.conn.cursor()
        cursor.executemany(statement, parameters)
        self.conn.commit()

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
