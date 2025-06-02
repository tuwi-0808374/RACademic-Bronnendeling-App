import React, { useState, useEffect, use } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Button } from 'react-native';
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

  useEffect(() => {
    fetchUser();
  }, []);

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

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  const banUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ban_user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('User banned:', data);

      fetchUsers();

    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const unbanUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/unban_user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('User unbanned:', data);

      fetchUsers();

    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const makeAdmin = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/make_admin/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('User is admin:', data);

      fetchUsers();

    } catch (error) {
      console.error('Error admin user:', error);
    }
  };

  const removeAdmin = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/remove_admin/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('User not admin anymore:', data);

      fetchUsers();

    } catch (error) {
      console.error('Error removing admin user:', error);
    }
  };

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar />
      <ScrollView>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 16 }}>Gebruikers lijst</Text>
        </View>
        {isAdmin && ( 
          <Button onPress={() => router.push("/account/admin_account")}
          title="Admin account toevoegen"
          color="green"
        />
        )}
        {users.map((user) => (
          <TouchableOpacity
            style={styles.user}
            key={user['id']}
            onPress={() =>
              router.push({
                pathname: '/account/profile',
                params: { user_id: user['id'] },
              })
            }
          >
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
                <>
                  {user['is_banned'] ? (
                    <View style={styles.button_green}>
                      <Text
                        style={styles.buttontext}
                        onPress={() => {
                          unbanUser(user['id']);
                        }}
                      >
                        Blokkering opheffen
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.button_red}>
                      <Text
                        style={styles.buttontext}
                        onPress={() => {
                          banUser(user['id']);
                        }}
                      >
                        Blokkeer gebruiker
                      </Text>
                    </View>
                  )}

                  {user['is_admin'] ? (
                    <View style={styles.button_red}>
                      <Text
                        style={styles.buttontext}
                        onPress={() => {
                          removeAdmin(user['id']);
                        }}
                      >
                        Verwijder admin rechten
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.button_green}>
                      <Text
                        style={styles.buttontext}
                        onPress={() => {
                          makeAdmin(user['id']);
                        }}
                      >
                        Maak user admin
                      </Text>
                    </View>
                  )}
                </>
              ) : null}
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
  },
  button_red: {
    backgroundColor: '#C80032',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button_green: {
    backgroundColor: 'green',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttontext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});