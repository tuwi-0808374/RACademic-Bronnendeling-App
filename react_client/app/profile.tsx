import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';



interface JwtPayload {
  sub: string; 
  user_id: number; 
  full_name?: string; 
  iat: number; 
  exp: number; 
  jti: string; 
}

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('Geen token gevonden.');
          return;
        }

        const decoded = jwt_decode<JwtPayload>(token);
        const currentUserId = decoded.user_id; 

        if (!currentUserId) {
          console.error('User ID niet gevonden in token:', decoded);
          
          return;
     }

        setUserId(currentUserId);

        const response = await fetch(`http://127.0.0.1:5000/profile/${currentUserId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          const userData = responseData.data;
          setFirstName(userData.first_name || '');
          setLastName(userData.last_name || '');
          setEmail(userData.email || '');
        } else {
          console.log('Kan profiel niet ophalen.');
        }
      } catch (error) {
        console.log('Fout bij ophalen profiel:', error);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
  
    console.log('Profiel opslaan is nog niet geïmplementeerd.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voornaam</Text>
      <TextInput 
        value={first_name} 
        onChangeText={setFirstName} 
        style={styles.input} 
      />

      <Text style={styles.label}>Achternaam</Text>
      <TextInput 
        value={lastName} 
        onChangeText={setLastName} 
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
