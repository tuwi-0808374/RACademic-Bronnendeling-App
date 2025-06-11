import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Platform
} from 'react-native';
import { CheckBox } from "@/components/input";
import {useRouter} from "expo-router";
import { useUser } from '@/constants/get_user_id';
import {getApiBaseUrl} from "@/constants/get_ip";
import {Ionicons} from "@expo/vector-icons";
const API_BASE_URL = getApiBaseUrl();

const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
    error: "#D32F2F",
};

// Bronnen
// https://www.youtube.com/watch?v=7LNl2JlZKHA
// https://www.youtube.com/watch?v=lA_73_-n-V4
// https://www.youtube.com/watch?v=BJNOceFLdjQ
// https://docs.expo.dev/versions/latest/sdk/checkbox/
// https://www.youtube.com/watch?v=C-PVg6HhMNk

export default function Create_post() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagid, setTagid] = useState([]);
    const [data, setData] = useState([]);
    const router = useRouter();
    const { userId, loading } = useUser();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/tags`)
            .then(res => res.json())
            .then(data => {
                setData(data.data);
                console.log(data.data);
            })
    }, []);

    //
    const CreatePost = async () => {
        if (!loading && userId && title && content && tagid) {
            console.log(tagid)
            try {
                console.warn(title, content, tagid);
                const url = `${API_BASE_URL}/posts`
                let result = await fetch(url, {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({title: title, content: content, tag_ids: tagid, user_id: userId}),
                });
                result = await result.json();
                if (result) {
                    console.warn("Bron is saved successfully.")
                    router.push('/posts/user_posts')
                }

            } catch (error) {
                console.error('API request failed:', error);
            }
        }
        if (!title || !content || !tagid) {
            setErrorMessage("Vul beide velden in!");
            console.log("Please fill in both fields.");
            console.log(tagid)
            return;
        }
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
            <ScrollView style={styles.scrollView}>
                <TouchableWithoutFeedback>
                    <View style={[styles.container, Platform.OS ==='web'? {width:'50%', alignSelf:'center'} : {width: '100%'}]}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Post</Text>
                        </View>
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputlabel}>Titel</Text>
                                    <TextInput
                                        maxLength={200}
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
                                        multiline={true}
                                        maxLength={1000}
                                        style={styles.inputcontrolcontent}
                                        placeholder="print(Hello World)"
                                        placeholderTextColor={COLORS.placeholderText}
                                        value={content}
                                        onChangeText={(text)=> setContent(text)}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputlabel}>Tags</Text>
                                    <CheckBox
                                        options={data}
                                        CheckedValues={tagid}
                                        onChange={setTagid}
                                        />
                            </View>

                            {errorMessage && (
                                <View style={styles.errorContainer}>
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={16}
                                        color={COLORS.error}
                                    />
                                    <Text style={styles.errorText}>{errorMessage}</Text>
                                </View>
                            )}

                            <View style={styles.create}>
                                <TouchableOpacity onPress={CreatePost}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttontext}>Create post</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
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
    },
    checkbox:{
        justifyContent: "center",
        marginBottom: 15
    },
    scrollView:{
    },
    errorContainer: {
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        marginTop: -20,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.error,
        marginLeft: 5,
        fontSize: 14,
    },
})
