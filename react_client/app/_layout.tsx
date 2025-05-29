import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { Platform, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import NavBar from "@/components/general/NavBar";
import TagContainer from "@/components/general/TagContainer";
import { getApiBaseUrl } from '@/constants/get_ip';
import { UserProvider } from '@/constants/get_user_id';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  const [visible, setVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const API_BASE_URL = getApiBaseUrl();
  const router = useRouter();

  const handleInsidePress = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.pageContainer}>
        <View style={styles.navbarContainer}>
          <NavBar
              visible={visible}
              setVisible={setVisible}
              handleInsidePress={handleInsidePress}
              selectedTags={selectedTags}
              API_BASE_URL={API_BASE_URL}
          />
          <TagContainer
              visible={visible}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
          />
        </View>


        <UserProvider>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.contentContainer}>
              <Stack screenOptions={{ headerShown: false }} />
            </View>
          </TouchableWithoutFeedback>
          {Platform.OS !== 'web' ?  (
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