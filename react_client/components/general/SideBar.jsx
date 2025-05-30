import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import {Ionicons} from '@expo/vector-icons';
function SideBar({sideBarState, setSideBarState}) {
    const router = useRouter();

    if (!sideBarState) {
        return null;
    }
    return(
        <View style={styles.SideBar}>
            <TouchableOpacity onPress={() => setSideBarState(false)}>
                <Ionicons name="chevron-back" size={32} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/')}>
                <Ionicons name="exit" size={32} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/homepage')}>
                <Ionicons name="home" size={32} color="black"/>
                <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/posts')}>
                <Ionicons name="browsers-sharp" size={32} color="black"/>
                <Text>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/account/profile')}>
                <Ionicons name="person-outline" size={32} color="black"/>
                <Text>Profile</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    SideBar: {
        position: 'absolute',
        zIndex: 2,
        elevation: 2,
        height: '100%',
        width: '25%',
        backgroundColor: '#fff',
    }
})

export default SideBar;