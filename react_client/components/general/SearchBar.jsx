import React, { useState, useEffect } from 'react';
import CheckBox from 'expo-checkbox';
import { TextInput, View, TouchableOpacity,Pressable ,StyleSheet, Text } from 'react-native';
import { getApiBaseUrl } from '../../constants/get_ip';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = getApiBaseUrl();

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState({});
    const [visible, setVisible] = useState(false);
    const fetchPosts = () => {
        const selectedTagIds = Object.keys(selectedTags).filter((id) => selectedTags[id]);
        const queryParams = new URLSearchParams();
        queryParams.append('user_id', 1);
        if (searchQuery) queryParams.append('search_query', searchQuery);
        selectedTagIds.forEach((id) => queryParams.append('tag_id', id));

        fetch(`${API_BASE_URL}/posts?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data.data);
                console.log('Fetched posts:', data.data);
            })
            .catch(err => console.error('Error fetching posts:', err));
    };

    const handleInsidePress = () => {
        console.log('inside press')
        setVisible(true);
    }
    const handleClose = () => {
        console.log('te')
        setVisible(false);
    }
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
                onFocus={handleInsidePress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
    },
    searchInput: {
        backgroundColor: 'white',
        marginTop: '2%',
        width: '40%',
        height: '25%',
        padding: 5,
        borderRadius: 25
    }

});

export default SearchBar;
