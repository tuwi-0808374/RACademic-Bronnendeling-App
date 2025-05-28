import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'expo-router';

export default function MostUpvoted() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [user_id, setUserId] = useState(0);

    interface JwtPayload {
    sub: string;
    user_id: number;
    full_name?: string;
    iat: number;
    exp: number;
    jti: string;
    is_admin: boolean;
  }

  useEffect(() => {
      const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("Geen token gevonden.");
          return;
        }

        const decoded = jwt_decode<JwtPayload>(token);
        const currentUserId = decoded.user_id;

        if (!currentUserId) {
          console.error("User ID niet gevonden in token:", decoded);
          return;
        }

        setUserId(currentUserId);
      } catch (error) {
        console.error("Error loading user ID:", error);
      }
    }
    fetchProfile();
    fetchPosts();
  }, []);

    const fetchPosts = async (userId: Number = 0) => {
      try {
        let url = `http://localhost:5000/posts/most_upvoted`;
        if (userId !== 0) {
          url = `http://localhost:5000/posts/most_upvoted/${userId}`;
        }
        const response = await fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(data.posts);
            setPosts(data.posts);
          });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };  

  // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
  // https://jasonwatmore.com/post/2020/01/27/react-fetch-http-get-request-examples
  // https://www.youtube.com/watch?v=EcRFYF4B3IQ

  return (
    <View style={{ padding: 20 }}>
      <Button title="Terug" onPress={() => router.push('/')} />
      <Button color='green' title="Mijn posts" onPress={() => fetchPosts(user_id)} />
      <Button color='blue' title="Alle posts" onPress={() => fetchPosts(0)} />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
      {posts.length === 0 ? (
        <Text>No posts available.</Text>
      ) : (
        posts.map((post, i) => (
          <Text key={i}>
            {'\n'}
            {post['title']}
            {'\n'}
            {post['content']}
            {'\n'}
            {post['total_rating']}
            {'\n'}
            <hr />
          </Text>
        ))
      )}
    </View>
  );
}