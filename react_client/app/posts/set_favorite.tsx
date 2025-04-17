import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Alert } from 'react-native';

export default function Test() {
  const [posts, setPosts] = useState([]);
  const { bla } = useLocalSearchParams();

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
  
  const makeFavorite = (post_id: number) => {
    console.log("makeFavorite: " + post_id);
    // http://localhost:5000/posts/2/favorite
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        
    };
    fetch(`http://localhost:5000/posts/${post_id}/favorite`, requestOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data.data);
      })
  };


  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
      {posts.map((post, i) => (
        <Text key={i}>
        <Button
          title="Maak favoriet"
          onPress={() => makeFavorite(post['id'])}
        />{'\n'}
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