import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';

export default function Test() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/posts/favorite")
      .then(res => res.json())
      .then(data => {
        setPosts(data.data);
        console.log(data.data);
      })
      .catch(err => console.error("Error fetching favorite posts:", err));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
      {posts === undefined ? (
        <Text>No favorite posts found.</Text>
      ) : posts.map((post, i) => (
        <Text key={i}>
          {'\n'}
          {post['title']}
          {'\n'}
          {post['content']}
          {'\n'}
          {post['total_rating']}
          {'\n'}
          <FavoriteButton id = {post['id']} is_favorited = {post['is_favorite']}/>
          <hr></hr>
        </Text>  
        
        ))}
    </View>
  );
}