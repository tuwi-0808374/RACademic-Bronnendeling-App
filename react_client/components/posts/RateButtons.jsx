import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text ,StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';

function Set_Rated_posts(Ratings, Post_id) {
    const [Rated, setRated] = useState(false);
    useEffect(() => {
        const match = Ratings.find(rate => rate.post_id === Post_id);
        if (match) {
            setRated(match.rating);
        } else {
            setRated(false);
        }
    }, [Ratings, Post_id]);

    return Rated;
}


export default function RateButtons({Post_id,Total_Rating, Ratings, updateRatings}) {

    const Rated = Ratings? Set_Rated_posts(Ratings, Post_id): null;

    let pos_button_color = '#000000'
    let neg_button_color = '#000000'
    let pos_button_icon = 'chevron-up-circle-outline'
    let neg_button_icon = 'chevron-down-circle-outline'
    if (Rated === 1){
        pos_button_color = '#0000FF'
        pos_button_icon = 'chevron-up-circle'
        neg_button_color = '#000000'
    }
    else if (Rated === -1){
        pos_button_color = '#000000'
        neg_button_icon = 'chevron-down-circle'
        neg_button_color = '#ff0000'
    }
    const Rate = async (rating) => {
        const method= Rated? "PATCH" : "POST";
        const url = method==="PATCH"?  `http://localhost:5000/rating/1` : `http://localhost:5000/rating`;
        if (method==="POST"){
            let result = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({target_id:Post_id, rating:rating, target:"posts"}),
            });
            result = await result.json();
            if(result){
                updateRatings(Post_id,result);
            }
        }
        if (method==="PATCH"){
            let result = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({target_id:Post_id, rating:rating, target:"posts"}),
            });
            result = await result.json();
            if(result){
                updateRatings(Post_id,result);
            }
        }

    };
    return (
        <>
            <TouchableOpacity style={[styles.button, {color: pos_button_color}]} onPress={() => Rate(1)}>
            <Ionicons
                name={pos_button_icon}
                size={24}
                color={pos_button_color}/>
            </TouchableOpacity>
            <Text>{Total_Rating}</Text>
            <TouchableOpacity style={[styles.button, {color: neg_button_color}]} onPress={() => Rate(-1)}>
            <Ionicons
                name={neg_button_icon}
                size={24}
                color={neg_button_color}/>
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