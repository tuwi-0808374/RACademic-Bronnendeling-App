import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView} from 'react-native';
import NavBar from '../components/general/NavBar';
import TagContainer from '../components/general/TagContainer';
import { Link } from 'expo-router';
import {useState} from "react";

export default function Index() {
    const [visible, setVisible] = useState(false);
    const [selectedTags, setSelectedTags] = useState({});


    const handleInsidePress = () => {
        setVisible(true);
    }
    const handleClose = () => {
        setVisible(false);
    }
    return (

        <View style={styles.pageContainer}>

            <View style={styles.navbarContainer} >
                <TouchableOpacity style={styles.navbarContainer} onPress={handleInsidePress}>
                    <NavBar
                        setVisible={setVisible}
                        selectedTags={selectedTags}
                    />
                </TouchableOpacity>
                <TagContainer
                    visible={visible}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                />
            </View>

            <TouchableWithoutFeedback onPress={handleClose}>
                <ScrollView style={styles.contentContainer}>
                    <Text>taetateaa</Text>
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
                </ScrollView>
            </TouchableWithoutFeedback>

        </View>
    );
}
const styles = StyleSheet.create({
    pageContainer:{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        elevation:0,
        zIndex:0,
    },
    navbarContainer: {
        backgroundColor: 'black',
        width: '100%',
        height: '9%',
        elevation: 1,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex:1,
        elevation: 0,
        zIndex: 0,
    }
})