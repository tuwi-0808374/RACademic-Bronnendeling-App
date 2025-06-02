import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import SearchBar from './SearchBar';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStatusContext } from "../../app/_layout";

export default function NavBar(props) {
  const setUserLoggedIn = useContext(UserStatusContext);

  const exitLogout = async (props) => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('authToken');
    setUserLoggedIn(false);
    props.router.push('/');
  }

  return (
    <View style={styles.navbarContent}>
      <TouchableOpacity onPress={props.handleSideBarState}>
        <Ionicons name={'menu'} color={'#fff'} size={30} style={styles.icon} />
      </TouchableOpacity>

      <SearchBar
        visible={props.visible}
        setVisible={props.setVisible}
        selectedTags={props.selectedTags}
        API_BASE_URL={props.API_BASE_URL}
        handleInsidePress={props.handleInsidePress}
      />

      <View style={styles.spacer}>
        <TouchableOpacity onPress={() => props.router.push('/account/profile')}>
          <Ionicons name="person" size={32} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => exitLogout(props)} style={styles.routeContainer}>
          <Ionicons name="exit" size={32} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {/*    profile knop enzo */}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    justifyItems: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    width: '100%',
    zIndex: 1,
    elevation: 1,
  },
  icon: {
    margin: 15,
    color: 'white',
  },
  spacer: {
    flexDirection: 'row',
    // width: 40,
  }
});