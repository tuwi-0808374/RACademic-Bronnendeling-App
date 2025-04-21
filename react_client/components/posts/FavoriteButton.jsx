import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// https://docs.expo.dev/tutorial/build-a-screen/
// https://medium.com/@yildizfatma/using-custom-components-in-react-native-expo-702a0116fd23

const FavoriteButton = ({ id, is_favorited, onPress}) => {
  const [isFilled, setIsFilled] = useState(is_favorited);
  console.log("is_favorited", is_favorited);
  console.log("id", id);

  const handlePress = async () => {
    try {
      //http://localhost:5000/posts/${post_id}/favorite
      url = "http://localhost:5000/posts/"+id+"/favorite";
      const response = await fetch(url, {
        method: 'POST',
      });
      const result = await response.json();
      console.log(result.post['is_favorite']);
      setIsFilled(result.post['is_favorite']);

    } catch (error) {
      console.error('API request failed:', error);
    }

    if (onPress) {
      onPress(id);
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