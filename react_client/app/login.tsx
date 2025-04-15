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
} from 'react-native';

const COLORS = {
  red: '#C80032', 
  background: '#F8F4EF',
  text: '#333333',
  textLight: '#FFFFFF',
  inputLine: '#555555', 
  placeholderText: '#666666', 
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    if (!email || !password) {
      console.log('Please fill in both fields.');
      return;
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
          <Image
            source={require('../assets/images/hr-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>HOGESCHOOL ROTTERDAM</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-MAILADRES</Text>
            <TextInput
              style={[styles.input, styles.inputEmail]}
              placeholder="email@hr.nl"
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
});

export default LoginScreen;