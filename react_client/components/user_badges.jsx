import { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { getApiBaseUrl } from '../constants/get_ip';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const UserBadges = () => {
  const API_BASE_URL = getApiBaseUrl();
  const [badges, setBadges] = useState([]);
  // Bron voor popup maken: https://reactnative.dev/docs/modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modelBadge, setModelBadge] = useState({});

  useEffect(() => {
      refreshBadges();
  }, []);

  const refreshBadges = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('Geen token gevonden.');
        return;
      }

      const decoded_user = jwt_decode(token);
      const user_id = decoded_user.user_id;

      url = `${API_BASE_URL}/badge/${user_id}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      const result = await response.json();
      setBadges(result.data);
      console.log('Badges:', result.data);

    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const [showInfo, setShowInfo] = useState(false);
  const showBadgeInfo = (badge_id) => {
    console.log('Badge info clicked: ' + badge_id);
    let badge_info = badges.find(badge => badge.id === badge_id);
    setModelBadge(badge_info);
    setModalVisible(true);
    // setShowInfo(!showInfo);
  }

  return (
    <View style={styles.badges}>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modelBadge.id}</Text>
              <Image 
                    source={{ uri: `${API_BASE_URL}/static/badges/${modelBadge.image_url}` }}
                    style={styles.badge}
                />
              <Text style={styles.modalText}>{modelBadge.requirement}</Text> 
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Sluit bericht</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
          {badges === undefined ? (
            <Text>Je hebt nog geen badges.</Text>
          ) : (
            badges.map((badge, i) => (
              <Text key={badge.id}>
                <TouchableOpacity onPress={() => showBadgeInfo(badge.id)}>
                <Image 
                    source={{ uri: `${API_BASE_URL}/static/badges/${badge.image_url}` }}
                    style={styles.badge}
                  />
                </TouchableOpacity>
                  {/* {showInfo && (
                    <Text>
                      {badge['requirement']}
                    </Text>
                  )} */}
              </Text>
            ))
          )}
        {/* <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    margin: 6,
    width: 50,
    height: 50,
  },
  badges: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    maxWidth: 320,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default UserBadges;