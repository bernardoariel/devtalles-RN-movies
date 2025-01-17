import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import colors from '@/config/helpers/colors';
import { Ionicons } from '@expo/vector-icons';
import CircleArrow from '../CircleArrow';

interface SearchInputProps {
    value: string;
    onChange: (text: string) => void;
    onClear: () => void;
  }

  const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => {
    return (
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.primary.dark} />
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          placeholderTextColor={colors.primary.dark}
          value={value}
          onChangeText={onChange}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <CircleArrow />
          </TouchableOpacity>
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
    searchWrapper: {
      padding: 0, // Sin padding externo
    //   backgroundColor: colors.neutral.light,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary.light,
      borderRadius: 20, // Totalmente redondeado
      paddingHorizontal: 10,
      height: 40,
    },
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: colors.primary.dark,
      padding: 0, // Eliminar cualquier relleno interno
      margin: 0,  // Eliminar cualquier margen interno
    },
  });

export default SearchInput;
