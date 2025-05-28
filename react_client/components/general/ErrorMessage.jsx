import React from 'react';
import { Text, StyleSheet } from 'react-native';

const COLORS = {
  success: "#4CAF50",
  error: "#D32F2F",
};

const ErrorMessage = ({ message, type }) => {
  if (!message) {
    return null;
  }

  const messageStyle = [
    styles.messageText,
    type === "success" ? styles.successText : styles.errorText,
  ];

  return <Text style={messageStyle}>{message}</Text>;
};

const styles = StyleSheet.create({
  messageText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
});

export default ErrorMessage;
