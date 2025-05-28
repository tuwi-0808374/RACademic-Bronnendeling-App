import { StyleSheet, Text, TouchableOpacity ,View} from "react-native";
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
        <View style={styles.containerPostTags}>
            {postTags.map((tag) => (
                <TouchableOpacity
                    key={tag.id}
                    onPress={() => toggleTag(tag.id)}
                    style={[
                        styles.tag,
                        selectedTags[tag.id] ? styles.tagSelected : null,
                    ]}
                >
                    <Text
                        style={
                            selectedTags[tag.id]
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
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        top: 60,
        width: "85%",
        padding: 5,
        borderRadius: 25,
        elevation: 5,
        backgroundColor: "white",
    },
    tag: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 8,
        borderRadius: 10,
        marginVertical: 3,
        width: "25%",
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
