import {View, StyleSheet} from 'react-native';
import { Link } from 'expo-router';


export default function Index() {
    return (
        <View style={styles.contentContainer}>
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
                Create post
            </Link>
            <Link href={'/posts'}>
                Posts
            </Link>
            <Link href={'/posts/user_posts'}>
                  User posts
            </Link>
            <Link href={'/posts/list_favorite'}>
                List of favorited posts of logged user
            </Link>
            <Link href={'/posts/most_upvoted'}>
                List of most upvoted posts
            </Link>
            <Link href={'/account/user_list'}>
                List of users
            </Link>
        </View>
    );
}
const styles = StyleSheet.create({
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})