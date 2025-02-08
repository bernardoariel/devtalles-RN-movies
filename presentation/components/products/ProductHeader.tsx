import React from 'react';
import { View, Image, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/config/helpers/colors';

const screenHight = Dimensions.get('window').height;

const ProductHeader = ({ imageUrl, onBack, productCode }) => {
  return (
    <View style={styles.imageContainer}>
     {/*  {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )} */}

      {/* Gradiente */}
      

      {/* Badge del código del producto */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{productCode}</Text>
      </View>

      {/* Botón de retroceso */}
      <View style={styles.backButton}>
        <Pressable onPress={onBack} style={styles.backPressable}>
          <Ionicons name="arrow-back" size={35} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    // height: screenHight * 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#999',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.neutral.dark,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
    elevation: 5,
  },
  badgeText: {
    color: colors.primary.light,
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
    top: 40,
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
