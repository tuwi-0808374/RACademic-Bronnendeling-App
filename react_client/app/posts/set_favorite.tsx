import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export default function Test() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('Geen token gevonden.');
          return;
        }
  
        const decoded_user: any = jwt_decode(token);
        const response = await fetch(`http://127.0.0.1:5000/posts/${decoded_user.user_id}`)
        .then(response => response.json())
        .then(data => {
          setPosts(data.data);
          console.log(data.data);
        })
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts();

  }, []);


  // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
  // https://jasonwatmore.com/post/2020/01/27/react-fetch-http-get-request-examples
  // https://www.youtube.com/watch?v=EcRFYF4B3IQ
  
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
      {posts.map((post, i) => (
        <Text key={i}>
          {'\n'}
          {post['title']}
          {'\n'}
          {post['content']}
          {'\n'}
          {post['total_rating']}
          {'\n'}
          <FavoriteButton post_id = {post['id']} is_favorited = {post['is_favorite']} onPress={undefined}/>
          <hr></hr>
        </Text>       
        
      ))}
    </View>
  );
}