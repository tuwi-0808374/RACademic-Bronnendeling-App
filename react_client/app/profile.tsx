import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    StyleSheet, 
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [user, setUser] = useState<string>('');

  const saveProfile = async () => {
    const token = await AsyncStorage.getItem('jwt')

    const response = await fetch("http://127.0.0.1:5000/profile/<id>", {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,

    }
    });

    if (response.ok) {
        const data = await response.json();
        setUser(userData);
    }
    } else {
        console.log('Kan gebruiker niet vinden');
    }
    };

    fetchUser();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Naam</Text>
      <TextInput 
        value={name} 
        onChangeText={setName} 
        style={styles.input} 
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
      />

      <Button title="Opslaan" onPress={saveProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
});
