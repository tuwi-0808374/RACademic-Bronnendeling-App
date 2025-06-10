import sqlite3, os
from datetime import datetime
from blueprints.tag.models.tag_model import Tag


class Post:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db') 
        self.cursor, self.con = self.connect_db()

    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con

    # If user_id is given it will also returns if each post is a favorite for that user
    def get_posts(self, user_id = None, limit = None):
        params = []
        if user_id:
            query = """
                    SELECT posts.*, ratings.is_favorite , ratings.userRated , ratings.rating, GROUP_CONCAT(post_tags.tag_id) AS tag_ids,  
                    CASE 
                        WHEN users.is_public = true THEN users.display_name
                        ELSE users.username
                    END AS user_name
                    FROM posts
                    LEFT JOIN ratings ON posts.id = ratings.post_id AND ratings.user_id = ?
                    JOIN users ON posts.user_id = users.id
                    LEFT JOIN post_tags 
                        ON posts.id = post_tags.post_id
                    GROUP BY posts.id
                    """
            params.append(user_id)
        else:
            query = "SELECT * FROM posts"
            
        if limit:
            query += " LIMIT ?"
            params.append(limit)

        query += " ORDER BY posted_date DESC"
        
        self.cursor.execute(query, params)

        posts = self.cursor.fetchall()
        result_dicts = [dict(row) for row in posts]
        return result_dicts

    def search_posts(self, user_id, search_query, tag_ids):
        tag = Tag()
        params = (user_id,)
        query = """
                SELECT 
                posts.*,ratings.is_favorite , ratings.userRated , ratings.rating, GROUP_CONCAT(post_tags.tag_id) AS tag_ids,
                CASE 
                    WHEN users.is_public = true THEN users.display_name
                    ELSE users.username
                END AS user_name
                FROM posts
                JOIN users ON posts.user_id = users.id
                LEFT JOIN ratings ON posts.id = ratings.post_id AND ratings.user_id = ?
                LEFT JOIN post_tags ON posts.id = post_tags.post_id
                WHERE 1=1 
                """

        #roept functie om alle post_ids met correcte tags op te halen
        if tag_ids:
            post_ids = tag.get_post_by_tags(tag_ids)
            # voegt alle post ids met de juiste tags aan de query toe
            if post_ids:
                total_params = ','.join(['?'] * len(post_ids))
                query += f"AND posts.id IN ({total_params}) "
                params += tuple(post_ids)
            else:
                return False

        if search_query:
            # split content en voegt voor elk woord samen in een tuple params
            words = search_query.split()
            for word in words:
                # checked voor content en title
                query += "AND (LOWER(posts.content) LIKE ? or LOWER(posts.title) LIKE ?) "
                params += (str('%' + word.lower() + '%'),str('%' + word.lower() + '%'),)
        query += (str("GROUP BY posts.id ORDER BY posts.posted_date DESC"))

        # params +=  user_id,
        print(query, params,)
        self.cursor.execute(query, params,)
        posts = self.cursor.fetchall()

        if posts:
            result_dicts = [dict(row) for row in posts]
            return result_dicts
        return False


    def get_post_by_id(self, post_id):
        query = "SELECT * FROM posts WHERE id = ?"
        self.cursor.execute(query, (post_id,))
        post = self.cursor.fetchone()

        dict_post = dict(post) if post else None

        comments = self.get_comments_by_post_id(post_id)
        dict_post['comments'] = comments if comments else []
        
        if dict_post:
            return dict_post
        return None
    
    def get_comments_by_post_id(self, post_id):
        query = "SELECT * FROM comments WHERE post_id = ?"
        self.cursor.execute(query, (post_id,))
        comments = self.cursor.fetchall()

        if comments:
            result_dicts = [dict(row) for row in comments]
            return result_dicts
        return None

    #bron https://docs.python.org/3/library/datetime.html
    def post_create_post(self, data):
        posted_date = int(datetime.now().timestamp())
        query = "INSERT INTO posts (title, content, user_id, posted_date) VALUES (?,?,?,?)"
        result = self.cursor.execute(query, (data["title"], data["content"], data["user_id"], posted_date))
        self.con.commit()
        if result:
            return True
        return False


    def get_latest_posts_id(self):
        query = "SELECT id FROM posts ORDER BY id DESC LIMIT 1"
        self.cursor.execute(query)
        result = self.cursor.fetchone()
        dict_result = dict(result) if result else None
        return dict_result


    def post_assign_post_tags(self, tag_ids, post_id):
        result = None
        for tag_id in tag_ids:
            query = "INSERT INTO post_tags (tag_id, post_id) VALUES (?,?)"
            result = self.cursor.execute(query, (tag_id, post_id))
            self.con.commit()
        if result:
            return True
        return False

    def delete_assigned_post_tags(self, post_id):
        query = "DELETE FROM post_tags WHERE post_id = ?"
        result = self.cursor.execute(query, (post_id,))
        if result:
            return True
        return False

    def get_posts_by_user_id(self, user_id):
        query = "SELECT * FROM posts WHERE user_id = ?"
        self.cursor.execute(query,(user_id,))
        posts = self.cursor.fetchall()

        if posts:
            result_dicts = [dict(row) for row in posts]
            return result_dicts
        return None

    def delete_post(self, post_id):
        query = "DELETE FROM posts WHERE id = ?"
        result = self.cursor.execute(query, (post_id,))
        self.con.commit()
        if result:
            return True
        return False


    def patch_edit_post(self, id, data):
        query = "UPDATE posts SET title = ?, content = ? WHERE id = ?"
        result = self.cursor.execute(query, (data["title"], data["content"], id))
        self.con.commit()
        if result:
            return True
        return False


    def get_favorite_posts(self, user_id):
        # query = """
        #         SELECT posts.*, ratings.is_favorite FROM posts
        #         JOIN ratings ON posts.id = ratings.post_id
        #         WHERE ratings.user_id = ? AND ratings.is_favorite = 1
        #         """
        # params = []
        if user_id:
            query = """
                    SELECT posts.*, ratings.is_favorite, ratings.userRated, ratings.rating,
                       CASE 
                         WHEN users.is_public = 1 THEN users.display_name
                         ELSE users.username
                       END AS user_name
                    FROM posts
                    LEFT JOIN ratings ON posts.id = ratings.post_id AND ratings.user_id = ?
                    JOIN users ON posts.user_id = users.id
                    WHERE ratings.user_id = ? AND ratings.is_favorite = 1
                    """
            # params.append(user_id)
        else:
            query = "SELECT * FROM posts"

        self.cursor.execute(query, (user_id, user_id))
        favorite_posts = self.cursor.fetchall()
        result_dicts = [dict(row) for row in favorite_posts]
        return result_dicts
    
    def is_post_favorite(self, post_id, user_id):
        query = """
                SELECT * FROM ratings
                WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
                """
        self.cursor.execute(query, (user_id, post_id))
        is_favorite = self.cursor.fetchone()
        if is_favorite:
            return dict(is_favorite)
        return None

    def add_post_as_favorite(self, post_id, user_id):
        # Check if the post is already marked as favorite by the user
        is_favorite = self.is_post_favorite(post_id, user_id)

        if is_favorite:
            query = """
                    UPDATE ratings
                    SET is_favorite = ?
                    WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
                    """
            # Toggle the favorite status
            toggle_favorite = not is_favorite['is_favorite']
            self.cursor.execute(query, (toggle_favorite, user_id, post_id))
            self.con.commit()
        else:
            # Check first if the post exists at all
            query = "SELECT * FROM posts WHERE id = ?"
            self.cursor.execute(query, (post_id,))
            post = self.cursor.fetchone()
            if not post:
                return None               
            
            query = """INSERT INTO ratings (user_id, post_id, is_favorite) VALUES (?, ?, ?)"""
            self.cursor.execute(query, (user_id, post_id, True))
            self.con.commit()

        # Return the post with the updated favorite status
        query = """
                SELECT * FROM ratings
                WHERE user_id = ? AND post_id = ? AND comment_id IS NULL
                """

        self.cursor.execute(query, (user_id, post_id))
        result = self.cursor.fetchone()
        dict_result = dict(result) if result else None
        return dict_result
    
    def add_multiple_posts_as_favorite(self, post_ids, user_id):
        result = []
        for post_id in post_ids:
            favorite_post = self.add_post_as_favorite(post_id, user_id)
            if favorite_post:
                result.append(favorite_post)
        
        result_dicts = [dict(row) for row in result]
        return result_dicts
    
    def get_most_upvoted_posts(self, user_id = None, limit = 10):
        params = []
        query = """
                SELECT *
                FROM posts
                """
        if user_id:
            query += """
                    WHERE user_id = ?
                    """
            params.append(user_id)
        
        query += " ORDER BY total_rating DESC LIMIT ?"
        params.append(limit)
        self.cursor.execute(query, params)
        posts = self.cursor.fetchall()
        result_dicts = [dict(row) for row in posts]
        return result_dicts
