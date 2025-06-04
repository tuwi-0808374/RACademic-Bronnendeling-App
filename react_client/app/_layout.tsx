import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, createContext, useContext, use } from "react";
import { Platform, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import NavBar from "@/components/general/NavBar";
import TagContainer from "@/components/general/TagContainer";
import { getApiBaseUrl } from '@/constants/get_ip';
import { UserProvider } from '@/constants/get_user_id';
import {MaterialIcons, FontAwesome, Ionicons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SideBar from "@/components/general/SideBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

interface JwtPayload {
  user_id: number;
}

// https://react.dev/reference/react/useContext
// https://forum.freecodecamp.org/t/react-context-api-pass-data-to-parent/467261
export const UserStatusContext = createContext<(loggedIn: boolean) => void>(() => {});

export default function Layout() {
  const [visible, setVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sideBarState, setSideBarState] = useState(false);
  const API_BASE_URL = getApiBaseUrl();
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setUserLoggedIn(false);
        router.push('/');
        console.log("No token found");
        return;
      }


      const decoded = jwt_decode<JwtPayload>(token);
      const targetUserId = decoded.user_id;
      const response = await fetch(`${API_BASE_URL}/profile/${targetUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setUserLoggedIn(false);
        router.push('/')
        throw new Error("Network response was not ok");
      }
      setUserLoggedIn(true);

    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleInsidePress = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const handleSideBarState = () => {
    if (sideBarState) {
      setSideBarState(false);
    } else {
      setSideBarState(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserStatusContext.Provider value={setUserLoggedIn}>
        <SideBar
          sideBarState={sideBarState}
          setSideBarState={setSideBarState}
        />
        <View style={styles.pageContainer}>
          {userLoggedIn && (
            <View style={styles.navbarContainer}>
              <NavBar
                visible={visible}
                setVisible={setVisible}
                handleInsidePress={handleInsidePress}
                handleClose={handleClose}
                selectedTags={selectedTags}
                API_BASE_URL={API_BASE_URL}
                sideBarState={sideBarState}
                handleSideBarState={handleSideBarState}
                router={router}
              />
              <TagContainer
                visible={visible}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </View>
          )}
          <UserProvider>
            <TouchableWithoutFeedback onPress={handleClose}>
              <View style={styles.contentContainer}>
                <Stack screenOptions={{ headerShown: false }} />
              </View>
            </TouchableWithoutFeedback>
            {Platform.OS !== 'web' && userLoggedIn ? (
              <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => router.push('/posts')}>
                  <MaterialIcons name="post-add" size={32} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/account/profile')}>
                  <FontAwesome name="user" size={32} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSideBarState}>
                  <Ionicons name={'menu'} size={30} color="black" />
                </TouchableOpacity>
              </View>
            ) : null}
          </UserProvider>
        </View>
      </UserStatusContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    elevation: 0,
    zIndex: 0,
    backgroundColor: 'red',
  },
  navbarContainer: {
    backgroundColor: 'black',
    width: '100%',
    height: Platform.OS === "web" ? '9%' : 70,
    elevation: 2,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    elevation: 1,
    zIndex: 1,
    backgroundColor: 'white',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderColor: '#ccc',
  }
});