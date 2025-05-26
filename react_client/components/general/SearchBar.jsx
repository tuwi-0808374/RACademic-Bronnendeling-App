import React, { useState } from 'react';
import { TextInput, View,StyleSheet } from 'react-native';

function SearchBar({ setVisible, selectedTags, API_BASE_URL, handleInsidePress }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState({});

    const fetchPosts = () => {
        const user_id = 1
        const selectedTagIds = Object.keys(selectedTags).filter((id) => selectedTags[id]);
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search_query', searchQuery);
        selectedTagIds.forEach((id) => queryParams.append('tag_id', id));
        console.log(queryParams.toString());
        fetch(`${API_BASE_URL}/posts/${user_id}?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data.data);
                console.log('Fetched posts:', data.data);
            })
            .catch(err => console.error('Error fetching posts:', err));
    };

    // const fetchPosts = () => {
    //     const selectedTagIds = Object.keys(selectedTags).filter((id) => selectedTags[id]);
    //     fetch()
    // }

    const handleOnKeyPress = event =>{
        const key = event.nativeEvent.key
        if(key ==="Enter"){
            fetchPosts();
            setVisible(false);
        }
    }
    return (
         <TextInput
            style={styles.searchInput}
            placeholder="Search tags"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onKeyPress={handleOnKeyPress}
            onFocus={() => setVisible(true)}
        />
    );
}

const styles = StyleSheet.create({
    searchInput: {
        backgroundColor: 'white',
        marginTop: '2%',
        width: '100%',
        height: '100%',
        padding: 5,
        borderRadius: 25
    }

});

export default SearchBar;
