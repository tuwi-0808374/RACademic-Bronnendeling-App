import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native';
import {CheckBox} from "@/components/input";
import {useLocalSearchParams, useRouter} from "expo-router";
import {getApiBaseUrl} from "@/constants/get_ip";
const API_BASE_URL = getApiBaseUrl();



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
    const { post_id } = useLocalSearchParams();
    const [tagData, setTagData] = useState([]);
    const [selected_tags, setSelectedTagId] = useState([]);
    const router = useRouter();
    const [lengthCounter, setLengthCounter] = useState(0)
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    // chatgpt heeft hier geholpen want ik kon nergens anders vinden hoe je tabs kan toevoegen in text inputs
    const addTab = () => {
        const start = selection.start;
        const end = selection.end;

        // Insert 4 spaces at the cursor position
        const newText = content.slice(0, start) + '    ' + content.slice(end);

        setContent(newText);

        // Move cursor to right after inserted spaces
        const newPos = start + 4;
        setSelection({ start: newPos, end: newPos });

    };
    useEffect(() => {
        fetch(`${API_BASE_URL}/tags_by_post_id/${post_id}`)
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
        const response = await fetch(`${API_BASE_URL}/post_by_post_id/${post_id}`);
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
        const url = `${API_BASE_URL}/edit_post/${post_id}`;
        let result = await fetch(url, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title:title,content:content,tag_ids:selected_tags}),
        });
        result = await  result.json();
        if(result){
            console.warn("Post is Edited successfully.")
            router.push('/posts/user_posts');
        }
    }

    const DeletePost = async () => {
        const url = `${API_BASE_URL}/delete_post/${post_id}`;
        let result = await fetch(url, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
        });
        result = await result.json();
        if(result){
            console.warn("Post is Deleted successfully.")
            router.push('/posts/user_posts');
        }
    }
    useEffect(() => {
        setLengthCounter(1000 - content.length)
    })
    const handleEditRequest = () => {
        if (lengthCounter >= 0) {
            EditPost();
        }
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
            <ScrollView>
                <View style={[styles.container, Platform.OS ==='web'? {width:'50%', alignSelf:'center'} : {width: '100%'}]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Post</Text>
                    </View>


                    <View style={styles.form}>
                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Titel</Text>
                                <TextInput
                                    maxLength={200}
                                    style={styles.inputControlTitel}
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={(text)=> setTitle(text)}
                                />
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Content</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <TouchableOpacity onPress={addTab} style={[styles.button,{backgroundColor:'green',width:'25%',marginBottom:10}]}>
                                        <Text style={{color:'white'}}> indent toevoegen </Text>
                                    </TouchableOpacity>
                                <View style={{flexDirection: 'row',alignItems:'center', padding: '1%'}}>
                                    <Text>maxCharacters: </Text>
                                    <Text style={lengthCounter >= 0 ? {color: 'black'}:{color:'red'}}>{lengthCounter}</Text>
                                </View>
                            </View>
                            <TextInput
                                multiline={true}
                                numberOfLines={15}
                                style={styles.inputControlContent}
                                placeholder="print(Hello World)"
                                placeholderTextColor={COLORS.placeholderText}
                                value={content}
                                onChangeText={(text)=> setContent(text)}
                                onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                                selection={selection}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Tab') {
                                        // @ts-ignore
                                        nativeEvent.preventDefault();
                                        addTab();
                                    }
                                }}
                            />

                        </View>


                        <View>
                            <Text style={styles.inputLabel}>Tags</Text>
                            <CheckBox
                                options={tagData}
                                CheckedValues={selected_tags || []}
                                onChange={setSelectedTagId}
                                />
                        </View>

                        <View style={styles.create}>
                            <TouchableOpacity onPress={handleEditRequest}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Save post</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.create}>
                            <TouchableOpacity onPress={DeletePost}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Delete post</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        height: '100%'
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
    inputLabel:{
        fontSize: 20,
        fontWeight: "semibold",
        color: COLORS.text,
        marginBottom: 5,
        textAlign: "center"
    },
    inputControlTitel:{
        fontSize: 15,
        fontWeight: "semibold",
        color: COLORS.text,
        height: 50,
        backgroundColor: COLORS.textLight,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 25,
    },
    inputControlContent:{
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
    buttonText:{
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textLight,
    },
    checkbox:{
        justifyContent: "center",
        marginBottom: 15
    }
})
