import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, StatusBar, Image } from 'react-native';
import colors from '@/config/helpers/colors';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onBackPress: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable style={styles.favoriteButton}>
        <Image
          source={require('@/assets/images/abrilCuore.png')}
          style={styles.favoriteIcon}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: Platform.OS === 'android' ? 56 + StatusBar.currentHeight! : 56,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colors.primary.main,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.dark,
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  favoriteIcon: {
    width: 35, // Ajusta el tamaño de la imagen
    height: 35,
  },
});

export default HeaderComponent;
