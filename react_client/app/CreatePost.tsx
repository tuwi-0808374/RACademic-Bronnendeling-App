import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};


//https://www.youtube.com/watch?v=7LNl2JlZKHA
// https://www.youtube.com/watch?v=lA_73_-n-V4
// https://www.youtube.com/watch?v=BJNOceFLdjQ
export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const CreatePost = async () => {
        console.warn(title, content);
        const url = "http://localhost:5000/posts"
        let result = await fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title:title,content:content})
        });
        result = await  result.json();
        if(result){
            console.warn("Bron is saved successfully.")
        }
    }



    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Post</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.input}>
                        <Text style={styles.inputlabel}>Titel</Text>
                        <TextInput
                            style={styles.inputcontroltitel}
                            placeholder="Titel van de bron"
                            placeholderTextColor={COLORS.placeholderText}
                            value={title}
                            onChangeText={(text)=> setTitle(text)}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputlabel}>Content van de bron</Text>
                        <TextInput
                            style={styles.inputcontrolcontent}
                            placeholder="print(Hello World)"
                            placeholderTextColor={COLORS.placeholderText}
                            value={content}
                            onChangeText={(text)=> setContent(text)}
                        />
                    </View>

                    <View style={styles.create}>
                        <TouchableOpacity onPress={CreatePost}>
                            <View style={styles.button}>
                                <Text style={styles.buttontext}>Create post</Text>
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
            paddingVertical: 10,
            paddingHorizontal: 20,
        },
        buttontext:{
            fontSize: 20,
            fontWeight: "bold",
            color: COLORS.textLight,
        }



    })














// const [data, setData] = useState([]);
// useEffect(() => {
//     fetch("http://localhost:5000/tags")
//         .then(res => res.json())
//         .then(data => {
//             setData(data.data);
//             console.log(data.data);
//         })
// }, []);
//
// return (
//     <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tags:</Text>
//         {data.map((tag, i) => (
//             <Text key={i}>
//                 {tag['title']}
//                 {'\n'}
//                 {tag['content']}
//                 {'\n'}
//             </Text>
//
//         ))}
//     </View>
// );

