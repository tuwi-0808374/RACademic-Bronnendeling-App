import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import RateButtons from "@/components/posts/RateButtons";

export default function Test() {
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data.data.posts);
        setRatings(data.data.user_rating);
      })

  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
      {posts.map((post, i) => (
        <Text key={i}>
          {'\n'}
          {post['post_id']}
          {'\n'}
          {post['title']}
          {'\n'}
          {post['content']}
          {'\n'}
          {post['total_rating']}
          {'\n'}
          <RateButtons
              Post_id={post['post_id']}
              Total_Rating={ post['total_rating']}
              Ratings={ratings}
          />
          {'\n'}
        </Text>
      ))}
    </View>
  );
}