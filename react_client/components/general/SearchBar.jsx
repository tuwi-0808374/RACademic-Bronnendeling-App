import React, { useState, useEffect } from 'react';
import CheckBox from 'expo-checkbox';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { getApiBaseUrl } from '../../constants/get_ip';

const API_BASE_URL = getApiBaseUrl();

function SearchBar() {

    const [data, setData] = useState([]);
    const [checkedTags, setCheckedTags] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/tags')
            .then(res => res.json())
            .then(data => {
                setData(data.data);
                console.log('Fetched tags:', data.data);
            })
            .catch(err => console.error('Error fetching tags:', err));
    }, []);

    // ik heb deze bronnen gebruikt om de checkboxes te maken
    // https://stackoverflow.com/questions/65205428/handle-multiple-checkboxes-in-expo-react-native
    // https://docs.expo.dev/versions/latest/sdk/checkbox/
    const handleCheckboxChange = (id) => {
        setCheckedTags((prev_checkbox) => ({
            ...prev_checkbox,
            [id]: !prev_checkbox[id],
        }));
    };

    const fetchPosts = () => {
        const selectedTagIds = Object.keys(checkedTags).filter((id) => checkedTags[id]);
        const queryParams = new URLSearchParams();
        queryParams.append('user_id', 1);
        if (searchQuery) queryParams.append('search_query', searchQuery);
        selectedTagIds.forEach((id) => queryParams.append('tag_id', id));

        fetch(`${API_BASE_URL}/posts?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
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
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search tags"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onKeyPress={handleOnKeyPress}
            />

            <View style={styles.checkBoxContainer}>
                {data.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.section}
                        onPress={() => handleCheckboxChange(item.id)}
                    >
                        <View style={styles.checkBoxWrapper}>
                            <CheckBox
                                style={styles.checkbox}
                                value={checkedTags[item.id] || false}
                            />
                            <Text style={styles.paragraph}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 20,
        backgroundColor: '#f5f5f5',
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
    checkBoxContainer: {
        flex: 1,
        marginTop: 10,
    },
    checkBoxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    paragraph: {
        fontSize: 16,
    },
});

export default SearchBar;
