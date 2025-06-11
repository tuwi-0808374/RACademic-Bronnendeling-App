import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from '@/constants/get_ip';
const API_BASE_URL = getApiBaseUrl();

function TagContainer({ visible,selectedTags, setSelectedTags }) {
    const [postTags, setPostTags] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tags`) // Replace with device IP if testing on phone
            .then((res) => res.json())
            .then((data) => {
                setPostTags(data.data || []); // Make sure it's an array
            })
            .catch((err) => console.error("Error fetching tags:", err));
    }, []);

    const toggleTag = (id) => {
        setSelectedTags((prev) => ({
            ...prev, [id] : !prev[id],
        }));
    };

    if (!visible) return null;

    return (
        <View style={[styles.containerPostTags, Platform.OS === 'web' ? {width: "60%"} : {width: "95%"}]}>
            {postTags.map((tag) => (
                <TouchableOpacity
                    key={tag.id}
                    onPress={() => toggleTag(tag['id'])}
                    style={[
                        styles.tag,
                        Platform.OS === 'web' ? {minWidth: "15%"} : {minWidth: "20%",},
                        selectedTags[tag['id']] ? styles.tagSelected : {backgroundColor: tag['color']},
                    ]}
                >
                    <Text
                        style={
                            selectedTags[tag['id']]
                                ? styles.tagTextSelected
                                : styles.tagText
                        }
                    >
                        {tag.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    containerPostTags: {
        position: "absolute",
        borderWidth: 1,
        borderColor:'grey',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        top: 75,

        padding: 5,
        borderRadius: 25,
        elevation: 999,
        backgroundColor: "white",
    },
    tag: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 8,
        borderRadius: 25,
        marginVertical: 3,
        marginHorizontal: 3,

    },
    tagSelected: {
        backgroundColor: "orange",
    },
    tagText: {
        color: "black",
    },
    tagTextSelected: {
        color: "white",
        fontWeight: "bold",
    },
});

export default TagContainer;
