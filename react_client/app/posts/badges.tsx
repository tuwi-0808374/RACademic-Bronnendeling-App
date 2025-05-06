import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const badgeImages = {
    'default_badge.png': require('../../assets/images/badges/default_badge.png'),
    '5posts_badge.png': require('../../assets/images/badges/5posts_badge.png'),
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('Geen token gevonden.');
          return;
        }

        const decoded_user: any = jwt_decode(token);

        // let url = `http://localhost:5000/posts/most_upvoted`;
        let url_user = `http://localhost:5000/badge/${decoded_user.user_id}`;

        const response = await fetch(url_user)
          .then(response => response.json())
          .then(response => {
            console.log(response.data);
            setBadges(response.data);
          });
      } catch (error) {
        console.error('Error fetching badge:', error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dit zijn jouw badges!:</Text>
      {badges.length === 0 ? (
        <Text>Je hebt nog geen badges.</Text>
      ) : (
        badges.map((badge, i) => (
          <Text key={i}>
            {'\n'}
            {badge['id']}
            {'\n'}
            {badge['title']}
            {'\n'}
            {badge['requirement']}
            <Image
                source={badgeImages[badge['image_url']]}
                style={styles.badge}
                resizeMode="contain"
              />
            <hr />
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 50,
    height: 50,
    margin: 10,
  },
});