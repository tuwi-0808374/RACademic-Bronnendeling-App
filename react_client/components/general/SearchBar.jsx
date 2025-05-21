import React, { useState, useEffect } from 'react';
import CheckBox from 'expo-checkbox';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { getApiBaseUrl } from '../../constants/get_ip';

const API_BASE_URL = getApiBaseUrl();

function SearchBar() {
    const [postTags, setPostTags] = useState({});
    const [data, setData] = useState([]);
    const [checkedTags, setCheckedTags] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState({});
    const [posts, setPosts] = useState({});


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
    const handleOnKeyPress = event =>{
        const key = event.nativeEvent.key
        if(key ==="Enter"){
            fetchPosts();
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
            { visible && (
                <Pressable style={styles.containerPostTags} >
                    {postTags.map((tag) => (
                        <TouchableOpacity
                            key={tag.id}
                            onPress={(event) => {
                                toggleTag(tag.id);
                                event.stopPropagation();
                            }}
                            style={[styles.tag, selectedTags[tag.id] ? styles.tagSelected : null,]}>
                            <Text style={selectedTags[tag.id] ? styles.tagTextSelected : styles.tagText}>
                                {tag.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '50vw',
        alignItems: 'center',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#ccc',
        borderRadius: 12,
        margin: 4,
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
        backgroundColor: '#fff',
    }
});

export default SearchBar;
