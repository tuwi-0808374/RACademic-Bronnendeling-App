// import React, { useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import SearchBar from './SearchBar';
// import { Link } from 'expo-router';

export default function NavBar(props) {
    return(
        <View style={styles.containerNavbar}>
            <SearchBar visible={ props.visible } setVisible={ props.setVisible } />
        {/*    profile knop en zo */}
        </View>
    );
}

const styles = StyleSheet.create({
    containerNavbar: {
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        width: '100%',
        backgroundColor: 'black',
        height: '6vh',
    }

})