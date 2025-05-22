import {Pressable, StyleSheet, Text, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
function TagContainer(visible) {
    if (!visible) return null;
    const [postTags, setPostTags] = useState({});
    const [visible, setVisible] = useState(visible);
    const [selectedTag, setSelectedTag] = useState({});
    const [selectedTags, setSelectedTags] = useState({});

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
        console.log('button works')
        setSelectedTags((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        console.log(selectedTags);
    };

    const handleInsidePress = () => {
        console.log('inside press')
        setVisible(true);
    }
    const handleClose = () => {
        console.log('te')
        setVisible(false);
    }

    return(
        <Pressable style={styles.containerPostTags} >
            <TouchableOpacity style={styles.backButton} onPress={handleClose}>
                <Ionicons
                    name={'chevron-back-outline'}
                    size={24}
                    color={'#000000'}
                />
            </TouchableOpacity>
            {postTags.map((tag) => (
                <TouchableOpacity
                    key={tag.id}
                    onPress={() => {
                        toggleTag(tag.id);
                    }}
                    style={[styles.tag, selectedTags[tag.id] ? styles.tagSelected : null,]}>
                    <Text style={selectedTags[tag.id] ? styles.tagTextSelected : styles.tagText}>
                        {tag.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </Pressable>

    )
}

const styles = StyleSheet.create({
    containerPostTags: {
        position: 'absolute',
        top: 100,
        backgroundColor: 'white',
        width: '35%',
        padding: 5,
        borderRadius: 25,
        zIndex: 999,
        elevation: 5,
    },
    tag: {
        backgroundColor: 'white',
    },
    tagSelected: {
        backgroundColor: 'orange',
    },
    backButton: {

    }

});
export default TagContainer;