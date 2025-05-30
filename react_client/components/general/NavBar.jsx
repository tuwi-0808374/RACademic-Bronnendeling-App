// import React, { useState, useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import SearchBar from './SearchBar';
import {Ionicons} from "@expo/vector-icons";
// import { Link } from 'expo-router';

export default function NavBar(props) {
    return(
        <View style={styles.navbarContent}>

            <TouchableOpacity onPress={props.handleSideBarState}>
                <Ionicons name={'menu'} color={'#fff'} size={30} style={styles.icon}/>
            </TouchableOpacity>


            <SearchBar
                visible={props.visible}
                setVisible={props.setVisible}
                selectedTags={props.selectedTags}
                API_BASE_URL={props.API_BASE_URL}
                handleInsidePress={props.handleInsidePress}
            />
            <View style={styles.spacer}/>
        {/*    profile knop enzo */}
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        justifyItems: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flex:1,
        width:'100%',
        zIndex: 1,
        elevation:1,
    },
    icon: {
        margin: 15,
    },
    spacer: {
        width: 40,
    }
})