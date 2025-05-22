import { Text, View, StyleSheet} from 'react-native';
import NavBar from '../components/general/NavBar';
import TagContainer from '../components/general/TagContainer';

import { Link } from 'expo-router';

export default function Index() {
    return (

        <View style={styles.pageContainer}>
            <View style={styles.navbarContainer}>
                <NavBar />
                <TagContainer visible/>
            </View>


            <View style={styles.linkContainer}>
                <Link href={'/account/login'}>
                    Login
                </Link>
                <Link href={'/account/profile'}>
                    Profile
                </Link>
                <Link href={'/account/register'}>
                    Register
                </Link>
                <Link href={'/posts/create_post'}>
                    Create Post
                </Link>
                <Link href={'/posts/edit_post'}>
                    edit Post
                </Link>
                <Link href={'/posts'}>
                    Posts
                </Link>

                <Link href={'/posts/list_favorite'}>
                    List of favorited posts of logged user
                </Link>
                <Link href={'/posts/most_upvoted'}>
                    List of most upvoted posts
                </Link>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    pageContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
    },
    navbarContainer: {
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '70%',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
    },
    linkContainer: {
        backgroundColor: 'red',
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
    }
})