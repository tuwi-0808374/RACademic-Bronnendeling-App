import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import {CheckBox} from "@/components/input";

const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};

// bronnen
// https://www.youtube.com/watch?v=37vxWr0WgQk


export default function editpost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const postid = 1
    const [tagData, setTagData] = useState([]);
    const [selected_tags, setSelectedTagId] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/tags_by_post_id/${postid}`)
            .then(res => res.json())
            .then(data => {
                setTagData(data.data.tags);
                setSelectedTagId(data.data.tag_ids);
            })
    }, []);

    useEffect(() => {
    }, [selected_tags]);

    useEffect(() => {
    const fetchPost = async () => {
    try{
        const response = await fetch(`http://localhost:5000/post_by_post_id/${postid}`);
        if(!response.ok){
            throw new Error('Failed to fetch posts.');
        }

        const data = await response.json();
        const postData = data.data
        setTitle(postData.title || '');
        setContent(postData.content || '');

    }
    catch(error){
        console.log(error);
    }}
    fetchPost();
    }, []);

    const EditPost = async () => {
        const url = `http://localhost:5000/edit_posts/${postid}`;
        let result = await fetch(url, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title:title,content:content,tag_ids:selected_tags}),
        });
        result = await  result.json();
        if(result){
            console.warn("Post is Edited successfully.")
        }
    }

    const DeletePost = async () => {
        const url = `http://localhost:5000/delete_post/${postid}`;
        let result = await fetch(url, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
        });
        result = await result.json();
        if(result){
            console.warn("Post is Deleted successfully.")
        }
    }



    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Edit Post</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.input}>
                        <Text style={styles.inputlabel}>Titel</Text>
                            <TextInput
                                style={styles.inputcontroltitel}
                                placeholderTextColor={COLORS.placeholderText}
                                value={title}
                                onChangeText={(text)=> setTitle(text)}
                            />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputlabel}>Content</Text>
                        <TextInput
                            style={styles.inputcontroltitel}
                            placeholderTextColor={COLORS.placeholderText}
                            value={content}
                            onChangeText={(text)=> setContent(text)}
                        />
                    </View>


                    <View style={styles.input}>
                        <Text style={styles.inputlabel}>Tags</Text>
                        <CheckBox
                            options={tagData}
                            CheckedValues={selected_tags}
                            onChange={setSelectedTagId}
                            />
                    </View>

                    <View style={styles.create}>
                        <TouchableOpacity onPress={EditPost}>
                            <View style={styles.button}>
                                <Text style={styles.buttontext}>Save post</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.create}>
                        <TouchableOpacity onPress={DeletePost}>
                            <View style={styles.button}>
                                <Text style={styles.buttontext}>Delete post</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

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
    }
})
