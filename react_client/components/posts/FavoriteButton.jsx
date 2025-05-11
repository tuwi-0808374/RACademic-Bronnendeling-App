import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

// https://docs.expo.dev/tutorial/build-a-screen/
// https://medium.com/@yildizfatma/using-custom-components-in-react-native-expo-702a0116fd23

const FavoriteButton = ({ post_id, is_favorited = 0, onPress}) => {
  const [isFilled, setIsFilled] = useState(is_favorited);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('Geen token gevonden.');
          return;
        }

        const decoded_user = jwt_decode(token);
        setUser(decoded_user);

        if (is_favorited) {
          console.log('is_favorited:', is_favorited);
          setIsFilled(is_favorited);
          return;
        }

        url = `http://localhost:5000/posts/${post_id}/favorite/${decoded_user.user_id}`;
        const response = await fetch(url, {
          method: 'GET',
        });
        const result = await response.json();
        if (result){
          console.log('result:', result);
          setIsFilled(result.post['is_favorite']);
        }
        else
        {
          setIsFilled(0);
        }

      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    fetchUser();
  }
  , []);

  const handlePress = async () => {
    try {
      url = `http://localhost:5000/posts/${post_id}/favorite/${user.user_id}`;
      const response = await fetch(url, {
        method: 'POST',
      });
      const result = await response.json();
      setIsFilled(result.post['is_favorite']);

    } catch (error) {
      console.error('API request failed:', error);
    }

    if (onPress) {
      onPress(post_id);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons
        name={isFilled ? 'heart' : 'heart-outline'}
        size={24}
        color={isFilled ? '#ff0000' : '#000000'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default FavoriteButton;