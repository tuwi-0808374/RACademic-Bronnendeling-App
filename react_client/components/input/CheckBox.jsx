import {Text, View, TouchableOpacity, StyleSheet} from "react-native"

const COLORS = {
    red: '#C80032',
    background: '#F8F4EF',
    activebackground: '#bcbcbc',
    text: '#333333',
    textLight: '#FFFFFF',
    inputLine: '#555555',
    placeholderText: '#666666',
};

//  Bronnen
// https://www.youtube.com/watch?v=C-PVg6HhMNk

const CheckBox = ({options, CheckedValues, onChange}) => {
    let updatedCheckValues = [...CheckedValues];

    return (<View style={styles.container}>
        {options.map((option) => {
            let active = updatedCheckValues.includes(option.id);
            return (
                <TouchableOpacity style={active ? [styles.CheckBox, styles.activeCheckBox] : styles.CheckBox}
                                  key={option.id}
                    onPress={() => {
                    if (active) {
                    updatedCheckValues = updatedCheckValues.filter(
                    (checkedValue) => checkedValue !== option.id);
                    return onChange(updatedCheckValues);
                    }
                    updatedCheckValues.push(option.id);
                    onChange(updatedCheckValues);
                    }}>
                        <Text style={styles.Text}>{option.title}</Text>
                </TouchableOpacity>
            )
        })}

    </View>)
}

    const styles = StyleSheet.create({
        CheckBox:{
            height: 60,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            backgroundColor: COLORS.textLight,
            paddingHorizontal: 15,
            borderRadius: 15,
        },
        activeCheckBox:{
          backgroundColor: COLORS.activebackground,
        },
        Text: {
            fontSize: 16,
            marginLeft: 15,
            color: COLORS.text,
        }

    })

export default CheckBox;

