import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text,View, StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getApiBaseUrl} from "@/constants/get_ip";
const API_BASE_URL = getApiBaseUrl();


export default function RateButtons(props) {
    const [totalRating, setRating] = useState(props.total_rating);
    const [Rated, setRated] = useState(false);

    useEffect(() => {
        setRated(props.user_rating? props.user_rating : false);
    }, [props.user_rating]);

    // maakt de styling aan van de up/downvotes
    const buttonSettings ={
        'pos_color':Rated === 1?'#0000FF': '#000000',
        'pos_icon': Rated === 1?'chevron-up-circle': 'chevron-up-circle-outline',
        'neg_color': Rated === -1?'#ff0000': '#000000',
        'neg_icon': Rated === -1? 'chevron-down-circle': 'chevron-down-circle-outline'
    };
    if( props.loading ) return <Text>Loading...</Text>;
    const Rate = async (rating) => {
            const method = Rated ? "PATCH" : "POST";
            const url = `${API_BASE_URL}/rating/${props.userId}`;
            if (method === "POST") {
                let result = await fetch(url, {
                    method: method,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userId:props.userId,target_id: props.post_id, rating: rating, target: "posts"}),
                });
                result = await result.json();
                if (result) {
                    updateRatings(rating, props.total_rating);
                }
            }
            if (method === "PATCH") {
                let result = await fetch(url, {
                    method: method,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userId:props.userId,target_id: props.post_id, rating: rating, target: "posts"}),
                });
                result = await result.json();
                if (result) {
                    updateRatings(rating, props.total_rating);
                }
            }
    };

    const updateRatings = (new_rating) => {
        const diff = new_rating - (Rated || 0);
        if (diff === 0){
            setRating(prev => prev - new_rating);
            setRated(false);
        }
        else {
            setRating(prev => prev + diff);
            setRated(new_rating);
        }
    };

    return (
        <View style={{flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
        <TouchableOpacity style={[styles.button]} onPress={() => Rate(1)}>
            <Ionicons
                name={buttonSettings.pos_icon}
                size={24}
                color={buttonSettings.pos_color}/>
        </TouchableOpacity>
        <Text>{totalRating}</Text>
        <TouchableOpacity style={[styles.button]} onPress={() => Rate(-1)}>
            <Ionicons
                name={buttonSettings.neg_icon}
                size={24}
                color={buttonSettings.neg_color}/>
        </TouchableOpacity></View>
    )
}


const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});