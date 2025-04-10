import React from 'react';
import { Text,View } from 'react-native';
import PartOfTheDay from './PartOfTheDay';

export default function HelloWorld({important}) {
    return (
        // HelloWorld-components nesten
        <View>
            <PartOfTheDay />
            <Text>Hello, World! {important}. Hello,World!</Text>
        </View>
    );
}