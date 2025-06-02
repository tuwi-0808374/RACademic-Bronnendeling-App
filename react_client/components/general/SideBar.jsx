import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

function SideBar({sideBarState, setSideBarState}) {
    const router = useRouter();

    if (!sideBarState) {
        return null;
    }
    return(
        <View style={[styles.SideBar, Platform.OS === 'web' ? {width: '20%'}: {width: '75%'}]}>
            <TouchableOpacity onPress={() => setSideBarState(false)}  style={styles.backIconContainer}>
                <Ionicons name="chevron-back" size={30} color='white' style={styles.backIcon} />
            </TouchableOpacity>



            <TouchableOpacity onPress={() => {
                setSideBarState(false);
                router.push('/homepage')
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="home" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/posts')} style={styles.routeContainer}>
                <Ionicons name="browsers-sharp" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setSideBarState(false);
                router.push('/account/profile')
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="person-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Profiel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setSideBarState(false);
                router.push('/posts/list_favorite')
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="star-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Favorieten</Text>
            </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                setSideBarState(false);
                router.push('/account/user_list')
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="people-circle-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Gebruikers</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setSideBarState(false);
                router.push('/posts/user_posts')
                }}
                style={styles.routeContainer}
            >
                <Ionicons name="share-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Eigen posts</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setSideBarState(false);
                router.push('/posts/create_post')
            }}
                              style={styles.routeContainer}
            >
                <Ionicons name="share-outline" size={32} style={styles.Icon} />
                <Text style={styles.SideText}>Nieuwe post aanmaken</Text>
            </TouchableOpacity>

            <View style={styles.spacer}/>
        </View>

    );
}

const styles = StyleSheet.create({
    SideBar: {
        position: 'absolute',
        justifyContent: 'space-around',
        zIndex: 2,
        elevation: 2,
        height: '100%',
        backgroundColor: 'black',
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
        // justifyContent: 'space-between',
        flexDirection: 'row',
    },
    SideText: {
        marginLeft: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    spacer:{
        height: '30%',
    }
})

export default SideBar;