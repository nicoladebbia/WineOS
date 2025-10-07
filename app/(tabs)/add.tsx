import React from 'react';
import { View, StyleSheet } from 'react-native';
import WineForm from '@/components/WineForm';
import Colors from '@/constants/colors';

export default function AddWineScreen() {
  return (
    <View style={styles.container}>
      <WineForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});