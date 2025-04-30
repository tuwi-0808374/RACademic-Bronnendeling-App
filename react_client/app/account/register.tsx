import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  red: '#C80032',
  black: '#000000',
  background: '#F8F4EF',
  text: '#333333',
  textLight: '#FFFFFF',
  inputLine: '#555555', 
  placeholderText: '#666666',
  languageBackground: '#E0E0E0',
};





const PrimaryButton = ({ onPress, title }: { onPress: () => void, title: string }) => (
  <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'NL'>('NL');
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      console.log('Vul alle velden in.');
      return;
    }
    if (password !== confirmPassword) {
      console.log('Wachtwoorden komen niet overeen.');
      return;
    }

    console.log('Registratie:', {
      firstName,
      lastName,
      username,
      email,
      password, 
    });

    try {
     router.push('/'); // hier homepage 

    } catch (error) {
      console.log('Error:', error);
    }
  };

    const [image, setImage] = useState<string | null>(null);

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.languageSelector}>
              <TouchableOpacity onPress={() => setActiveLanguage('EN')}>
                <Text
                  style={[
                    styles.languageText,
                    activeLanguage === 'EN' && styles.languageActiveText, 
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveLanguage('NL')}>
                <View
                  style={[
                    styles.languageOption,
                    activeLanguage === 'NL' && styles.languageActiveBackground,
                  ]}
                >
                  <Text
                    style={[
                      styles.languageText,
                      activeLanguage === 'NL' && styles.languageActiveText, 
                    ]}
                  >
                    NL
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
              <View style={styles.logoTextContainer}>
                <Image
                  source={require('../../assets/images/hr-logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.logoTitle}>HOGESCHOOL {'\n'}ROTTERDAM</Text>
              </View>
              <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.profileImage}
                    resizeMode="cover"

                  />
                ) : (
                  <Image
                    source={require('../../assets/images/profile.png')}
                    style={styles.profileImage}
                    resizeMode="cover"

                  />
                )}
              </TouchableOpacity>

            </View>
            
            <View style={styles.nameInputRow}>
              <View style={styles.nameInputContainer}>
                <Text style={styles.inputLabel}>VOORNAAM</Text>
                <TextInput
                  style={[styles.input, styles.inputFirstName]} 
                  placeholder="Test"
                  placeholderTextColor={COLORS.placeholderText}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  selectionColor={COLORS.red}
                />
              </View>
              <View style={styles.nameInputContainer}>
                <Text style={styles.inputLabel}>ACHTERNAAM</Text>
                <TextInput
                  style={[styles.input, styles.inputLastName]} 
                  placeholder="Test"
                  placeholderTextColor={COLORS.placeholderText}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  selectionColor={COLORS.inputLine}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GEBRUIKERSNAAM</Text>
              <TextInput
                style={[styles.input, styles.inputStandard]} 
                placeholder="test01"
                placeholderTextColor={COLORS.placeholderText}
                value={username}
                onChangeText={setUsername}
                selectionColor={COLORS.inputLine}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={[styles.input, styles.inputStandard]} 
                placeholder="voorbeeld@hr.nl"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                selectionColor={COLORS.inputLine}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WACHTWOORD</Text>
              <TextInput
                style={[styles.input, styles.inputStandard]}
                placeholder="********"
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                selectionColor={COLORS.inputLine}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>BEVESTIG WACHTWOORD</Text>
              <TextInput
                style={[styles.input, styles.inputStandard]} 
                placeholder="Bevestig wachtwoord"
                placeholderTextColor={COLORS.placeholderText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                selectionColor={COLORS.inputLine}
              />
            </View>

            <PrimaryButton onPress={handleRegister} title="Registreren" />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Heb je al een account? </Text>
              <Link href={'/account/login'}> 
                 <Text style={styles.loginLink}>Login</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  scrollContainer: {
     flexGrow: 1, 
     justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  languageSelector: {
    position: 'absolute',
    top: 15,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  languageOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginLeft: 10,
  },
  languageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  languageActiveBackground: {
    backgroundColor: COLORS.languageBackground,
  },
  languageActiveText: {
     color: COLORS.text,
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'left',
    marginBottom: 40,
  },

  nameInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },

  nameInputContainer: {
    width: '48%',
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
  inputFirstName: {
    borderBottomColor: COLORS.red,
  },
  inputLastName: {
     borderBottomColor: COLORS.inputLine,
  },
  inputStandard: {
     borderBottomColor: COLORS.inputLine,
  },
  primaryButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.text,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  
  logoTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    aspectRatio: 1,  
  },
  
  
});

export default RegisterScreen;