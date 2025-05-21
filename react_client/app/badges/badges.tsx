import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import UserBadges from '../../components/user_badges';

export default function Badges() {
  return (
      <UserBadges />
  );
};