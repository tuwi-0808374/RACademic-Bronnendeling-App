import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import RateButtons from "@/components/posts/RateButtons";
import FavoriteButton from '../components/posts/FavoriteButton';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const get_user_id = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.log('Geen token gevonden.');
      return null;
    }

    const decoded_user = jwt_decode(token);
    // @ts-ignore
    return decoded_user.user_id;

  } catch (error) {
    console.error('API request failed:', error);
  }
}

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [user_id, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await get_user_id();
      if (id) {
        setUserId(id);
      }
    };

    fetchUserId();
  }, []);



  useEffect(() => {
    const fetchPosts = async () => {
      if (user_id) {
        try {
          const res = await fetch(`http://127.0.0.1:5000/posts/${user_id}`);
          const data = await res.json();
          setPosts(data.data);
        } catch (error) {
          console.error('API request failed:', error);
        }
      }
    };

    if (user_id) {
      fetchPosts();
    }
  }, [user_id]);

  return (
    <View style={{ padding: 20, overflowY: 'scroll', height: '100%' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
      {posts.map((post, i) => (
        <Text key={i}>
          {'\n'}
          {post['id']}
          {'\n'}
          {post['title']}
          {'\n'}
          {post['content']}
          {'\n'}
          <RateButtons
              post_id={post['id']}
              total_rating={ post['total_rating']}
              user_rating={post['rating']}
              user_id={user_id}
          />
          {'\n'}
          <FavoriteButton
              post_id = {post['id']}
              is_favorited = {post['is_favorite']}
              onPress={undefined}
              user_id={user_id}
          />
        </Text>
      ))}
    </View>
  );
}
