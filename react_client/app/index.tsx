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
            <Link href={'account/login'}> 
                Login
            </Link>
            <Link href={'account/profile'}> 
                Profile
            </Link>
            <Link href={'account/register'}> 
                Register
            </Link>

            <Link href={'/CreatePost'}>
                Create Post
            </Link>

        </View>
    );
}
