import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from "react";
import {useRouter} from 'expo-router';
import { getApiBaseUrl } from "@/constants/get_ip";

const API_BASE_URL = getApiBaseUrl();

export default function Index() {
    const[tags, setTags] = useState([])
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/tags`)
        .then(res => res.json())
        .then(data => {
            setTags(data.data);
        })
    }, []);

    const fetchPosts = (tagId:number) => {
        router.push({
            pathname: '/posts',
            params: {
                tag_ids: tagId,
            },
        });
    };
    return (
        <View style={styles.contentContainer}>
            {tags.map((tag, i) => (
                <TouchableOpacity
                    key={i}
                    style={[styles.tagContainer,
                        { backgroundColor: tag['color'] }]}
                    onPress={() => fetchPosts(tag['id'])}
                >
                    <Text style={styles.textStyle}>{tag['title']}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    contentContainer: {
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagContainer: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 4,
    }
});