import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import {useRouter} from "expo-router";

const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    backgroundDark: '#535353',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};


// bronnen
// https://www.youtube.com/watch?v=Z20nUdAUGmM

export default function UserPosts () {
    const [postdata, setPostdata] = useState([]);
    const user_id = 1
    const router = useRouter();


    useEffect(() => {
        fetch(`http://localhost:5000/posts/${user_id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPostdata(data.data);
            })
    }, []);


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Your posts</Text>
                    </View>


                <ScrollView style={styles.scrollview} >
                    <View style={styles.header}>
                        {postdata.map((post) => (
                            <View key={post['id']} style={styles.postbox} >
                                <Text style={styles.textTitle}>{post['title']}</Text>
                                <Text style={styles.textContent}>{post['content']}</Text>

                                <TouchableOpacity onPress={() => router.push({ pathname: "/posts/edit_post", params: { post_id: post['id']} })}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttontext}>edit post</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                </View>
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
        fontWeight: "semibold",
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
    },
    scrollview:{
        flex: 1
    }

})