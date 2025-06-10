import {Platform, View, SafeAreaView, ScrollView, StyleSheet} from "react-native";
import { Stack, useRouter } from 'expo-router';

import TagBar from "@/components/general/TagBar";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import Posts from "./posts";

export default function HomePage() {
    const local = useLocalSearchParams();
    return (
        <SafeAreaView style={{height: '100%'}}>

            <View style={[Platform.OS === 'web'? {width: '49%'} : {width: '100%'},{alignSelf: 'center'} ]}>

            </View>
            <ScrollView style={styles.container}>
                <View style={[Platform.OS === 'web'? {width: '49%'} : {width: '100%'},{alignSelf: 'center'} ]}>
                    {!local.tag_ids || local.tag_ids === 'undefined' ?
                    <View style={[Platform.OS === 'web' ? {width: '49%'} : {width: '100%'}, {alignSelf: 'center'}]}>
                        <TagBar/>
                    </View>
                    : null }
                </View>
                <Posts />
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'off-white',
    }
})