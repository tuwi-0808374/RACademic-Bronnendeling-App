import sqlite3
from pathlib import Path

class DatabaseGenerator:
    def __init__(self, database_file, overwrite=False, initial_data=False):
        self.database_file = Path(database_file)
        self.create_initial_data = initial_data
        self.database_overwrite = overwrite
        self.test_file_location()
        self.conn = sqlite3.connect(self.database_file)

    # Runs all db generation functions
    def generate_database(self):
        self.create_table_user()
        self.create_table_post()
        self.create_table_comments()
        self.create_table_ratings()
        if self.create_initial_data:
            self.insert_users_data()

    # Create database table for users
    def create_table_user(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
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
        CREATE TABLE IF NOT EXISTS user_badges (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
        )
        """
        self.__execute_transaction_statement(create_statement)
    # Inserts test data into the database
    def insert_users_data(self):
        user_data = [
            ("1103166@hr.nl", "Alice", "Alice", "A", "Smith", "password1"),
            ("1103166@hr.nl", "Bob", "Bob", "B", "Jones", "password2"),
            ("1103166@hr.nl", "Charlie", "Charlie", "C", "Brown", "password3")
        ]
        with self.conn:
            self.conn.executemany(
                "INSERT INTO users (email, display_name, first_name, prefix, last_name, password) VALUES (?, ?, ?, ?, ?, ?)", test_data
            )

    # Executes a single SQL query with error checking
    def __execute_transaction_statement(self, statement):
        try:
            with self.conn:
                self.conn.execute(statement)
        except sqlite3.Error as e:
            raise RuntimeError(f"Database execution failed: {e}")

    # Check if the database file location is valid
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
