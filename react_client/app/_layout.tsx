import { Stack } from 'expo-router';
import {useEffect, useState} from "react";
import {ScrollView, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import NavBar from "@/components/general/NavBar";
import TagContainer from "@/components/general/TagContainer";
import { getApiBaseUrl } from '@/constants/get_ip';

export default function RootLayout() {
  const [visible, setVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState({});
  const API_BASE_URL = getApiBaseUrl();

  const handleInsidePress = () => {
    setVisible(true);
  }
  const handleClose = () => {
    setVisible(false);
  }

  return (

  <View style={styles.pageContainer}>

    <View style={styles.navbarContainer} >
        <NavBar
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

    <TouchableWithoutFeedback onPress={handleClose}>
      <ScrollView style={styles.contentContainer}>
        <Stack>
          <Stack.Screen
              name='account/profile'
              options={{headerShown:false,}}
          />
          <Stack.Screen
              name="index"
              options={{headerShown: false,}}
          />
          <Stack.Screen
              name="posts"
              options={{headerShown: false,}}
          />
          <Stack.Screen
            name="posts/list_favorite"
            options={{headerShown:false,}}
          />
          <Stack.Screen
              name="posts/most_upvoted"
              options={{headerShown:false,}}
          />
          <Stack.Screen
              name="posts/create_post"
              options={{headerShown:false,}}
          />
          <Stack.Screen
              name="posts/edit_post"
              options={{headerShown:false,}}
          />

        </Stack>
      </ScrollView>
    </TouchableWithoutFeedback>
  </View>
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
  }
})