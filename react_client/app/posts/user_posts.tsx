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


export default function UserPosts () {

    useEffect(() => {
        fetch(`http://localhost:5000/posts_by_user_id/${user_id}`);
    }, []);
}