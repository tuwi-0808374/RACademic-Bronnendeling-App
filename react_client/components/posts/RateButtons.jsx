import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text ,StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function RateButtons(props) {
    const [totalRating, setRating] = useState(props.Total_Rating);
    const [Rated, setRated] = useState(false);
    // checked of het all een rating heeft
    useEffect(() => {
        const matches = props.Ratings.find(rate => rate.post_id === props.Post_id)?.rating || false;
        setRated(matches || false);
    }, [props.Ratings, props.Post_id]);

    console.log(Rated)


    // maakt de styling aan van de up/downvotes
    const isPositive = Rated === 1;
    const isNegative = Rated === -1;
    const pos_button_color = isPositive ? '#0000FF' : '#000000';
    const neg_button_color = isNegative ? '#ff0000' : '#000000';
    const pos_button_icon = isPositive ? 'chevron-up-circle' : 'chevron-up-circle-outline';
    const neg_button_icon = isNegative ? 'chevron-down-circle' : 'chevron-down-circle-outline';


    const Rate = async (rating) => {
        const method= Rated? "PATCH" : "POST";
        const url = method==="PATCH"?  `http://localhost:5000/rating/1` : `http://localhost:5000/rating`;
        if (method==="POST"){
            let result = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({target_id:props.Post_id, rating:rating, target:"posts"}),
            });
            result = await result.json();
            if(result){
                updateRatings(rating,props.Total_Rating);
            }
        }
        if (method==="PATCH"){
            let result = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({target_id:props.Post_id, rating:rating, target:"posts"}),
            });
            result = await result.json();
            if(result){
                updateRatings(rating,props.Total_Rating);
            }
        }

    };

    const updateRatings = (new_rating,prevTotal) => {
        // console.log(prevTotal,new_rating);
        setRating(prevTotal + new_rating);
        setRated(new_rating);

    };

    return (
        <>
            <TouchableOpacity style={[styles.button, {color: pos_button_color}]} onPress={() => Rate(1)}>
            <Ionicons
                name={pos_button_icon}
                size={24}
                color={pos_button_color}/>
            </TouchableOpacity>
            <Text>{totalRating}</Text>
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