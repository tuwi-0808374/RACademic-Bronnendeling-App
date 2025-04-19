import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';


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
      {posts.map((post, i) => (
        <Text key={i}>
          {post['title']}
          {'\n'}
          {post['content']}
          {'\n'}
          {post['total_rating']}
          {'\n'}

        </Text>
        
      ))}
    </View>
  );
}