import sqlite3, os

class Badge:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.path = os.path.join(base_dir, '../../../databases/database.db') 
        self.cursor, self.con = self.connect_db()
        
    def connect_db(self):
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        return cursor, con
    
    def get_bages_of_user(self, user_id):
        # self.check_if_user_is_eligible_for_badges(user_id)
        
        requirement = self.get_badge_requirements(1)        
        self.cursor.execute('''
            SELECT badges.*, user_badges.user_id
            FROM badges 
            JOIN user_badges ON badges.id = user_badges.badge_id 
            WHERE user_badges.user_id = ?''', (user_id,))
        badges = self.cursor.fetchall()
        result_dicts = [dict(row) for row in badges]
        return result_dicts
    
    def has_user_badge(self, user_id, badge_id):
        self.cursor.execute('''
            SELECT * FROM user_badges 
            WHERE user_id = ? AND badge_id = ?''', (user_id, badge_id))
        result = self.cursor.fetchone()
        if result:
            return True
        return False
    
    def give_badge_to_user(self, user_id, badge_id):
        message = "Badge already given to user"
        if self.has_user_badge(user_id, badge_id):
            return False, message
        
        self.cursor.execute('''
            INSERT INTO user_badges (user_id, badge_id) 
            VALUES (?, ?)''', (user_id, badge_id))
        self.con.commit()
        
        message = "Badge given to user"
        return True, message
    
    def get_badge_requirements(self, badge_id):
        self.cursor.execute('''
            SELECT requirement FROM badges
            WHERE id = ?''', (badge_id,))
        result = self.cursor.fetchone()
        if result:
            return result[0]
        return None

    
    def check_if_user_is_eligible_for_badges(self, user_id):
        # Geeft alleen de badges terug die de gebruiker nog niet heeft
        self.cursor.execute('''
            SELECT * FROM badges 
            WHERE id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)''', (user_id,))
        badges = self.cursor.fetchall()
        
        # Requirtement is een dict met requirements als key en de method als value
        # De method moet true zijn om de badge te krijgen
        requirements_method = {
            "Eerste bericht geplaatst": self.count_user_posts(user_id) > 0,
            "Minimaal 5 berichten geplaatst": self.count_user_posts(user_id) > 5,
            "Minimaal 10 berichten geplaatst": self.count_user_posts(user_id) > 10,
            "Eerste favoriet toegevoegd": self.count_user_favorites(user_id) > 0,
            "Minimaal 5 favorieten toegevoegd": self.count_user_favorites(user_id) > 5,
            "Minimaal 10 favorieten toegevoegd": self.count_user_favorites(user_id) > 10,
        }
        
        # Ga na of de gebruiker in aanmerking komt voor de badges die hij nog niet heeft
        # Als de gebruiker in aanmerking komt voor een badge, geef deze dan aan de gebruiker
        new_badges_received = []
        for badge in badges:    
            if badge['requirement'] in requirements_method and requirements_method[badge['requirement']]:
                print("User is eligible for badge: ", badge['id'])
                result = self.give_badge_to_user(user_id, badge['id'])
                if result[0]:
                    print("Badge given to user: ", badge['id'])
                    new_badge = {
                        "id": badge['id'],
                        "title": badge['title'],
                        "requirement": badge['requirement'],
                        "image_url": badge['image_url'],
                        "user_id": user_id,
                    }
                    new_badges_received.append(new_badge)
                else:
                    print("Badge already given to user: ", badge['id'])
        
        return new_badges_received
        
    def count_user_posts(self, user_id):
        self.cursor.execute('''
            SELECT COUNT(*) FROM posts 
            WHERE user_id = ?''', (user_id,))
        result = self.cursor.fetchone()
        if result:
            return result[0]
        return 0    
    
    def count_user_favorites(self, user_id):
        self.cursor.execute('''
            SELECT COUNT(*) FROM ratings 
            WHERE user_id = ? AND is_favorite = 1''', (user_id,))
        result = self.cursor.fetchone()
        if result:
            return result[0]
        return 0
        
    