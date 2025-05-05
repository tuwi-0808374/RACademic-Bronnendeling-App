import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text ,StyleSheet } from 'react-native';
import {Entypo, Ionicons} from '@expo/vector-icons';

function Set_Rated_posts(Ratings, Post_id){
    const [Rated, setRated] = useState();

    useEffect(() => {
        const rate_match = Ratings.find(rate =>  Post_id === rate["post_id"]);
        console.log(rate_match);
        if (rate_match) {
            setRated(true)
            console.log(Rated)
            console.log('Found matching rating:', rate_match);
        }
    }, [Ratings, Post_id]);

    console.log(Rated);
    return Rated;
}

export default function RateButtons({Post_id,Total_Rating, Ratings}) {
    const Rated = Set_Rated_posts(Ratings, Post_id);
    console.log(Rated);
    const Rate = async () => {

    };
    // if (Rated === true){
    //     console.log(Rated);
    // }
    // else if (Rated === false){
    //     console.log(Rated);
    // }
    return (
        <TouchableOpacity style={styles.button} onPress={Rate}>
            <Entypo
                name={'chevron-with-circle-up'}
                size={24}
                color={'#000000'}
            />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {
        padding: 10,
    },
});