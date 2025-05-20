import React, { useState, useEffect } from 'react';
import CheckBox from 'expo-checkbox';
import { TextInput, View, TouchableOpacity,TouchableWithoutFeedback, StyleSheet,Button ,Text } from 'react-native';

function SearchBar() {
    const [postTags, setPostTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [posts, setPosts] = useState({});
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/tags')
            .then(res => res.json())
            .then(data => {
                console.log('Fetched data:', data);
                setPostTags(data.data);
            })
            .catch(err => console.error('Error fetching tags:', err));
    }, []);

    // ik heb deze bronnen gebruikt om de checkboxes te maken
    // https://stackoverflow.com/questions/65205428/handle-multiple-checkboxes-in-expo-react-native
    // https://docs.expo.dev/versions/latest/sdk/checkbox/
    const toggleTag = (id) => {
        setSelectedTags((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const fetchPosts = () => {
        const selectedTagIds = Object.keys(selectedTags).filter((id) => selectedTag[id]);
        const queryParams = new URLSearchParams();
        queryParams.append('user_id', 1);
        if (searchQuery) queryParams.append('search_query', searchQuery);
        selectedTagIds.forEach((id) => queryParams.append('tag_id', id));

        fetch(`http://localhost:5000/posts?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data.data);
                console.log('Fetched posts:', data.data);
            })
            .catch(err => console.error('Error fetching posts:', err));
    };
    const handleOnKeyPress = event =>{
        const key = event.nativeEvent.key
        if(key ==="Enter"){
            fetchPosts();
        }
    }
    const focusSearch = (value) => {
        if (value === true) {
            setVisible(true);
            console.log('focusss')
        } else {
            setVisible(false);
            console.log('unfocusss')
        }

    }
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onFocus={() => focusSearch(true)}
                onBlur={() => focusSearch(false)}
            >
                <View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search tags"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onKeyPress={handleOnKeyPress}
                        onFocus={() => focusSearch(true)}
                    />
                    { visible && (

                        <View style={styles.containerPostTags}>
                            <Text>hi</Text>
                            {postTags.map((tag) => (
                                <TouchableOpacity
                                    key={tag.id}
                                    onPress={() => toggleTag(tag.id)}
                                    style={[styles.tag, selectedTags[tag.id] ? styles.tagSelected : null,]}>
                                    <Text style={selectedTags[tag.id] ? styles.tagTextSelected : styles.tagText}>
                                        {tag.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    containerPostTags: {

    }
});

export default SearchBar;
