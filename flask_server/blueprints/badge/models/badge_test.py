import badge_model

badge = badge_model.Badge()
print(f"Count all badges {len(badge.get_bages_of_user(1))}")
for b in badge.get_bages_of_user(1):
    print(f"Badge id: {b['id']}, name: {b['title']}, description: {b['requirement']}")   


print(f"Count user favorites {badge.count_user_favorites(1)}")
print(f"Count user posts {badge.count_user_posts(1)}")
