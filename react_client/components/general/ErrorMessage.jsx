import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const COLORS = {
  success: "#4CAF50",
  error: "#D32F2F",
};

const ErrorMessage = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      {type === "error" && (
        <Icon
          name="alert-circle-outline"
          size={16}
          color={COLORS.error}
          style={styles.icon}
        />
      )}
      {type === "success" && (
        <Icon
          name="checkmark-circle-outline"
          size={16}
          color={COLORS.success}
          style={styles.icon}
        />
      )}
      <Text style={[
        styles.messageText,
        type === "success" ? styles.successText : styles.errorText,
      ]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    marginRight: 5,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'left',
  },
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
});

export default ErrorMessage;