import React, { useState } from "react";
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
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import ImageUploader from "../../components/account/ImageUploader";
import { useDebouncedCallback } from "use-debounce";
import { getApiBaseUrl } from "../../constants/get_ip";
import Icon from "react-native-vector-icons/Ionicons";
import Container from "../../components/general/Container";
import ErrorMessage from "../../components/general/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";
import LanguageSelector from "../../components/account/LanguageSelector";
import { translations } from "../../constants/translations";

const API_BASE_URL = getApiBaseUrl();

const COLORS = {
  red: "#C80032",
  black: "#000000",
  background: "#F8F4EF",
  text: "#333333",
  textLight: "#FFFFFF",
  inputLine: "#555555",
  placeholderText: "#666666",
  languageBackground: "#E0E0E0",
};

const PrimaryButton = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => (
  <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const AdminRegisterScreen = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message: string;
  }>({ checking: false, message: "" });
  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message: string;
  }>({ checking: false, message: "" });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"EN" | "NL">("NL");
  const router = useRouter();
  const [AccountPublic, setAccountPublic] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");

  const usernameStatusStyle = [
    styles.usernameStatus,
    usernameStatus.checking && styles.usernameChecking,
    usernameStatus.available === true && styles.usernameAvailable,
    usernameStatus.available === false && styles.usernameUnavailable,
  ];

  const emailStatusStyle = [
    styles.usernameStatus,
    emailStatus.checking && styles.usernameChecking,
    emailStatus.available === true && styles.usernameAvailable,
    emailStatus.available === false && styles.usernameUnavailable,
  ];

  const debouncedCheckUsername = useDebouncedCallback((username: string) => {
    if (!username) {
      setUsernameStatus({ checking: false, message: "" });
      return;
    }

    setUsernameStatus({ checking: true, message: "Controleren..." });

    fetch(`${API_BASE_URL}/check_username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsernameStatus({
          checking: false,
          available: data.available,
          message: data.message,
        });
      })
      .catch((error) => {
        console.error("Error checking username:", error);
        setUsernameStatus({ checking: false, message: "Fout bij controleren" });
      });
  }, 900);

  const debouncedCheckEmail = useDebouncedCallback((email: string) => {
    if (!email) {
      setEmailStatus({ checking: false, message: "" });
      return;
    }

    setEmailStatus({ checking: true, message: "Controleren..." });

    fetch(`${API_BASE_URL}/check_email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEmailStatus({
          checking: false,
          available: data.available,
          message: data.message,
        });
      })
      .catch((error) => {
        console.error("Error checking email:", error);
        setEmailStatus({ checking: false, message: "Fout bij controleren" });
      });
  }, 900);
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    debouncedCheckUsername(text);
  };

  const handleRegister = async () => {
    if (
      (!usernameStatus.available && username) ||
      (!emailStatus.available && email)
    ) {
      console.log("Kies een beschikbare gebruikersnaam en email");
      setGeneralError("Kies een beschikbare gebruikersnaam en email");
      return;
    }
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      console.log("Vul alle velden in.");
      setGeneralError("Vul alle velden in.");
      return;
    }
    if (password !== confirmPassword) {
      console.log("Wachtwoorden komen niet overeen.");
      setGeneralError("Wachtwoorden komen niet overeen.");
      return;
    }

    try {
      let base64Image = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const formData = {
        email,
        display_name: `${firstName} ${lastName}`,
        first_name: firstName,
        username,
        last_name: lastName,
        password,
        is_public: AccountPublic,
        is_admin: isAdmin,
        profile_image: base64Image,
      };

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) router.push("/account/user_list");
      else {
        console.log("Registration failed:", data.error);
        setGeneralError(data.error || "Registratie mislukt");
      }
    } catch (error) {
      console.log("Error:", error);
      setGeneralError("Er is een fout opgetreden");
    }
  };
  const removeImage = () => {
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Container>
            <View style={styles.innerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.navigate("/account/user_list")}
              >
                <Icon name="arrow-back" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <LanguageSelector
                activeLanguage={activeLanguage}
                onLanguageChange={setActiveLanguage}
              />
              <View style={styles.logoContainer}>
                <View style={styles.logoTextContainer}>
                  <Image
                    source={require("../../assets/images/hr-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.logoTitle}>
                    HOGESCHOOL {"\n"}ROTTERDAM
                  </Text>
                </View>

                <ImageUploader
                  image={image}
                  onImageSelected={setImage}
                  activeLanguage={activeLanguage}
                />
              </View>

              <View style={styles.nameInputRow}>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.inputLabel}>
                    {translations[activeLanguage].register.firstNameLabel}
                  </Text>
                  <TextInput
                    style={[styles.input, styles.inputFirstName]}
                    placeholder={
                      translations[activeLanguage].register.firstNamePlaceholder
                    }
                    placeholderTextColor={COLORS.placeholderText}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    selectionColor={COLORS.red}
                  />
                </View>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.inputLabel}>
                    {translations[activeLanguage].register.lastNameLabel}
                  </Text>
                  <TextInput
                    style={[styles.input, styles.inputLastName]}
                    placeholder={
                      translations[activeLanguage].register.lastNamePlaceholder
                    }
                    placeholderTextColor={COLORS.placeholderText}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    selectionColor={COLORS.inputLine}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {translations[activeLanguage].register.usernameLabel}
                </Text>
                <TextInput
                  style={[styles.input, styles.inputStandard]}
                  placeholder={
                    translations[activeLanguage].register.usernamePlaceholder
                  }
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={handleUsernameChange}
                  selectionColor={COLORS.inputLine}
                />
                {usernameStatus.checking ? (
                  <Text style={usernameStatusStyle}>
                    {translations[activeLanguage].register.checkingText}
                  </Text>
                ) : usernameStatus.message ? (
                  <Text style={usernameStatusStyle}>
                    {usernameStatus.message}
                  </Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <TextInput
                  style={[styles.input, styles.inputStandard]}
                  placeholder="voorbeeld@hr.nl"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    debouncedCheckEmail(text);
                  }}
                  keyboardType="email-address"
                  selectionColor={COLORS.inputLine}
                />
                {emailStatus.checking ? (
                  <Text style={emailStatusStyle}>
                    {translations[activeLanguage].register.checkingText}
                  </Text>
                ) : emailStatus.message ? (
                  <Text style={emailStatusStyle}>{emailStatus.message}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {translations[activeLanguage].register.passwordLabel}
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.inputStandard]}
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {translations[activeLanguage].register.confirmPasswordLabel}
                </Text>
                <TextInput
                  style={[styles.input, styles.inputStandard]}
                  placeholder={
                    translations[activeLanguage].register
                      .confirmPasswordPlaceholder
                  }
                  placeholderTextColor={COLORS.placeholderText}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  selectionColor={COLORS.inputLine}
                />
              </View>

              <View style={styles.togglesContainer}>
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleLabelContainer}>
                    <TouchableOpacity
                      style={styles.infoIcon}
                      onPress={() => {
                        if (Platform.OS === "web") {
                          setShowTooltip(!showTooltip);
                        }
                      }}
                      onPressIn={() =>
                        Platform.OS !== "web" && setShowTooltip(true)
                      }
                      onPressOut={() =>
                        Platform.OS !== "web" && setShowTooltip(false)
                      }
                    >
                      <Icon
                        name="information-circle-outline"
                        size={20}
                        color={COLORS.text}
                      />
                    </TouchableOpacity>
                    {showTooltip && (
                      <View
                        style={[
                          styles.tooltip,
                          Platform.OS === "web" && styles.tooltipWeb,
                        ]}
                      >
                        <Text style={styles.tooltipText}>
                          {translations[activeLanguage].register.tooltipText}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.toggleLabel}>
                      {
                        translations[activeLanguage].register
                          .privateAccountLabel
                      }
                    </Text>
                  </View>
                  <Switch
                    value={AccountPublic}
                    onValueChange={(value) => setAccountPublic(value)}
                  />
                </View>
                <View style={styles.toggleWrapper}>
                  <View style={styles.toggleLabelContainer}>
                    <Text style={styles.toggleLabel}>
                      {translations[activeLanguage].register.adminAccountLabel}
                    </Text>
                    <Switch
                      value={isAdmin}
                      onValueChange={(value) => setIsAdmin(value)}
                    />
                  </View>
                </View>
              </View>

              <ErrorMessage message={generalError} type="error" />
              <PrimaryButton
                onPress={handleRegister}
                title={translations[activeLanguage].register.registerButton}
              />
            </View>
          </Container>
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
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
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
    width: 120,
    height: 80,
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "left",
    marginBottom: 40,
  },
  nameInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },
  nameInputContainer: {
    width: "48%",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
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
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.text,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: "bold",
    marginLeft: 5,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  logoTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    aspectRatio: 1,
  },
  removeImageButton: {
    marginTop: 10,
    backgroundColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  removeImageButtonText: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: 12,
  },
  usernameStatus: {
    fontSize: 12,
    marginTop: 4,
  },
  usernameAvailable: {
    color: "green",
  },
  usernameUnavailable: {
    color: "red",
  },
  usernameChecking: {
    color: COLORS.placeholderText,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 1,
  },
  toggleRow: {
    width: "100%",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  togglesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  toggleWrapper: {
    width: "48%",
  },
  tooltip: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  tooltipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  infoIcon: {
    paddingRight: 8,
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 20,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    bottom: 10,
  },
  tooltipWeb: {},
});

export default AdminRegisterScreen;
