import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode"
import { UserStatusContext } from "../app/_layout";

const UserContext = createContext();

const get_user_id = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            console.log('No token found.');
            return null;
        }
        const decoded_user = jwt_decode(token);
        return decoded_user.user_id; // Adjust depending on your token structure
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const setUserLoggedIn = useContext(UserStatusContext);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await get_user_id();
            if (id) {
                setUserId(id);
                setUserLoggedIn(true); 
            }
            else 
            {
                setUserLoggedIn(false);
            }
            setLoading(false);
        };
        fetchUserId();
    }, []);

    return (
        <UserContext.Provider value={{ userId, setUserId, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to use in screens/components
export const useUser = () => useContext(UserContext);
