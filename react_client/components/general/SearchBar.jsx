import React, { useState } from 'react';
import {TextInput, StyleSheet, View, Keyboard} from 'react-native';
import { router } from 'expo-router'
import {Ionicons} from '@expo/vector-icons';

function SearchBar({ visible, setVisible, selectedTags, API_BASE_URL }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState({});

    const fetchPosts = () => {
        router.push({
            pathname: '/posts',
            params: {
                search_query: searchQuery,
                tag_ids: Object.keys(selectedTags).filter(key => selectedTags[key] === true).join(","),
            },
        });
    };


    const handleOnKeyPress = event =>{
        const key = event.nativeEvent.key
        if(key ==="Enter"){
            fetchPosts();
            setVisible(false);
            Keyboard.dismiss();
        }
    }

    const pressSearch = event =>{
        fetchPosts();
        setVisible(false);
        Keyboard.dismiss();
    }

    return (
        <View style={styles.searchBarContainer}>
             <TextInput
                style={styles.searchInput}
                placeholder="Zoeken..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onKeyPress={handleOnKeyPress}
                onFocus={() => setVisible(true)}
            />
            <Ionicons
                style={styles.icon}
                name={(visible === true) ? 'arrow-forward' : 'search'}
                color='black'
                size={20}
                onPress={pressSearch}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        width: '40%',
        height: '80%',
        padding: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 25
    },
    searchInput: {
        flex: 1,
        width: '100%',
        marginStart: 10,
        outlineStyle: 'none',
    },
    icon: {
        alignSelf: 'center',
        paddingRight: 5,
    }

});

export default SearchBar;
