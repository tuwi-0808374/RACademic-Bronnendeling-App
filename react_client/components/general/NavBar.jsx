// import React, { useState, useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import SearchBar from './SearchBar';
import {Ionicons} from "@expo/vector-icons";
// import { Link } from 'expo-router';

export default function NavBar(props) {
    return(
        <View style={styles.navbarContent}>

            <TouchableOpacity onPress={props.handleSideBarState}>
                <Ionicons name={'menu'} color={'#fff'}/>
            </TouchableOpacity>


            <SearchBar
                visible={props.visible}
                setVisible={props.setVisible}
                selectedTags={props.selectedTags}
                API_BASE_URL={props.API_BASE_URL}
                handleInsidePress={props.handleInsidePress}
            />

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
    }
})