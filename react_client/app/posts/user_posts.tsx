import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import {CheckBox} from "@/components/input";

const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    backgroundDark: '#535353',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};




export default function UserPosts () {
    const [postdata, setPostdata] = useState([]);
    const user_id = 1


    useEffect(() => {
        fetch(`http://localhost:5000/posts_by_user_id/${user_id}`)
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
                        <Text style={styles.title}>Youre post</Text>
                    </View>




                    <View style={styles.postbox}>
                        {postdata.map((post) => (
                            <View key={post.id}>
                                <Text style={styles.title}>{post.title}</Text>
                                <Text style={styles.title}>{post.content}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.postbox}>
                        <Text style={styles.title}>{postdata.title}</Text>

                    </View>


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
        fontSize: 30,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 1,
        textAlign: "center",
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
    checkbox:{
        justifyContent: "center",
        marginBottom: 15
    },
    postbox:{
        marginTop: 40,
        marginBottom: 40,
        width: 500,
        flex: 1,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.text,
        backgroundColor: COLORS.backgroundDark,
    }
})