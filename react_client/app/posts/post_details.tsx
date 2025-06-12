import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Platform } from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import Markdown, {MarkdownIt} from 'react-native-markdown-display';
import {getApiBaseUrl} from "@/constants/get_ip";
const API_BASE_URL = getApiBaseUrl();

const COLORS = {
    red: '#C80032',
    background: '#efede7',
    backgroundDark: '#535353',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};

export default function post_details() {
    const [postData, setPostData] = useState();
    const [comment, setComment] = useState([]);
    const [tagData, setTagData] = useState([]);
    const { post_id } = useLocalSearchParams();

    useEffect(() => {
        fetch(`${API_BASE_URL}/post_by_post_id/${post_id}`)
            .then(res => res.json())
            .then(data => {
                setPostData(data.data);
                setComment(data.data.comments);
            })
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tags_by_post_id/${post_id}`)
            .then(res => res.json())
            .then(data => {
                setTagData(data.data);
            })
    }, []);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
            <ScrollView style={styles.scrollview} >
                <TouchableWithoutFeedback>

            <View style={[styles.container, Platform.OS === "web"? {width:'75%', alignSelf:'center'}:{width:'100%'}]}>
                {postData && (
                    <View style={styles.postbox}>
                        <Text style={styles.textTitle}>{postData['title']}</Text>
                        <View style={{width:'100%', flexDirection: 'row'}}>
                            {tagData.tags
                            ?.filter(tag => tagData.tag_ids.includes(tag.id))
                            .map(tag => (
                                <View key={tag.id} style={[styles.tagContainer, { backgroundColor: tag['color'] }]}>
                                    <Text style={styles.textStyle}>{tag.title}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.contentContainer}>
                            {/*https://www.npmjs.com/package/react-native-markdown-display*/}
                            <Markdown
                                markdownit={
                                    MarkdownIt({typographer: true}).disable([ 'image' ])
                                }
                            >
                                {postData['content']}
                            </Markdown>
                        </View>
                    </View>
                )}


                {/*<Text style={styles.title}>Comments</Text>*/}
                {/*<View style={styles.header}>*/}
                {/*    {comment.map((comments) => (*/}
                {/*        <View key={comments['id']} style={styles.postboxcomments} >*/}
                {/*            <Text style={styles.textTitle}>{comments['title']}</Text>*/}
                {/*            <Text style={styles.textContent}>{comments['content']}</Text>*/}


                {/*        </View>*/}
                {/*    ))}*/}
                {/*</View>*/}


            </View>
            </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        flex: 1,
    },
    header: {
        marginVertical: 36,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 1,
        textAlign: "center",
    },
    textTitle:{
        fontSize: 30,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 1,

    },
    textContent:{
        fontSize: 22,
        fontWeight: "semibold",
        color: COLORS.text,
        marginBottom: 1,

    },
    form:{},
    input:{},
    inputlabel:{
        fontSize: 20,
        fontWeight: "semibold",
        color: COLORS.text,
        marginBottom: 5,
        textAlign: "center"
    },
    inputcontroltitel:{
        fontSize: 15,
        fontWeight: "semibold",
        color: COLORS.text,
        height: 50,
        backgroundColor: COLORS.textLight,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 25,
    },
    inputcontrolcontent:{
        fontSize: 15,
        fontWeight: "semibold",
        color: COLORS.text,
        height: 150,
        backgroundColor: COLORS.textLight,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 25,
    },
    create:{},
    button:{
        backgroundColor: COLORS.red,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.text,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttontext:{
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textLight,
    },
    postbox: {
        width: "100%",
        marginHorizontal: 1,
        marginBottom: 10,
        backgroundColor: COLORS.textLight,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'column',
        justifyContent: "center",
    },
    scrollview:{
        flex: 1
    },
    postboxcomments: {
        width: "100%",
        marginHorizontal: 1,
        marginBottom: 10,
        backgroundColor: COLORS.textLight,
        padding: 25,
        borderRadius: 15,
        flexDirection: 'column',
    },
    contentContainer: {
        marginTop: 5,
        alignItems: "center",
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginHorizontal: 20,
        padding: 20,
    },
    tagContainer: {
        minWidth: 90,
        height: 30,
        borderRadius: 25,
        paddingHorizontal: 5,
        marginTop: 5,
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
})