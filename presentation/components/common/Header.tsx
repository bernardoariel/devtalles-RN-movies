import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import colors from '@/config/helpers/colors';
import SearchInput from '@/presentation/components/products/SearchInput';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  searchTerm?: string;
  onChangeSearchTerm?: (text: string) => void;
  onClear?: () => void;
  onNavigate?: () => void;
  onLogout: () => void;
  title?: string;
  showSearch?: boolean;
  onBackPress?: () => void;
  titleSize?: number;
  extraMenuItems?: { label: string; action: () => void; icon?: React.ReactNode }[];

}

const Header = ({
  searchTerm,
  onChangeSearchTerm,
  onClear,
  onNavigate,
  onLogout,
  title = 'Buscador de Precios',
  showSearch = true,
  onBackPress,
  titleSize,
  extraMenuItems
}: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        )}
        <Image
          source={require('@/assets/images/abrilCuore.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { fontSize: titleSize ?? 20 }]}>
  {title}
</Text>
<Menu
  visible={menuVisible}
  onDismiss={() => setMenuVisible(false)}
  anchor={
    <TouchableOpacity
      onPress={() => setMenuVisible(true)}
      style={styles.menuButton}
    >
      <Ionicons name="ellipsis-vertical" size={28} color={colors.neutral.dark} />

    </TouchableOpacity>
  }
>
  {/* Renderizar items extra (compartir texto, PDF, etc.) */}
  {extraMenuItems?.map((item, index) => (
    <Menu.Item
      key={index}
      onPress={() => {
        setMenuVisible(false);
        setTimeout(() => {
          item.action();
        }, 100);
      }}
      title={item.label}
      leadingIcon={() => item.icon}// Icono del lado izquierdo
    />
  ))}

  {/* Opción fija para "Cerrar Sesión" */}
  <Menu.Item
    onPress={() => {
      setMenuVisible(false);
      setTimeout(() => {
        onLogout();
      }, 100);
    }}
    title="Cerrar Sesión"
    leadingIcon="logout" // Icono de MaterialCommunityIcons
  />
</Menu>


      </View>
      {showSearch && searchTerm !== undefined && onChangeSearchTerm && onClear && onNavigate && (
        <SearchInput
          value={searchTerm}
          onChange={onChangeSearchTerm}
          onClear={onClear}
          onNavigate={onNavigate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16, // Cambiar de 20 a 16
        fontWeight: 'bold',
        color: colors.neutral.dark,
        flexShrink: 1, // Para que se ajuste si es largo
      },
  header: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: -8, // Lo empuja hacia el borde derecho sin afectar el resto
  },
  menuIcon: {
    fontSize: 28, // Hacer el icono un poco más grande
    color: colors.neutral.dark,
  },
  
  logo: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
  },
 
  backButton: {
    fontSize: 35,
    color: colors.neutral.dark,
    marginRight: 8,
  },
});

export default Header;
