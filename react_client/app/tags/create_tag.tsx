import React, { useState, useEffect } from "react";
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import ColorPicker from "react-native-wheel-color-picker";
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
    const [color, setColor] = useState('');
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");




    //
    const Createtag = async () => {
        if (title && color) {
            try {
                console.warn(title, color);
                const url = `${API_BASE_URL}/tag`
                let result = await fetch(url, {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({title: title, color: color}),
                });
                result = await result.json();
                if (result) {
                    console.warn("tag is saved successfully.")
                    router.push('/posts')
                }

            } catch (error) {
                console.error('API request failed:', error);

            }
        }
        if (!title || !color) {
            setErrorMessage("Vul beide velden in!");
            console.log("Please fill in both fields.");
            return;
        }
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nieuwe tag</Text>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.form}>
                        <View style={styles.input}>
                            <Text style={styles.inputlabel}>Naam van de tag</Text>
                            <TextInput
                                maxLength={200}
                                style={styles.inputcontroltitel}
                                placeholder="Naam van de tag"
                                placeholderTextColor={COLORS.placeholderText}
                                value={title}
                                onChangeText={(text)=> setTitle(text)}
                            />
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputlabel}>De kleur van de tag</Text>
                            <ColorPicker
                            onColorChange={(color) => setColor(color)}
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
                            <TouchableOpacity onPress={Createtag}>
                                <View style={styles.button}>
                                    <Text style={styles.buttontext}>Create tag</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

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
