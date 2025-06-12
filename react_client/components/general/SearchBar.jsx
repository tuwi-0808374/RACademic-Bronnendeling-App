import React, { useState } from 'react';
import {TextInput, StyleSheet, View, Keyboard, Platform} from 'react-native';
import { router } from 'expo-router'
import {Ionicons} from '@expo/vector-icons';

function SearchBar({ visible, setVisible, selectedTags }) {
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPosts = () => {
        router.push({
            pathname: '/posts',
            params: {
                search_query: searchQuery,
                tag_ids: Object.keys(selectedTags).filter(key => selectedTags[key] === true).join(","),
            },
        });
    };


    const handleSubmit = () =>{
        fetchPosts();
        setVisible(false);
        Keyboard.dismiss();
    }

    const pressSearch = () =>{
        fetchPosts();
        setVisible(false);
        Keyboard.dismiss();
    }

    return (
        <View style={Platform.OS === 'web' ?  (styles.searchBarContainer) : (styles.searchBarContainerPhone)}>
             <TextInput
                style={styles.searchInput}
                placeholder="Zoeken..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSubmit}
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
        height: '70%',
        padding: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 25
    },
    searchBarContainerPhone: {
        width: '50%',
        height: '70%',
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
