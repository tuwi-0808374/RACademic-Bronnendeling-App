import { useState, useEffect } from 'react';
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {getApiBaseUrl} from "@/constants/get_ip";
const API_BASE_URL = getApiBaseUrl();

export default function MostUpvoted() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [user_id, setUserId] = useState(0);
  const params = useLocalSearchParams();

  interface JwtPayload {
    sub: string;
    user_id: number;
    full_name?: string;
    iat: number;
    exp: number;
    jti: string;
    is_admin: boolean;
  }

  useEffect(() => {
      if (params.id){
        let id = parseInt(params.id as string);
        fetchPosts(id);
        return;
      }

    //   const fetchProfile = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem("authToken");
    //     if (!token) {
    //       console.log("Geen token gevonden.");
    //       return;
    //     }

    //     const decoded = jwt_decode<JwtPayload>(token);
    //     const currentUserId = decoded.user_id;

    //     if (!currentUserId) {
    //       console.error("User ID niet gevonden in token:", decoded);
    //       return;
    //     }

    //     setUserId(currentUserId);
    //   } catch (error) {
    //     console.error("Error loading user ID:", error);
    //   }
    // }
    // fetchProfile();
    // fetchPosts();
  }, []);

    const fetchPosts = async (userId: Number = 0) => {
      try {
        let url = `${API_BASE_URL}/posts/most_upvoted`;
        if (userId !== 0) {
          url = `${API_BASE_URL}/posts/most_upvoted/${userId}`;
        }
        const response = await fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(data.posts);
            setPosts(data.posts);
          });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };  

  // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
  // https://jasonwatmore.com/post/2020/01/27/react-fetch-http-get-request-examples
  // https://www.youtube.com/watch?v=EcRFYF4B3IQ

  return (
            <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Bronnen van { params.username }</Text>
                    </View>


                <ScrollView style={styles.scrollview} >
                    <View style={styles.header}>
                      { posts.length === 0 && (
                        <Text style={styles.textTitle}>Deze gebruiker heeft nog geen bronnen</Text>
                      )}
                        {posts.map((post) => (
                            <View key={post['id']} style={styles.postbox} >
                                <Text style={styles.textTitle}>{post['title']}</Text>
                                <Text style={styles.textContent}>{post['content']}</Text>

                                {/* <TouchableOpacity onPress={() => router.push({ pathname: "/posts/edit_post", params: { post_id: post['id']} })}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttontext}>edit post</Text>
                                    </View>
                                </TouchableOpacity> */}
                            </View>
                        ))}
                    </View>
                </ScrollView>

                </View>
            </SafeAreaView>
  );
}
const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    backgroundDark: '#535353',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        flex: 1,
    },
    header: {
        marginVertical: 36,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 1,
        textAlign: "center",
    },
    textTitle:{
        fontSize: 30,
        fontWeight: "semibold",
        color: COLORS.text,
        marginBottom: 1,

    },
    textContent:{
        fontSize: 22,
        fontWeight: "semibold",
        color: COLORS.text,
        marginBottom: 1,

    },
    form:{},
    input:{},
    inputlabel:{
        fontSize: 20,
        fontWeight: "semibold",
        color: COLORS.text,
        marginBottom: 5,
        textAlign: "center"
    },
    inputcontroltitel:{
        fontSize: 15,
        fontWeight: "semibold",
        color: COLORS.text,
        height: 50,
        backgroundColor: COLORS.textLight,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 25,
    },
    inputcontrolcontent:{
        fontSize: 15,
        fontWeight: "semibold",
        color: COLORS.text,
        height: 150,
        backgroundColor: COLORS.textLight,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 25,
    },
    create:{},
    button:{
        backgroundColor: COLORS.red,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.text,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttontext:{
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textLight,
    },
    postbox: {
        width: "100%",
        marginHorizontal: 1,
        marginBottom: 10,
        backgroundColor: COLORS.textLight,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'column',
    },
    scrollview:{
        flex: 1
    }
    })