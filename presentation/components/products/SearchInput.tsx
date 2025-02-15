import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/config/helpers/colors';
import CircleArrow from '../CircleArrow';

interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  onNavigate: () => void; // Navegación a ResultsList
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear, onNavigate }) => {
  const showTimesIcon = value.length >= 3;

  return (
    <View style={styles.searchContainer}>
      {showTimesIcon ? (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={30} color={colors.primary.dark} />
        </TouchableOpacity>
      ) : (
        <Ionicons name="search" size={20} color={colors.primary.dark} />
      )}
      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        placeholderTextColor={colors.primary.dark}
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onNavigate}>
          <CircleArrow />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    borderRadius: 20, // Totalmente redondeado
    paddingHorizontal: 10,
    height: 40,
    marginTop:10
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.primary.dark,
    padding: 0, // Eliminar cualquier relleno interno
    margin: 0, // Eliminar cualquier margen interno
  },
});

export default SearchInput;
