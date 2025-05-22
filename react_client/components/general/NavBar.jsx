// import React, { useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import SearchBar from './SearchBar';
// import { Link } from 'expo-router';

export default function NavBar() {
    return(
        <View style={styles.navbarContent}>
            <SearchBar />
        {/*    profile knop en zo */}
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
    }

})