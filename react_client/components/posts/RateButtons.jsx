import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text ,StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

export default function RateButtons(props) {
    const [totalRating, setRating] = useState(props.Total_Rating);
    const [Rated, setRated] = useState(false);
    console.log(props)
    // checked of het all een rating heeft
    useEffect(() => {
        if (props.Rating.userRated === true) {
            setRated(matches || false);
        }
    }, [props.Rating]);

    // maakt de styling aan van de up/downvotes
    const buttonSettings ={
        'pos_color':Rated === 1?'#0000FF': '#000000',
        'pos_icon': Rated === 1?'chevron-up-circle': 'chevron-up-circle-outline',
        'neg_color': Rated === -1?'#ff0000': '#000000',
        'neg_icon': Rated === -1? 'chevron-down-circle': 'chevron-down-circle-outline'
    };

    const Rate = async (rating) => {

            const method = Rated ? "PATCH" : "POST";
            const url = method === "PATCH" ? `http://localhost:5000/rating/${user_id}` : `http://localhost:5000/rating/${user_id}`;
            if (method === "POST") {
                let result = await fetch(url, {
                    method: method,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({target_id: props.Post_id, rating: rating, target: "posts"}),
                });
                result = await result.json();
                if (result) {
                    updateRatings(rating, props.Total_Rating);
                }
            }
            if (method === "PATCH") {
                let result = await fetch(url, {
                    method: method,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({target_id: props.Post_id, rating: rating, target: "posts"}),
                });
                result = await result.json();
                if (result) {
                    updateRatings(rating, props.Total_Rating);
                }
            }
    };

    const updateRatings = (new_rating) => {
        const diff = new_rating - (Rated || 0);
        if (diff === 0){
            setRating(prev => prev - new_rating);
            setRated(false);
            console.log('undo t',props.Total_Rating, "n",new_rating, 'd', diff);
        }
        else {
            setRating(prev => prev + diff);
            setRated(new_rating);
            console.log('commit t',props.Total_Rating, "n",new_rating, 'd', diff);
        }
    };

    return (
        <>
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
        </TouchableOpacity></>
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