import { Stack, useRouter } from 'expo-router';
import { useEffect, useState, createContext, useContext, use } from "react";
import { Platform, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import NavBar from "@/components/general/NavBar";
import TagContainer from "@/components/general/TagContainer";
import { getApiBaseUrl } from '@/constants/get_ip';
import { UserProvider } from '@/constants/get_user_id';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SideBar from "@/components/general/SideBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

interface JwtPayload {
  sub: string;
  user_id: number;
  full_name?: string;
  iat: number;
  exp: number;
  jti: string;
  is_admin: boolean;
}

export const UserStatusContext = createContext<(loggedIn: boolean) => void>(() => {});

export default function Layout() {
  const [visible, setVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sideBarState, setSideBarState] = useState(false);
  const API_BASE_URL = getApiBaseUrl();
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(false);

  useEffect(() => {
    fetchUSerProfile();
  }, []);

  const fetchUSerProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
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
      throw new Error("Network response was not ok");
    }
    setUserLoggedIn(true);
    // const data = await response.json();
    // setUserData(data);
    // console.log("User profile fetched successfully:", data);

  }catch (error) {
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
    console.log(sideBarState);
  };

  return (
    <SafeAreaView style={{ flex: 1}}>    
      <SideBar
          sideBarState={sideBarState}
          setSideBarState={setSideBarState}
      />  
      <View style={styles.pageContainer}>
        { userLoggedIn && (
        <View style={styles.navbarContainer}>
            <NavBar
                visible={visible}
                setVisible={setVisible}
                handleInsidePress={handleInsidePress}
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
            <UserStatusContext.Provider value={() =>setUserLoggedIn(true)}>
              <View style={styles.contentContainer}>
                <Stack screenOptions={{ headerShown: false }}/>
              </View>
            </UserStatusContext.Provider>
          </TouchableWithoutFeedback>
          {Platform.OS !== 'web' && userLoggedIn ?  (
          <View style={styles.bottomBar}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <MaterialIcons name="home" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/posts')}>
              <MaterialIcons name="post-add" size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/account/profile')}>
              <FontAwesome name="user" size={32} color="black" />
            </TouchableOpacity>
          </View>
          ) : null
          }
        </UserProvider>
      </View>
      </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  pageContainer:{
    flex: 1,
    width: '100%',
    position: 'relative',
    elevation:0,
    zIndex:0,
    backgroundColor: 'red',
  },
  navbarContainer: {
    backgroundColor: 'black',
    width: '100%',
    height: '9%',
    elevation: 2,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex:1,
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
})