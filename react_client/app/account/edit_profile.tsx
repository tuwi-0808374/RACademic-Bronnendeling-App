import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import ImageUploader from "../../components/account/ImageUploader";
import { useDebouncedCallback } from "use-debounce";
import { getApiBaseUrl } from "../../constants/get_ip";
import { CheckBox } from "@/components/input";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import ErrorMessage from "../../components/general/ErrorMessage";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import Container from "../../components/general/Container";

const API_BASE_URL = getApiBaseUrl();

const COLORS = {
  red: "#C80032",
  background: "#F8F4EF",
  text: "#333333",
  textLight: "#FFFFFF",
  inputLine: "#555555",
  placeholderText: "#666666",
  success: "#4CAF50",
  error: "#D32F2F",
};

interface JwtPayload {
  sub: string;
  user_id: number;
  full_name?: string;
  iat: number;
  exp: number;
  jti: string;
}

export default function EditProfileScreen() {
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [passwordChangeMessageType, setPasswordChangeMessageType] = useState<
    "success" | "error" | ""
  >("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message: string;
  }>({ checking: false, message: "" });

  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message: string;
  }>({ checking: false, message: "" });

  const [showTooltip, setShowTooltip] = useState(false);
  const [checkedTags, setCheckedTags] = useState({});
  const [data, setData] = useState([]);

  const [AccountPublic, setAccountPublic] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("Geen token gevonden.");
          return;
        }

        const decoded = jwt_decode<JwtPayload>(token);
        const currentUserId = decoded.user_id;

        if (!currentUserId) {
          console.error("User ID niet gevonden in token:", decoded);
          return;
        }

        setUserId(currentUserId);

        const response = await fetch(
          `${API_BASE_URL}/profile/${currentUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const userData = responseData.data;
          if (userData) {
            setFirstName(userData.first_name || "");
            setLastName(userData.last_name || "");
            setEmail(userData.email || "");
            setUserName(userData.username || "");
            setAccountPublic(!!userData.is_public);

            if (userData.profile_image_url) {
              setProfileImage(userData.profile_image_url);
              console.log("Profiel foto URL:", userData.profile_image_url);
            }
          }
        } else {
          console.log(`Kan profiel niet ophalen.`);
          const errorData = await response.text();
          console.log("Foutdetails:", errorData);
        }
      } catch (error) {
        console.log("Fout bij ophalen profiel:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    setPasswordChangeMessage("");
    setPasswordChangeMessageType("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordChangeMessage("Vul alstublieft alle wachtwoordvelden in.");
      setPasswordChangeMessageType("error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage("Nieuwe wachtwoorden komen niet overeen.");
      setPasswordChangeMessageType("error");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token || !userId) {
        setPasswordChangeMessage("Log opnieuw in.");
        setPasswordChangeMessageType("error");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/change_password/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        setPasswordChangeMessage(
          responseData.message || "Wachtwoord succesvol gewijzigd!"
        );
        setPasswordChangeMessageType("success");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordChangeMessage(
          responseData.message || "Kon wachtwoord niet wijzigen."
        );
        setPasswordChangeMessageType("error");
      }
    } catch (error) {
      console.error("Fout bij wijzigen wachtwoord:", error);
      setPasswordChangeMessage("Er is een fout opgetreden.");
      setPasswordChangeMessageType("error");
    }
  };

  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("Geen token gevonden.");
        return;
      }

      const decoded = jwt_decode<JwtPayload>(token);
      const currentUserId = decoded.user_id;

      if (!currentUserId) {
        return;
      }

      if (
        emailStatus.available === false ||
        usernameStatus.available === false
      ) {
        console.log("Kies een beschikbare e-mail en gebruikersnaam");
        return;
      }

      const formData: any = {
        first_name,
        last_name: lastName,
        email,
        username,
        is_public: Boolean(AccountPublic),
      };

      if (profileImage === null) {
        formData.profile_image = "remove";
      } else if (profileImage && profileImage.startsWith("file://")) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        formData.profile_image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } else if (profileImage && profileImage.startsWith("data:")) {
        formData.profile_image = profileImage;
      }

      const response = await fetch(
        `${API_BASE_URL}/update_profile/${currentUserId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Update mislukt");
      }

      const responseData = await response.json();
      console.log("Succesvol bijgewerkt:", responseData);
      setSaveMessage("Profiel succesvol opgeslagen!");
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Fout bij opslaan:", error);
      setSaveMessage("Er is een fout opgetreden bij het opslaan.");
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }
  };

  const debouncedCheckEmail = useDebouncedCallback((email: string) => {
    if (!email) {
      setEmailStatus({ checking: false, message: "" });
      return;
    }

    setEmailStatus({ checking: true, message: "Controleren..." });

    fetch(`${API_BASE_URL}/check_email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        current_user_id: userId,
      }),
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
        console.error("Error:", error);
        setEmailStatus({ checking: false, message: "Fout bij controleren" });
      });
  }, 800);

  const debouncedCheckUsername = useDebouncedCallback((username: string) => {
    if (!username) {
      setUsernameStatus({ checking: false, message: "" });
      return;
    }

    setUsernameStatus({ checking: true, message: "Controleren..." });

    fetch(`${API_BASE_URL}/check_username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        current_user_id: userId,
      }),
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
  }, 800);

  const usernameStatusStyle = [
    styles.statusMessage,
    usernameStatus.checking && styles.statusChecking,
    usernameStatus.available === true && styles.statusAvailable,
    usernameStatus.available === false && styles.statusUnavailable,
  ];

  const emailStatusStyle = [
    styles.statusMessage,
    emailStatus.checking && styles.statusChecking,
    emailStatus.available === true && styles.statusAvailable,
    emailStatus.available === false && styles.statusUnavailable,
  ];

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
                onPress={() => router.navigate("/account/profile")}
              >
                <Icon name="arrow-back" size={24} color={COLORS.text} />
              </TouchableOpacity>

              <View style={styles.profileImageContainer}>
                <ImageUploader
                  image={profileImage}
                  onImageSelected={setProfileImage}
                />
              </View>

              <Text style={styles.logoTitle}>PROFIEL BEWERKEN</Text>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon
                    name="person-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>Voornaam</Text>
                </View>
                <TextInput
                  value={first_name}
                  onChangeText={setFirstName}
                  style={styles.input}
                  selectionColor={COLORS.red}
                  placeholderTextColor={COLORS.placeholderText}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon
                    name="people-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>Achternaam</Text>
                </View>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  selectionColor={COLORS.red}
                  placeholderTextColor={COLORS.placeholderText}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon
                    name="mail-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>E-mail</Text>
                </View>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    debouncedCheckEmail(text);
                  }}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor={COLORS.red}
                  placeholderTextColor={COLORS.placeholderText}
                />
                {emailStatus.checking ? (
                  <Text style={emailStatusStyle}>Controleren...</Text>
                ) : emailStatus.message ? (
                  <Text style={emailStatusStyle}>{emailStatus.message}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon
                    name="at-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>Gebruikersnaam</Text>
                </View>
                <TextInput
                  value={username}
                  onChangeText={(text) => {
                    setUserName(text);
                    debouncedCheckUsername(text);
                  }}
                  style={styles.input}
                  autoCapitalize="none"
                  selectionColor={COLORS.red}
                  placeholderTextColor={COLORS.placeholderText}
                />
                {usernameStatus.checking ? (
                  <Text style={usernameStatusStyle}>Controleren...</Text>
                ) : usernameStatus.message ? (
                  <Text style={usernameStatusStyle}>
                    {usernameStatus.message}
                  </Text>
                ) : null}
              </View>

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
                        Je naam en e-mailadres worden niet weergegeven op je
                        account, maar je gebruikersnaam is wel zichtbaar voor
                        anderen.
                      </Text>
                    </View>
                  )}
                  <Text style={styles.toggleLabel}>Privéaccount</Text>
                </View>
                <Switch
                  value={AccountPublic}
                  onValueChange={(value) => setAccountPublic(value)}
                />
              </View>

              {saveMessage ? (
                <Text style={styles.saveMessage}>{saveMessage}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={saveProfile}
              >
                <Icon
                  name="save-outline"
                  size={20}
                  color={COLORS.textLight}
                  style={styles.buttonIcon}
                />
                <Text style={styles.actionButtonText}>Profiel Opslaan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.backToProfileButton]}
                onPress={() => router.navigate("/account/profile")}
              >
                <Icon
                  name="person-outline"
                  size={20}
                  color={COLORS.textLight}
                  style={styles.buttonIcon}
                />
                <Text style={styles.actionButtonText}>Terug naar Profiel</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>WACHTWOORD WIJZIGEN</Text>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon
                    name="lock-closed-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>Huidig Wachtwoord</Text>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    selectionColor={COLORS.red}
                    placeholderTextColor={COLORS.placeholderText}
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
                <View style={styles.labelContainer}>
                  <Icon
                    name="lock-open-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>Nieuw Wachtwoord</Text>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                    secureTextEntry={!showNewPassword}
                    selectionColor={COLORS.red}
                    placeholderTextColor={COLORS.placeholderText}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowNewPassword(!showNewPassword)}
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
                <View style={styles.labelContainer}>
                  <Icon
                    name="checkmark-done-outline"
                    size={16}
                    color={COLORS.red}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.inputLabel}>
                    Bevestig Nieuw Wachtwoord
                  </Text>
                </View>
                <TextInput
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  style={styles.input}
                  secureTextEntry
                  selectionColor={COLORS.red}
                  placeholderTextColor={COLORS.placeholderText}
                />
              </View>

              <ErrorMessage
                message={passwordChangeMessage}
                type={passwordChangeMessageType}
              />

              <TouchableOpacity
                style={[styles.actionButton, styles.changePasswordButton]}
                onPress={handleChangePassword}
              >
                <Icon
                  name="key-outline"
                  size={20}
                  color={COLORS.textLight}
                  style={styles.buttonIcon}
                />
                <Text style={styles.actionButtonText}>Wachtwoord Wijzigen</Text>
              </TouchableOpacity>
            </View>
          </Container>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 40,
    textTransform: "uppercase",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 25,
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
    borderBottomColor: COLORS.inputLine,
  },
  actionButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  changePasswordButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statusMessage: {
    fontSize: 12,
    marginTop: 4,
  },
  statusChecking: {
    color: COLORS.placeholderText,
  },
  statusAvailable: {
    color: "green",
  },
  statusUnavailable: {
    color: COLORS.error,
  },
  saveMessage: {
    color: COLORS.success,
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backToProfileButton: {
    backgroundColor: COLORS.placeholderText,
    marginTop: 10,
  },
  toggleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  tooltipWeb: {
    // hier kan andere styling voor web
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
  },
});
