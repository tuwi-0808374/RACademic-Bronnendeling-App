import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React, { useContext } from "react";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { UserStatusContext } from "@/app/_layout";
import { useFonts } from 'expo-font';
import Animated, { SlideInLeft,SlideOutLeft } from 'react-native-reanimated';

function SideBar({ sideBarState, setSideBarState }) {
    const router = useRouter();
    const setUserLoggedIn = useContext(UserStatusContext);

    const exitLogout = async () => {
        console.log('Logging out...');
        await AsyncStorage.removeItem('authToken');
        setUserLoggedIn(false);
        router.push('/');
    };

    const [fontsLoaded] = useFonts({
        BebasNeue: require('@/assets/fonts/BebasNeue-Regular.ttf'),
    });

    if (!fontsLoaded) {
        console.log('No fonts loaded');
        return null;
    }
    if (!sideBarState) {
        return null;
    }

    return (
        <Animated.View
            entering={SlideInLeft.duration(500)}
            exiting={SlideOutLeft.duration(500)}
            style={[
                styles.SideBar,
                Platform.OS === 'web' ? { width: '20%' } : { width: '100%', height:'110%' },
            ]}
        >
            <TouchableOpacity
                onPress={() => setSideBarState(false)}
                style={styles.backIconContainer}
            >
                <Ionicons name="chevron-back" size={30} color="white" style={styles.backIcon} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/posts');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="browsers-sharp" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/account/profile');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="person-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Profiel</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/posts/list_favorite');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="star-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Favorieten</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/account/user_list');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="people-circle-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Gebruikers</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/posts/user_posts');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="share-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Eigen posts</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/posts/create_post');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="create-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Nieuwe post aanmaken</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    router.push('/tags/create_tag');
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="create-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Nieuwe tag aanmaken</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setSideBarState(false);
                    exitLogout();
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="exit-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Uitloggen</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    SideBar: {
        position: 'absolute',
        justifyContent: 'space-around',
        zIndex: 2,
        elevation: 2,
        height: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: '#222',
    },
    Icon: {
        color: 'white',
    },
    backIconContainer: {
        width: '100%',
        alignItems: 'flex-end',
    },
    backIcon: {
        marginRight: 18,
    },
    routeContainer: {
        marginLeft: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    SideText: {
        marginLeft: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'BebasNeue',
    },
    spacer: {
        height: '30%',
    },
});

export default SideBar;
