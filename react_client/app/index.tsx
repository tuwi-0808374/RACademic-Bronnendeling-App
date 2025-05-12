import { Text, View} from 'react-native';
import SearchBar from '../components/general/SearchBar';

import { Link } from 'expo-router';

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <SearchBar />
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
            <Link href={'/posts/set_favorite'}>
                List of posts with favorite button
            </Link>
        </View>
    );
}
