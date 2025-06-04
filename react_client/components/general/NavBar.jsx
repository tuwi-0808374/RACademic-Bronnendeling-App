import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import SearchBar from './SearchBar';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserStatusContext } from "@/app/_layout";

export default function NavBar(props) {
  const setUserLoggedIn = useContext(UserStatusContext);

  const exitLogout = async (props) => {
    await AsyncStorage.removeItem('authToken');
    setUserLoggedIn(false);
    props.router.push('/');
  }

  return (
      <View style={Platform.OS === 'web' ? styles.navbarContent : styles.navbarContentPhone}>
        {Platform.OS === 'web' ? (
                <TouchableOpacity onPress={() => {
                  props.handleClose();
                  props.handleSideBarState();
                }}>
                  <Ionicons name={'menu'} color={'#fff'} size={30} style={styles.icon} />
                </TouchableOpacity>
            )
            : null}
        <SearchBar
            visible={props.visible}
            setVisible={props.setVisible}
            selectedTags={props.selectedTags}
            handleInsidePress={props.handleInsidePress}
        />
        {Platform.OS === 'web' ? (
                <View style={styles.spacer}>
                  <TouchableOpacity onPress={() => {
                    props.handleClose();
                    props.router.push('/account/profile');
                  }}>
                    <Ionicons name="person" size={32} color="white" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      props.handleClose();
                      exitLogout(props);
                  }} style={styles.routeContainer}
                  >
                    <Ionicons name="exit" size={32} color="white" style={styles.icon} />
                  </TouchableOpacity>
                </View>
            )
            : null}
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: '#222', 
  },
  navbarContentPhone: {
    justifyItems: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: 15,
    flex: 1,
    width: '100%',
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: '#222',
  },
  icon: {
    margin: 15,
    color: 'white',
  },
  spacer: {
    flexDirection: 'row',
  }
});

