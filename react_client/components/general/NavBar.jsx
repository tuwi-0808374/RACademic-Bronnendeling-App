// import React, { useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import SearchBar from './SearchBar';
// import { Link } from 'expo-router';

export default function NavBar(visible) {
    return(
        <View style={styles.navbarContent}>
            <SearchBar visible={visible}/>
        {/*    profile knop en zo */}
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        width:'100%',
        zIndex: 1,
        elevation:1,
    }

})