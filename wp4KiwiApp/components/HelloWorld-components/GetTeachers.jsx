import React, {useState, useEffect} from 'react';
import { Text,View } from 'react-native';
//haal json op
// import data from './teachers.json';

//component structuur hoe de data word gerenderd
const Teacher = ({name,email, subject}) => (
    <View>
        <Text>{name}</Text>
        <Text>{email}</Text>
        <Text>{subject}</Text>
    </View>
);

export default function TeacherList() {
    // useState en Effect hebben niet veel nut aangezien het een jsonfile is
    // maar voor later als we een db hebben wel
    const [data, setTeachers] = useState([]);
    useEffect(() => {
        const fetchTeachers = async () => {
            // haal data op
            const response = await require('./teachers.json');
            setTeachers(response);
        };
        fetchTeachers();
    }, []);

    useEffect(() => {console.log('ingeladen')})
    return (
        <View>
            {data.map((teacher, index) => (
                <Teacher key={index} name={teacher.name} email={teacher.email} subject={teacher.subject} />
            ))}
        </View>
    );
}