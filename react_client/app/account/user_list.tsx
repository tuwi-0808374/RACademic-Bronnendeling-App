import React, { useState, useEffect, use } from 'react';
import {  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'expo-router';
import UserBadges from '../../components/user_badges';
import { getApiBaseUrl } from '../../constants/get_ip';

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const API_BASE_URL = getApiBaseUrl();
  const [userId, setUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  interface JwtPayload {
    sub: string;
    user_id: number;
    full_name?: string;
    iat: number;
    exp: number;
    jti: string;
    is_admin: boolean;
  }

  useEffect(() => {
    console.log('Loading user ID from AsyncStorage');
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('Geen token gevonden.');
          return;
        }
        const decoded = jwt_decode<JwtPayload>(token);
        const userID = decoded.user_id;
        setUserId(userID);
        const isAdmin = decoded.is_admin;
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error('Error loading badges:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('Fetching users for userId:', userId);
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(userId, isAdmin);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [userId]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar />
      <ScrollView>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 16 }}>Gebruikers lijst</Text>
        </View>
        {users.map((user) => (
          <TouchableOpacity style={styles.user} key={user['id']}>
            <View>
              <Text style={{ fontSize: 18 }}>{user['display_name']}</Text>
              <Text style={{ fontSize: 18 }}>{user['email']}</Text>
              <Text style={{ fontSize: 18 }}>
                {user['first_name']} {user['last_name']}
              </Text>

              <View style={styles.profileImageContainer}>
                {user['profile_image'] ? (
                  <Image
                    source={{ uri: `${API_BASE_URL}/uploads/${user['profile_image']}` }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/profile.png')}
                    style={styles.profileImage}
                  />
                )}
              </View>
              {isAdmin ? (
                <Button
                  title="Ban user"
                  onPress={() => console.log(`Ban user with ID: ${user['id']}`)}
                />
              ): null}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});