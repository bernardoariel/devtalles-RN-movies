import React from 'react';
import { View, Image, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/config/helpers/colors';

const screenHight = Dimensions.get('window').height;

const ProductHeader = ({ onBack, productCode }) => {
  return (
    <View >
      {/* Botón de retroceso */}
      <View style={styles.backButton}>
        <Pressable onPress={onBack} style={styles.backPressable}>
          <Ionicons name="arrow-back" size={35} color="#FFF" />
        </Pressable>
      </View>
      {/* Badge del código del producto */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{productCode}</Text>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
    elevation: 5,
  },
  badgeText: {
    color: colors.neutral.dark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  backButton: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    left: 10,
    elevation: 9,
  },
  backPressable: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 100,
    marginStart: 15,
    padding: 6,
  },
});

export default ProductHeader;
