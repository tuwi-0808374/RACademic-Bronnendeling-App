import React, { useState, useEffect } from 'react';
import CheckBox from 'expo-checkbox';
import { TextInput, View, StyleSheet, Text } from 'react-native';

function SearchBar() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/tags')
            .then(res => res.json())
            .then(data => {
                setData(data.data);
                console.log('Fetched tags:', data.data);
            });
    }, []);

    const [checked, setChecked] = useState(false);
    function handleCheckboxChange(id) {
        setChecked(id);
        console.log(id);
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search tags"
            />
            <View style={styles.checkBoxContainer}>
                {data.map((item) => (
                    <View style={styles.section}>
                        <CheckBox style={styles.checkbox} value={checked} onValueChange={setChecked} />
                        <Text style={styles.paragraph}>{item.title}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    checkBoxContainer: {
        flex:1,
        marginTop: 10,
    },
    checkBoxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkBoxLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default SearchBar;
