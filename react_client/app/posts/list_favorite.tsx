import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export default function Test() {
  const [posts, setPosts] = useState([]);

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

      fetch(`http://127.0.0.1:5000/posts/favorite/${decoded_user.user_id}`)
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
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.log('Geen token gevonden.');
      return;
    }

    const decoded_user: any = jwt_decode(token);

    // Bron voor het versturen van data naar de server met react.
    // https://www.youtube.com/watch?v=0WyHHioebvY
    
    fetch(`http://127.0.0.1:5000/posts/multiple_favorites/${decoded_user.user_id}`,
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
      <Button color='green' title="Opslaan" onPress={refresh} ></Button>
      <Button title="Maak ongedaan" onPress={undoDeleteFavorite} ></Button>
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
          <FavoriteButton post_id = {post['id']} is_favorited = {post['is_favorite']} onPress={() => showUndoDeleteFavorite(post['id'])} />
          <hr></hr>
        </Text>  
        
        ))}
    </View>
  );
}