import React, { useState } from 'react';
import { View, Pressable, Image, StyleSheet, Text } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const ProductImageViewer = ({ imageUrl }) => {
  const [isImageVisible, setImageVisible] = useState(false);

  return (
    <View>
      <Pressable onPress={() => setImageVisible(true)}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </Pressable>

      <ImageViewing
        images={[{ uri: imageUrl }]}
        imageIndex={0}
        visible={isImageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  placeholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#999',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProductImageViewer;
