import sqlite3
from pathlib import Path
# Db generator had ik van ons vorige project nagemaakt en aangepast om opnieuw gebruikt te worden

class DatabaseGenerator:
    def __init__(self, database_file, overwrite=False, initial_data=False):
        self.database_file = Path(database_file)
        self.create_initial_data = initial_data
        self.database_overwrite = overwrite
        self.test_file_location()
        self.conn = sqlite3.connect(self.database_file)

    # Runs all db generation functions
    def generate_database(self):
        self.create_table_test()
        if self.create_initial_data:
            self.insert_test_data()

    # Create database table
    def create_table_test(self):
        create_statement = """
        CREATE TABLE IF NOT EXISTS test (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
        """
        self.__execute_transaction_statement(create_statement)

    # Inserts test data in database
    def insert_test_data(self):
        test_data = [("Alice",), ("Bob",), ("Charlie",)]
        with self.conn:
            self.conn.executemany("INSERT INTO test (name) VALUES (?)", test_data)

    # Executes a single sql query with error checking
    def __execute_transaction_statement(self, statement):
        try:
            with self.conn:
                self.conn.execute(statement)
        except sqlite3.Error as e:
            raise RuntimeError(f"Database execution failed: {e}")

    # Check if db already exists
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
