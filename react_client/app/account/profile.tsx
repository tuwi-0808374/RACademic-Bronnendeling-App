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
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UserBadges from "../../components/badges/user_badges";
import { getApiBaseUrl } from "@/constants/get_ip";
import { useFocusEffect } from "expo-router";
import Container from "../../components/general/Container";
import PostList from "../../components/account/PostList";

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
  is_admin: boolean;
}

interface UserData {
  id: number;
  is_public: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image_url?: string;
}

export default function PublicProfileScreen() {
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useLocalSearchParams();
  const profileUserId = params.user_id
    ? parseInt(params.user_id as string)
    : null;
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("Geen token gevonden.");
        return;
      }

      const decoded = jwt_decode<JwtPayload>(token);
      const currentUserId = decoded.user_id;
      setUserId(currentUserId);

      const targetUserId = profileUserId || decoded.user_id;

      const response = await fetch(`${API_BASE_URL}/profile/${targetUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const userData = responseData.data;
        if (userData) {
          setUserData(userData);
          setIsPublic(userData.is_public === 0);
          setUserName(userData.username || "");

          if (userData.is_public === 0 || targetUserId === decoded.user_id) {
            setFirstName(userData.first_name || "");
            setLastName(userData.last_name || "");
            setEmail(userData.email || "");
          } else {
            setFirstName("");
            setLastName("");
            setEmail("");
          }

          if (userData.profile_image_url) {
            setProfileImage(`${userData.profile_image_url}?${Date.now()}`);
          } else {
            setProfileImage(null);
          }
        }
      } else {
        console.log(`Kan profiel niet ophalen.`);
      }
    } catch (error) {
      console.log("Fout bij ophalen profiel:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [profileUserId])
  );

  const isOwnProfile =
    !profileUserId || (userId !== null && profileUserId === userId);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const targetUserId = profileUserId || userId;

      if (!targetUserId) return;

      const response = await fetch(
        `${API_BASE_URL}/posts_by_user_id/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserPosts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (userId || profileUserId) {
      fetchUserPosts();
    }
  }, [userId, profileUserId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={{ width: "100%" }}
        >
          <TouchableWithoutFeedback>
            <Container>
              {profileUserId ? (
                <View>
                  <UserBadges userID={profileUserId}></UserBadges>
                </View>
              ) : (
                <UserBadges userID={0}></UserBadges>
              )}
              <View style={styles.innerContainer} pointerEvents="box-none">
                <View style={styles.profileImageContainer}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/images/profile.png")}
                      style={styles.profileImage}
                    />
                  )}
                </View>

                <Text style={styles.logoTitle}>
                  {userId === profileUserId || !profileUserId
                    ? "JOUW PROFIEL"
                    : `PROFIEL VAN ${username}`}
                </Text>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={COLORS.red}
                      style={styles.labelIcon}
                    />
                    <Text style={styles.inputLabel}>Naam</Text>
                  </View>
                  {isPublic || userId === profileUserId || !profileUserId ? (
                    <Text style={styles.input}>
                      {first_name} {lastName}
                    </Text>
                  ) : (
                    <Text style={styles.input}>Privé account</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={16}
                      color={COLORS.red}
                      style={styles.labelIcon}
                    />
                    <Text style={styles.inputLabel}>E-mail</Text>
                  </View>
                  {isPublic || userId === profileUserId || !profileUserId ? (
                    <Text style={styles.input}>{email}</Text>
                  ) : (
                    <Text style={styles.input}>Privé account</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="at-outline"
                      size={16}
                      color={COLORS.red}
                      style={styles.labelIcon}
                    />
                    <Text style={styles.inputLabel}>Gebruikersnaam</Text>
                  </View>
                  <Text style={styles.input}>{username}</Text>
                </View>
                {(userId === profileUserId || !profileUserId) && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/account/edit_profile")}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={COLORS.textLight}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.actionButtonText}>
                      Profiel Bewerken
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>POSTS</Text>
                {loadingPosts ? (
                  <ActivityIndicator size="large" color={COLORS.red} />
                ) : (
                  <PostList
                    posts={userPosts}
                    showEdit={userId === (profileUserId || userId)}
                  />
                )}
              </View>
            </Container>
          </TouchableWithoutFeedback>
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
    minHeight: "100%",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    width: Platform.OS === "web" ? "75%" : "100%",
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
    width: Platform.OS === "web" ? "25%" : "100%",
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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.red,
  },
  changePasswordButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
  messageText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
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
  section: {
    width: "100%",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  noPostsText: {
    textAlign: "center",
    color: COLORS.text,
    marginVertical: 20,
  },
  debugBorder: {
    borderWidth: 1,
    borderColor: "red",
  },
});
