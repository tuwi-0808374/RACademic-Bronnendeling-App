import { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { getApiBaseUrl } from '@/constants/get_ip';

const UserBadges = ({ userID = 0 }) => {
  const API_BASE_URL = getApiBaseUrl();
  const [badges, setBadges] = useState([]);
  // Bron om toe tevoegen aan state array: https://react.dev/learn/updating-arrays-in-state
  // Bron voor popup maken: https://reactnative.dev/docs/modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modelBadge, setModelBadge] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (userID !== 0) {
          await refreshBadges(userID);
          return;
        }

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('Geen token gevonden.');
          return;
        }
        const decoded_user = jwt_decode(token);
        const userId = decoded_user.user_id;

        await refreshBadges(userId);
        await checkForNewBadges(userId);
      } catch (error) {
        console.error('Error loading badges:', error);
      }
    };
    fetchAll();
  }, []);

  const refreshBadges = async (userId) => {
    try {
      let url = `${API_BASE_URL}/badge/${userId}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      const result = await response.json();
      setBadges(result.data);
      console.log('Badges:', result.data);
    } catch (error) {
      console.error('API request refresh badges failed:', error);
    }
  };

  const checkForNewBadges = async (userId) => {
    try {
      let url = `${API_BASE_URL}/badge/check_eligibility/${userId}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      const result = await response.json();
      console.log('Badges:', result.data);
      if (result.data && result.data.length > 0) {
        console.log('Je hebt een nieuwe badge!');
        let badge_info = result.data[0];
        badge_info['message'] = 'Je hebt een nieuwe badge verdiend!';
        setModelBadge(badge_info);
        setModalVisible(true);

        refreshBadges(userId);
      } else {
        console.log('Geen nieuwe badges.');
      }
    } catch (error) {
      console.error('API request check for new badges failed:', error);
    }
  };

  const showBadgeInfo = (badge_id) => {
    console.log('Badge info clicked: ' + badge_id);
    let badge_info = badges.find(badge => badge.id === badge_id);
    badge_info['message'] = '';
    setModelBadge(badge_info);
    setModalVisible(true);
  };

  const modalBadgeInfo = () => {
    return (
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
            <Text style={styles.modalText}>{modelBadge.title}</Text>
            {modelBadge.message !== '' && (
              <Text style={styles.modalText}>{modelBadge.message}</Text>
            )}
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
    );
  };

  return (
    <>
      {modalBadgeInfo()}
      {badges === undefined ? null : (
        <View style={styles.badges}>
          {badges.map((badge, i) => (
            <Text key={badge.id}>
              <TouchableOpacity onPress={() => showBadgeInfo(badge.id)}>
                <Image
                  source={{ uri: `${API_BASE_URL}/static/badges/${badge.image_url}` }}
                  style={styles.badge}
                />
              </TouchableOpacity>
            </Text>
          ))}
        </View>
      )}
    </>
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