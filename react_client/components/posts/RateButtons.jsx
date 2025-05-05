import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text ,StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';

function Set_Rated_posts(Ratings, Post_id) {
    const [Rated, setRated] = useState(false);

    useEffect(() => {
        const match = Ratings.find(rate => rate.post_id === Post_id);
        if (match) {
            setRated([match.rating]);
        } else {
            setRated(false);
        }
    }, [Ratings, Post_id]);

    return Rated;
}

export default function RateButtons({Post_id,Total_Rating, Ratings}) {
    const Rated = Set_Rated_posts(Ratings, Post_id)
    const Rate = async () => {
    };
    console.log(Rated);
    let pos_button_color = '#000000'
    let neg_button_color = '#000000'
    if (Rated == 1){
        pos_button_color = '#0000FF'
        neg_button_color = '#000000'
    }
    else if (Rated == -1){
        pos_button_color = '#000000'
        neg_button_color = '#0000ff'
    }


    return (
        <>
            <TouchableOpacity style={[styles.button, {color: pos_button_color}]} onPress={Rate}>
            <Ionicons
                name={'chevron-up-circle'}
                size={24}
                color={pos_button_color}/>
            </TouchableOpacity>
            <Text>{Total_Rating}</Text>
            <TouchableOpacity style={[styles.button, {color: neg_button_color}]} onPress={Rate}>
            <Ionicons
                name={'chevron-down-circle'}
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