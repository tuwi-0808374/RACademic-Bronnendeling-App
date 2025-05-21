import { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { getApiBaseUrl } from '../constants/get_ip';

const UserBadges = () => {
  const API_BASE_URL = getApiBaseUrl();
  const [badges, setBadges] = useState([]);

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
  const showBadgeInfo = () => {
    setShowInfo(!showInfo);
  }

  return (
    <View style={styles.badges}>
          {badges === undefined ? (
            <Text>Je hebt nog geen badges.</Text>
          ) : (
            badges.map((badge, i) => (
              <Text key={badge['id']}>
                <Image onClick={() => showBadgeInfo()}
                    source={{ uri: `${API_BASE_URL}/static/badges/${badge.image_url}` }}
                    style={styles.badge}
                  />
                  {showInfo && (
                    <Text>
                      {badge['requirement']}
                    </Text>
                  )}
              </Text>
            ))
          )}
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
});

export default UserBadges;