import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import RateButtons from "@/components/posts/RateButtons";
import FavoriteButton from '../components/posts/FavoriteButton';
import {getApiBaseUrl} from "@/constants/get_ip";
import { useUser } from '@/constants/get_user_id';
const API_BASE_URL = getApiBaseUrl();

function Posts() {
  const [posts, setPosts] = useState([]);
  const { userId, loading } = useUser();
  const local = useLocalSearchParams();
  useEffect(() => {
    const fetchPosts = async () => {
      if (!loading && userId) {
        try {

          const params = new URLSearchParams();
          if (local.search_query && local.search_query !== 'undefined') {
            const search = Array.isArray(local.search_query)
                ? local.search_query.join(',')
                : local.search_query;
                params.append('search_query', search);
          }

          if (local.tag_ids && local.tag_ids !== 'undefined') {
            const tags = Array.isArray(local.tag_ids)
                ? local.tag_ids.join(',')
                : local.tag_ids;
                params.append('tag_ids', tags);
          }

          const queryString = params.toString();



          const url= queryString ? `${API_BASE_URL}/posts/${userId}?${queryString}` : `${API_BASE_URL}/posts/${userId}`;
          console.log(url);
          const res = await fetch(url);
          const data = await res.json();
          setPosts(data.data);
        } catch (error) {
          console.error('API request failed:', error);
          return <Text>posts not found</Text>;
        }
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId, loading]);

  if (loading && !userId) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
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
              userId={userId}
              loading={loading}
          />
          {'\n'}
          <FavoriteButton
              post_id = {post['id']}
              is_favorited = {post['is_favorite']}
              onPress={undefined}
              user_id={userId}
              loading={loading}
          />
        </Text>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    height: '100%',
  }

})
export default Posts;