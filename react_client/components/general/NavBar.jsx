// import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
// import { Link } from 'expo-router';

export default function NavBar(visible) {
    return(
        <View style={styles.navbarContent}>
            <View style={styles.searchBarContainer}>
                <SearchBar
                    setVisible={visible.setVisible}
                    selectedTags={visible.selectedTags}
                    API_BASE_URL={visible.API_BASE_URL}
                    handleInsidePress={visible.handleInsidePress}
                />
            </View>
        {/*    profile knop enzo */}
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        width:'100%',
        zIndex: 1,
        elevation:1,
    },
    searchBarContainer: {
        width: '40%',
        alignSelf: 'center',
    }

})