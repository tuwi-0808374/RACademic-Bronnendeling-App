import {Text, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
// import SearchBar from '../components/general/SearchBar';
import NavBar from '../components/general/NavBar';

import { Link } from 'expo-router';
import {useState} from "react";


export default function Index() {
    const [visible, setVisible] = useState(false);

    const handleOutsidePress = () => {
        console.log('outside press')

        setVisible(false);
    }

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.container}>
                <NavBar visible={visible} setVisible={setVisible} />

                <View style={styles.mainContentContainer}>
                    <Link href={'/account/login'}>Login</Link>
                    <Link href={'/account/profile'}>Profile</Link>
                    <Link href={'/account/register'}>Register</Link>
                    <Link href={'/posts/create_post'}>Create Post</Link>
                    <Link href={'/posts/edit_post'}>Edit Post</Link>
                    <Link href={'/posts'}>Posts</Link>
                    <Link href={'/posts/list_favorite'}>
                        List of favorited posts of logged user
                    </Link>
                    <Link href={'/posts/set_favorite'}>
                        List of posts with favorite button
                    </Link>
                </View>
            </View>
        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});
