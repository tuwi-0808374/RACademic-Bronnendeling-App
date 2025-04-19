import React, { useState, useEffect } from "react";
import { View, Text } from 'react-native';


//https://www.youtube.com/watch?v=7LNl2JlZKHA
export default function CreatePost() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/tags")
            .then(res => res.json())
            .then(data => {
                setData(data.data);
                console.log(data.data);
            })
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tags:</Text>
            {data.map((tag, i) => (
                <Text key={i}>
                    {tag['title']}
                    {'\n'}
                    {tag['content']}
                    {'\n'}
                </Text>

            ))}
        </View>
    );
}

