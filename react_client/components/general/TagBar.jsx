import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native';
import React, { useState, useEffect } from "react";
import {useRouter} from 'expo-router';
import { getApiBaseUrl } from "@/constants/get_ip";

const API_BASE_URL = getApiBaseUrl();

export default function TagBar({searchQuery}) {
    const[tags, setTags] = useState([])
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/tags`)
        .then(res => res.json())
        .then(data => {
            setTags(data.data);
        })
    }, []);

    const fetchPosts = (tagId) => {
        router.push({
            pathname: '/posts',
            params: {
                search_query: searchQuery,
                tag_ids: tagId,
            },
        });
    };
    return (
        <View >
        <ScrollView horizontal={true}>
            <View style={[styles.contentContainer,{width:'100%',paddingHorizontal:10}]}>
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
        </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    contentContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        gap: 8,
        backgroundColor:'#dfdfdf',
    },
    tagContainer: {
        minWidth: 90,
        height: 30,
        borderRadius: 25,
        paddingHorizontal: 5,
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