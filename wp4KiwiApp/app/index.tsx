import { Text, View } from 'react-native';
import HelloWorld from '@/components/HelloWorld-components/HelloWorld';
import TeacherList from "@/components/HelloWorld-components/GetTeachers";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>
                Er is een file 'app-example' die kan verwijdered worden, maar ik laat hem
                nog even staan als voorbeeld voor de gene die het nog willen bekijken
            </Text>
            <HelloWorld
                important={
                    <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>
                        verwijder de HelloWorld-components
                    </Text>
                }
            />
            <TeacherList />
        </View>
    );
}
