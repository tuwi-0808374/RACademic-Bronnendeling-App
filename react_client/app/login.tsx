import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView 
} from 'react-native';
import { Link } from 'expo-router'; 

const COLORS = {
  red: '#C80032',
  background: '#F8F4EF',
  text: '#333333',
  textLight: '#FFFFFF',
  inputLine: '#555555',
  placeholderText: '#666666',
  languageBackground: '#E0E0E0', 
};

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'NL'>('NL');

  const handleLogin = () => {
    if (!email || !password) {
      console.log('Please fill in both fields.');
      return;
      // hier backend
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

          <Image
            source={require('../assets/images/hr-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>HOGESCHOOL ROTTERDAM</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={[styles.input, styles.inputEmail]}
              placeholder="voorbeeld@hr.nl"
              placeholderTextColor={COLORS.placeholderText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              selectionColor={COLORS.red}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>WACHTWOORD</Text>
            <TextInput
              style={[styles.input, styles.inputPassword]}
              placeholder="********"
              placeholderTextColor={COLORS.placeholderText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              selectionColor={COLORS.inputLine}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Inloggen</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Nog geen account? </Text>
            <Link href={'/test'}> 
              <Text style={styles.registerLink}>Registreren</Text>
            </Link>
          </View>
        </View>
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
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 40, 
    paddingBottom: 20,
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
    width: 150,
    height: 100,
    marginBottom: 15,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 50,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 35,
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
  inputEmail: {
    borderBottomColor: COLORS.red,
  },
  inputPassword: {
    borderBottomColor: COLORS.inputLine,
  },
  loginButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, 
  },
  registerText: {
    fontSize: 14,
    color: COLORS.text,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.red, 
    fontWeight: 'bold',
  },
});

export default LoginScreen;