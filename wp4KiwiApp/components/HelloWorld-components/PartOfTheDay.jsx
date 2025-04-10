import React from 'react';
import { Text } from 'react-native';

let date = new Date()
let time = date.getHours()
let hours = date.getHours()+':'+ date.getMinutes()

export default function PartOfTheDay() {
    let partOfTheDay = ''
    if ( time < 12) {
        partOfTheDay = 'Goede morge! '+ hours.toString();
    }
    else if ( time <= 17 ) {
        partOfTheDay = 'Goede middag'+ hours.toString();
    }
    else {
        partOfTheDay = 'Goedee avond! ' + hours.toString();
    }
    return <Text>{partOfTheDay}</Text>;
}