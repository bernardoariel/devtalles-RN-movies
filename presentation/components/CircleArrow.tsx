import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/config/helpers/colors';

const CircleArrow = () => {
  return (
    <View style={styles.circle}>
      <Ionicons name="chevron-forward" size={25} color={colors.primary.light} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 35,
    height: 35,
    borderRadius: 20, // Hace que sea un círculo perfecto
    backgroundColor: colors.primary.dark, // Fondo del círculo
    justifyContent: 'center',
    alignItems: 'center', // Centra la flecha
  },
});

export default CircleArrow;
