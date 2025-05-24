import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const get_user_id = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            console.log('Geen token gevonden.');
            return null;
        }

        const decoded_user = jwt_decode(token);
        // @ts-ignore
        return decoded_user.user_id;
    } catch (error) {
        console.error('API request failed:', error);
        return null;
    }
}

function useUserId() {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await get_user_id();
            if (id) {
                setUserId(id);
            }
        };
        fetchUserId();
    }, []);

    return userId;
}

export default useUserId;
