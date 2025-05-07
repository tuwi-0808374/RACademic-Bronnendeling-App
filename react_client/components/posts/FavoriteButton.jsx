import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

// https://docs.expo.dev/tutorial/build-a-screen/
// https://medium.com/@yildizfatma/using-custom-components-in-react-native-expo-702a0116fd23

const FavoriteButton = ({ post_id, is_favorited, onPress, user_id}) => {
  const [isFilled, setIsFilled] = useState(is_favorited);

  const handlePress = async () => {
    let url = `http://localhost:5000/posts/${post_id}/favorite/${user_id}`;
    const response = await fetch(url, {
      method: 'POST',
    });
    const result = await response.json();
    setIsFilled(result.post['is_favorite']);
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