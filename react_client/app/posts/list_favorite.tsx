import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'expo-router';
import {getApiBaseUrl} from "@/constants/get_ip";
const API_BASE_URL = getApiBaseUrl();

export default function Test() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [user_id, setUserId] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // https://medium.com/better-programming/how-to-authentication-users-with-token-in-a-react-application-f99997c2ee9d
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('Geen token gevonden.');
        return;
      }

      const decoded_user: any = jwt_decode(token);
      setUserId(decoded_user.user_id);
      fetch(`${API_BASE_URL}/posts/favorite/${decoded_user.user_id}`)
      .then((response) => {
        if (response.status === 401) {
          console.log("Unauthorized access. Redirecting to login.");
        } 
        return response.json();
      })
      .then(data => {
        setPosts(data.data);
        console.log("Fetched data:");
        console.log(data.data);
      })
      .catch(err => console.error("Error fetching favorite posts:", err));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // https://stackoverflow.com/questions/62917259/how-to-pass-an-array-of-numbers-with-typescript-and-react
  // https://www.dhiwise.com/post/react-usestate-append-to-array-a-simple-guide
  const [undoID, setundoID] = useState<number[]>([]); 

  useEffect(() => {
    console.log("Updated undoID:", undoID);
  }, [undoID]);


  const undoDeleteFavorite = async () => {
    console.log("Before:", undoID);

    // Bron voor het versturen van data naar de server met react.
    // https://www.youtube.com/watch?v=0WyHHioebvY
    
    fetch(`http://127.0.0.1:5000/posts/multiple_favorites/${user_id}`,
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

  return (
    <View style={{ padding: 20 }}>
      { undoID.length > 0 ? 
      <>
      <View style={styles.button_green}>
        <Text style={styles.buttontext} onPress={() => { undoDeleteFavorite() }} >
          Maak ongedaan
        </Text>
      </View>
      </>
       : null }
      
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Edit fav list:</Text>
      {posts === undefined ? (
        <Text>No favorite posts found.</Text>
      ) : posts.map((post, i) => (
        <Text key={i}>
          {'\n'}
          Title: {post['title']}
          {'\n'}
          Content: {post['content']}
          {'\n'}
          Fav: {post['is_favorite']}
          {'\n'}
          <FavoriteButton user_id={user_id} post_id = {post['id']} is_favorited = {post['is_favorite']} onPress={() => showUndoDeleteFavorite(post['id'])} />
          <hr></hr>
        </Text>  
        
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button_red: {
    backgroundColor: '#C80032',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button_green: {
    backgroundColor: 'green',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttontext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});