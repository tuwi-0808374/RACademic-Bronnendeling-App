import { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const UserBadges = () => {

    const [badges, setBadges] = useState([]);
    const badgeImages = {
      'default_badge.png': require('../assets/images/badges/default_badge.png'),
      '5posts_badge.png': require('../assets/images/badges/5posts_badge.png'),
    };

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

      url = `http://localhost:5000/badge/${user_id}`;
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
    <>
          {badges.length === 0 ? (
            <Text>Je hebt nog geen badges.</Text>
          ) : (
            badges.map((badge, i) => (
              <Text >
                <Image key={i} onClick={() => showBadgeInfo()}
                    source={badgeImages[badge['image_url']]}
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
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    padding: 10,
    width: 50,
    height: 50,
  },
});

export default UserBadges;