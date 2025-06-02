import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import RateButtons from "@/components/posts/RateButtons";
import FavoriteButton from '../components/posts/FavoriteButton';
import {getApiBaseUrl} from "@/constants/get_ip";
import { useUser } from '@/constants/get_user_id';
import {useRouter} from "expo-router";
const API_BASE_URL = getApiBaseUrl();

function Posts() {
  const [posts, setPosts] = useState([]);
  const { userId, loading } = useUser();
  const local = useLocalSearchParams();
  const router = useRouter();
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
          console.log('data',data);
          console.log('posts',posts)
        } catch (error) {
          console.error('API request failed:', error);
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
  if (!posts) {
    return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
          <Text>No posts found</Text>
        </View>
    )
  }

  return (

    <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={styles.container}>
      {posts.map((post, i) => (
        <Text key={i} style={styles.postContainer}>
          <Text style={{ fontSize: 10 }}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/account/profile", params: { user_id: post['id']} })}>
          <Text style={{ fontWeight: 'bold' }}>Geplaatst door: {post['user_name']}</Text>
                                              
                                          </TouchableOpacity>
          {'\n'}
            {post['user_name']? post['user_name']:'anonymous user'}
          </Text>
          {'\n'}
          <Text style={styles.title}>{post['title']}</Text>
          {'\n'}
          {post['user_id'] === userId && (
              <TouchableOpacity onPress={() => router.push({ pathname: "/posts/edit_post", params: { post_id: post['id']} })}>
                <View>
                  <Text>edit post</Text>
                </View>
              </TouchableOpacity>
          )}
          {'\n'}
          <View style={styles.content_container}></View>
          {post['content']}
          {'\n'}
          <RateButtons
          post_id={post['id']}
          total_rating={ post['total_rating']}
          user_rating={post['rating']}
          userId={userId}
          loading={loading}
          />
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
  },
  postContainer: {
    width: '50%',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 5,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  content_container: {
    flexDirection: 'row',
  }

})
export default Posts;