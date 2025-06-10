import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import RateButtons from "@/components/posts/RateButtons";
import FavoriteButton from '@/components/posts/FavoriteButton';
import {getApiBaseUrl} from "@/constants/get_ip";
import { useUser } from '@/constants/get_user_id';
import {useRouter} from "expo-router";
const API_BASE_URL = getApiBaseUrl();

function Posts() {
  const [posts, setPosts] = useState([]);
  const { userId, loading } = useUser();
  const local = useLocalSearchParams();
  const router = useRouter();
  // const[tags, setTags] = useState([])

  useEffect(() => {
    if (!loading && userId) {
      const fetchPosts = async () => {

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
          const res = await fetch(url);
          const data = await res.json();
          setPosts(data.data);
        } catch (error) {
          console.error('API request failed:', error);
        }
      };
      fetchPosts();
    }
  }, [userId, loading]);
  if (!userId) {

    return (
        <View style={[styles.container,{justifyContent:"center", alignItems:'center'}]}>
          <Text>Please log in to see posts.</Text>
        </View>
    )
  }
  if (loading) {
    return <Text>Loading user info...</Text>;
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
    <SafeAreaView style={{height: '100%'}}>
      <ScrollView style={styles.container}>

        {posts.map((post, i) => (
          <TouchableWithoutFeedback key={i}>
            <View key={i} style={[styles.postContainer, Platform.OS === 'web'? {width: '50%'} : {width: '100%'}]}>
              {/*profile*/}
              <View style={{ flexDirection:'row'}}>
                  <Text style={{ fontSize: 15,fontWeight: 'bold' }}>Geplaatst door: </Text>
                  <TouchableOpacity onPress={() => router.push({ pathname: "/account/profile", params: { user_id: post['user_id']} })}>
                    <Text style={{ fontSize: 15,fontWeight: 'bold' }}>{post['user_name']? post['user_name']:'anonymous user'}</Text>
                  </TouchableOpacity>
              </View>

              <View style={{justifyContent:'flex-start'}}>
                <Text style={styles.title}>{post['title']}</Text>
              </View>
              {post['user_id'] === userId && (
                  <TouchableOpacity onPress={() => router.push({ pathname: "/posts/edit_post", params: { post_id: post['id']} })}>
                    <View>
                      <Text>edit post</Text>
                    </View>
                  </TouchableOpacity>
              )}

              <View style={styles.contentContainer}>
                <Text>{post['content']}</Text>
              </View>

              <View style={{flexDirection:'row'}}>
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
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'off-white',
  },
  postContainer: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  contentContainer: {
    // flexDirection: 'row',
  }

})
export default Posts;