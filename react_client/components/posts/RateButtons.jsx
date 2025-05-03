import React, { useEffect,useState } from 'react';
import { TouchableOpacity,Text ,StyleSheet } from 'react-native';
import {Entypo, Ionicons} from '@expo/vector-icons';

export default function RateButtons({Post_id,Total_Rating, Ratings}) {
    const [Rated, setRated] = useState();
    if (Post_id == Ratings['id']){
        useEffect(() => {

        })
    }
    const Rate = async () => {

    };
    return (
        // <TouchableOpacity style={styles.button} onPress={Rate}>
        //     <Entypo
        //         name={'chevron-with-circle-up'}
        //         size={24}
        //         color={'#000000'}
        //     />
        // </TouchableOpacity>
        <Text>{Total_Rating}</Text>
    )
}


const styles = StyleSheet.create({
    button: {
        padding: 10,
    },
});