import { Text, View} from 'react-native';
import NavBar from '../components/general/NavBar';

import { Link } from 'expo-router';
import {useState} from "react";


export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <NavBar />
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
    );
}
