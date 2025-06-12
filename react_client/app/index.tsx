import React, { useState, useContext } from "react";
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
  Keyboard,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/get_ip";
import { Ionicons } from "@expo/vector-icons";
import { UserStatusContext } from "./_layout";
import LanguageSelector from "../components/account/LanguageSelector";
import { translations } from "../constants/translations";

const API_BASE_URL = getApiBaseUrl();

const COLORS = {
  red: "#C80032",
  background: "#F8F4EF",
  text: "#333333",
  textLight: "#FFFFFF",
  inputLine: "#555555",
  placeholderText: "#666666",
  languageBackground: "#E0E0E0",
  error: "#D32F2F",
};

type LoginButtonProps = {
  onPress: () => void;
  text: string;
};

const LoginButton = ({ onPress, text }: LoginButtonProps) => (
  <TouchableOpacity style={styles.loginButton} onPress={onPress}>
    <Text style={styles.loginButtonText}>{text}</Text>
  </TouchableOpacity>
);

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeLanguage, setActiveLanguage] = useState<"EN" | "NL">("NL");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const setUserLoggedIn = useContext(UserStatusContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Vul beide velden in!");
      setErrorMessage(
        translations[activeLanguage].login.errorMessages.emptyFields
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login succesvol", data);
        setUserLoggedIn(true);

        await AsyncStorage.setItem("authToken", data["access_token"]);
        router.push("/posts");
      } else {
        throw new Error(data.message || "Inloggen mislukt");
      }
    } catch (error) {
      setErrorMessage(error.message || "Er is een fout opgetreden");
      console.error("Login error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <LanguageSelector
              activeLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
            />

            <Image
              source={require("../assets/images/hr-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoTitle}>HOGESCHOOL ROTTERDAM</Text>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={COLORS.red}
                  style={styles.labelIcon}
                />
                <Text style={styles.inputLabel}>EMAIL</Text>
              </View>
              <TextInput
                style={[styles.input, styles.inputEmail]}
                placeholder={
                  translations[activeLanguage].login.emailPlaceholder
                }
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                selectionColor={COLORS.red}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={COLORS.inputLine}
                  style={styles.labelIcon}
                />
                <Text style={styles.inputLabel}>
                  {translations[activeLanguage].login.passwordLabel}
                </Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.inputPassword]}
                  placeholder="********"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  selectionColor={COLORS.inputLine}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.inputLine}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {errorMessage && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <LoginButton
              onPress={handleLogin}
              text={translations[activeLanguage].login.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                {translations[activeLanguage].login.registerText}
              </Text>
              <Link href={"/account/register"}>
                <Text style={styles.registerLink}>
                  {translations[activeLanguage].login.registerLink}
                </Text>
              </Link>
            </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  languageSelector: {
    position: "absolute",
    top: 15,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 50,
  },
  inputGroup: {
    width: Platform.OS === "web" ? "50%" : "100%",
    marginBottom: 35,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  labelIcon: {
    marginRight: 5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
  },
  loginButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: Platform.OS === "web" ? "50%" : "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    fontSize: 14,
    color: COLORS.text,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -20,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 5,
    fontSize: 14,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
});

export default LoginScreen;
