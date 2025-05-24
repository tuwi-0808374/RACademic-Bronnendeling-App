import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RateButtons from "@/components/posts/RateButtons";
import FavoriteButton from '../components/posts/FavoriteButton';
import useUserId from '../constants/get_user_id'


function Posts() {

  const [posts, setPosts] = useState([]);
  const user_id = useUserId();

  console.log(user_id);
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
    <View style={styles.container}>
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
const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    height: '100%'
  }

})
export default Posts;