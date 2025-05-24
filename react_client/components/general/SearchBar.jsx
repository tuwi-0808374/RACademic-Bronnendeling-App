import React, { useState } from 'react';
import { TextInput, View,StyleSheet } from 'react-native';
import { getApiBaseUrl } from '../../constants/get_ip';

const API_BASE_URL = getApiBaseUrl();

function SearchBar({ setVisible, selectedTags }) {
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
        <View style={styles.container}>
             <TextInput
                style={styles.searchInput}
                placeholder="Search tags"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onKeyPress={handleOnKeyPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
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
