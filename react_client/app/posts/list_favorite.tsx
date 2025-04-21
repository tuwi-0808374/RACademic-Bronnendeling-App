import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import FavoriteButton from '../../components/posts/FavoriteButton';

export default function Test() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch("http://127.0.0.1:5000/posts/favorite")
      .then(res => res.json())
      .then(data => {
        setPosts(data.data);
        console.log("Fetching:");
        console.log(data.data);
      })
      .catch(err => console.error("Error fetching favorite posts:", err));
  }

  // https://stackoverflow.com/questions/62917259/how-to-pass-an-array-of-numbers-with-typescript-and-react
  // https://www.dhiwise.com/post/react-usestate-append-to-array-a-simple-guide
  const [undoID, setundoID] = useState<number[]>([]); 

  const undoDeleteFavorite = async () => {
    while (undoID.length > 0) {
      const id = undoID.pop();    
      try {
        //http://localhost:5000/posts/${post_id}/favorite
        var url = "http://localhost:5000/posts/"+id+"/favorite";
        const response = await fetch(url, {
          method: 'POST',
        });
        const result = await response.json();

      } catch (error) {
        console.error('API request failed:', error);
      }
    }
    refresh();
  };

  // https://react.dev/learn/updating-arrays-in-state
  const showUndoDeleteFavorite = (id: number) => {
    console.log("before:", undoID);
    if (!undoID.includes(id)) {
    setundoID([...undoID, id]);
    }
    else {
      setundoID(
        undoID.filter(i => i !== id)
      );
    }
    console.log("after:", undoID);
    
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
      
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Posts:</Text>
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
          <FavoriteButton id = {post['id']} is_favorited = {post['is_favorite']} onPress={() => showUndoDeleteFavorite(post['id'])} />
          <hr></hr>
        </Text>  
        
        ))}
    </View>
  );
}