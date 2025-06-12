import { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import FavoriteButton from '@/components/posts/FavoriteButton';
import {getApiBaseUrl} from "@/constants/get_ip";
import {useRouter} from "expo-router";
import RateButtons from "@/components/posts/RateButtons";
import { useUser } from '@/constants/get_user_id';
import {Ionicons} from '@expo/vector-icons';
const API_BASE_URL = getApiBaseUrl();

// Bronnen:
// https://stackoverflow.com/questions/62917259/how-to-pass-an-array-of-numbers-with-typescript-and-react
// https://www.dhiwise.com/post/react-usestate-append-to-array-a-simple-guide

export default function favourites() {
  const [posts, setPosts] = useState([]);
  const { userId, loading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!loading && userId){
      fetchPosts();
    }

  }, [userId, loading]);

  const fetchPosts = async () => {
    try {
      if (!loading && userId) {
        fetch(`${API_BASE_URL}/posts/favorite/${userId}`)
        .then((response) => {
          if (response.status === 401) {
            console.log("Unauthorized access. Redirecting to login.");
          }
          return response.json();
        })
        .then(data => {
          setPosts(data.data);
        })
        .catch(err => console.error("Error fetching favorite posts:", err));
      }
    }
    catch(error)
    {
      console.error('Error fetching posts:', error);
    }

  };

  const [undoID, setundoID] = useState<number[]>([]);

  useEffect(() => {
    console.log("Updated undoID:", undoID);
  }, [undoID]);


  const undoDeleteFavorite = async () => {
    console.log("Before:", undoID);

    // Bron voor het versturen van data naar de server met react.
    // https://www.youtube.com/watch?v=0WyHHioebvY

    fetch(`${API_BASE_URL}/posts/multiple_favorites/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_ids: undoID }),
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log("Result of posting favs:");
      console.log(data.data);
      refresh();
    })
    .catch(err => console.error("Error posting favorite posts:", err));
  };

  // https://react.dev/learn/updating-arrays-in-state
  const showUndoDeleteFavorite = (id: number) => {
    if (!undoID.includes(id)) {
    setundoID([...undoID, id]);
    }
    else {
      setundoID(
        undoID.filter(i => i !== id)
      );
    }
  };

  const refresh = () => {
    setundoID([]);
    setPosts([]);
    fetchPosts();
  };
  if (posts === undefined) {
    return (
        <View style={styles.innerContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf:'center' }}>Geen posts gevonden</Text>
          <Text>No favorite posts found.</Text>
        </View>

    )
  }
  return (

    <SafeAreaView style={{height:'100%'}}>

      { undoID.length > 0 ?
          <TouchableOpacity style={Platform.OS === "web" ? styles.undoButton : styles.undoButtonPhone} onPress={() => { undoDeleteFavorite() }}>
            <View style={{width:'5%'}}></View>
            <Text style={styles.buttontext}  >
              Maak ongedaan
            </Text>
            {/*https://stackoverflow.com/questions/58705857/how-to-rotate-font-awesome-icon-in-react-native*/}
            <Ionicons name={'reload'} size={32} color={'white'} style={{transform: [{scaleX: -1}]}}></Ionicons>
          </TouchableOpacity>
          : null }
      <ScrollView contentContainerStyle={{alignContent:"center"}} style={styles.container}>
        <View style={styles.innerContainer}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Jouw favorieten</Text>

        { posts.map((post, i) => (
            <TouchableWithoutFeedback key={i}>
              <View key={i} style={[styles.postContainer, Platform.OS === 'web'? {width: '50%'} : {width: '100%'}]}>
                <View style={{ flexDirection:'row'}}>
                  <Text style={{ fontSize: 15,fontWeight: 'bold' }}>Geplaatst door: </Text>
                  <TouchableOpacity onPress={() => router.push({ pathname: "/account/profile", params: { user_id: post['user_id']} })}>
                    <Text style={{ fontSize: 15,fontWeight: 'bold' }}>{post['user_name']? post['user_name']:'anonymous user'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.postTitle}>{post['title']}</Text>

                <Text>{post['content']}</Text>
                <View style={{flexDirection:'row'}}>
                  <RateButtons
                      post_id={post['id']}
                      total_rating={ post['total_rating']}
                      user_rating={post['rating']}
                      userId={userId}
                      loading={false}
                  />
                  <FavoriteButton user_id={userId} post_id = {post['id']} is_favorited = {post['is_favorite']}
                                  onPress={() => showUndoDeleteFavorite(post['id'])} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    // height: '100%',
    flex: 1,
    alignItems: 'center',
  },

  container: {
    padding: 20,
    height: '100%',
    flex: 1,
  },
  postContainer: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  undoButton: {
    position: 'absolute',
    top:10,
    right: 10,
    backgroundColor: 'green',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex:5,
    elevation: 5,
  },
  undoButtonPhone: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'green',
    width: '100%',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex:5,
    elevation: 5,
  },
  buttontext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});