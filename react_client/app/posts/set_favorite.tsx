import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';

export default function Test() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:5000/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data.data);
        console.log(data.data);
      })
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
          <FavoriteButton id = {post['id']} is_favorited = {post['is_favorite']} onPress={undefined}/>
          <hr></hr>
        </Text>       
        
      ))}
    </View>
  );
}