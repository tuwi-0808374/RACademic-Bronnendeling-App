import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import ImageUploader from '../../components/account/ImageUploader';

const COLORS = {
  red: '#C80032',
  background: '#F8F4EF',
  text: '#333333',
  textLight: '#FFFFFF',
  inputLine: '#555555', 
  placeholderText: '#666666', 

};

interface JwtPayload {
  sub: string; 
  user_id: number; 
  full_name?: string; 
  iat: number; 
  exp: number; 
  jti: string; 
}


export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
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
          if (userData) {
              setFirstName(userData.first_name || '');
              setLastName(userData.last_name || '');
              setEmail(userData.email || '');
              setUserName(userData.username || '');

              if (userData.profile_image_url) {
                setProfileImage(userData.profile_image_url);
                console.log('Profiel foto URL:', userData.profile_image_url);
              }
              
          }
        } else {
          console.log(`Kan profiel niet ophalen.`);
          const errorData = await response.text(); 
          console.log('Foutdetails:', errorData);
        }
      } catch (error) {
        console.log('Fout bij ophalen profiel:', error);
      }
    };

    fetchProfile();
  }, []);

  
  const saveProfile = async () => {
    console.log('Profiel opslaan met:', { first_name, lastName, email, username });
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('Geen token gevonden.');
        
        return;
        
      }
      let base64Image = null;
      if (profileImage && !profileImage.startsWith('http')) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
          });
        }
      const decoded = jwt_decode<JwtPayload>(token);
      const currentUserId = decoded.user_id; 

      if (!currentUserId) {
        console.error('User ID niet gevonden in token:', decoded);
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/update_profile/${currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name: lastName,
          email,
          username,
          profile_image: base64Image
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Profiel succesvol bijgewerkt:', responseData);        
        } else {
            
        console.log(`Kan profiel niet updaten.`);
        const errorData = await response.text(); 
        console.log('Foutdetails:', errorData);
      }
    } catch (error) {
      console.log('Fout bij opslaan profiel:', error);
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.innerContainer}>
        <View style={styles.profileImageContainer}>
        <ImageUploader
          image={profileImage} 
          onImageSelected={setProfileImage} 
        />
      </View>
              
        <Image
          source={require('../../assets/images/hr-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
          
          <Text style={styles.logoTitle}>MIJN PROFIEL</Text> 


          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Voornaam</Text>
            <TextInput
              value={first_name}
              onChangeText={setFirstName}
              style={[styles.input, styles.inputStyle]} 
              selectionColor={COLORS.red} 
              placeholderTextColor={COLORS.placeholderText} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Achternaam</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={[styles.input, styles.inputStyle]}
              selectionColor={COLORS.red}
              placeholderTextColor={COLORS.placeholderText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail} 
              style={[styles.input, styles.inputStyle]}
              keyboardType="email-address"
              autoCapitalize="none"
              selectionColor={COLORS.red}
              placeholderTextColor={COLORS.placeholderText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gebruikersnaam</Text>
            <TextInput
              value={username}
              onChangeText={setUserName} 
              style={[styles.input, styles.inputStyle]}
              autoCapitalize="none"
              selectionColor={COLORS.red}
              placeholderTextColor={COLORS.placeholderText}
            />
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={saveProfile}>
            <Text style={styles.actionButtonText}>Opslaan</Text>
          </TouchableOpacity>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40, 
    paddingBottom: 20,
  },
  logo: {
    width: 120, 
    height: 80,
    marginBottom: 10,
    alignSelf: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40, 
    textTransform: 'uppercase', 
  },
  inputGroup: {
    width: '100%',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1.5,
    height: 40,
    fontSize: 16,
    paddingBottom: 5,
    color: COLORS.text,
  },
  inputStyle: { 
    borderBottomColor: COLORS.inputLine,
  },
  
  actionButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 30, 
    marginBottom: 30, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.red,
  },
});