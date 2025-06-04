import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.webContainer}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    maxWidth: 1050,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});
