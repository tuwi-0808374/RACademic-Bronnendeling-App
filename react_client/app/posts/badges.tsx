import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export default function Badges() {
  const [badges, setBadges] = useState([]);

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
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
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
            <hr />
          </Text>
        ))
      )}
    </View>
  );
}