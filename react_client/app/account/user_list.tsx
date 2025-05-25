import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'expo-router';
import UserBadges from '../../components/user_badges';
import { getApiBaseUrl } from '../../constants/get_ip';

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } 
    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar/>
      <ScrollView>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 16 }}>User List</Text>
        </View>
        { users.map((user) => (
          <TouchableOpacity key={user['id']} onPress={() => console.log(`User ID: ${user['id']}`)}>
            <View>
              <Text>${user['profile_image']}</Text>
              <Text style={{ fontSize: 18 }}>{user['first_name']}</Text>
              <Image source={{ uri: user['profile_image'] }} style={{ width: 50, height: 50, borderRadius: 25 }} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
