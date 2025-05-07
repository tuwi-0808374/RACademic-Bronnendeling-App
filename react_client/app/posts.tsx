import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import RateButtons from "@/components/posts/RateButtons";
import FavoriteButton from '../components/posts/FavoriteButton';

export default function Test() {
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/posts/2")
      .then(res => res.json())
      .then(data => {
        console.log("this is data",data)
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
          {post['id']}
          {'\n'}
          {post['title']}
          {'\n'}
          {post['content']}
          {'\n'}
          <RateButtons
              Post_id={post['id']}
              Total_Rating={ post['total_rating']}
              Ratings={ratings}
          />
          {'\n'}
          <FavoriteButton post_id = {post['id']} is_favorited = {post['is_favorite']} onPress={undefined}/>
        </Text>
      ))}
    </View>
  );
}