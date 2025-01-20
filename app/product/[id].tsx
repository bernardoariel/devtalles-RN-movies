import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProduct } from '../../presentation/hooks/useProducto';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatImageUrl } from '../../config/helpers/url.helper';
import colors from '@/config/helpers/colors';
import { useMarcas } from '@/presentation/hooks/useMarcas';
import { useSucursales } from '@/presentation/hooks/useSucursales';
import { formatPrice } from '../../config/helpers/formatPrice';
import ProductPricing from '@/presentation/components/products/productPricing';
import { useFormaPagoPlanes } from '@/presentation/hooks/useFormaPagoPlanes';
import { useFormaPago } from '@/presentation/hooks/useFormaPago';

const screenHight = Dimensions.get('window').height;

const ProductScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { formaPagoPlanes, isLoading: isLoadingPlanes } = useFormaPagoPlanes();
  const { findFormaPagoById, isLoading: isLoadingFormaPago } = useFormaPago();
  const { producto, isLoading, isError } = useProduct({ id: Number(id) });

  const imageUrl = formatImageUrl(producto?.Imagen);
  const { marcas,findMarcasById } = useMarcas()
  const { findSucursalById } = useSucursales();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando producto...</Text>
        <ActivityIndicator color="#FF8C00" size="large" />
      </View>
    );
  }

  if (isError || !producto) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar el producto.</Text>
        <Pressable onPress={() => router.reload()} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Contenido desplazable */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Contenedor de la imagen con gradiente, botón y badges */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Sin imagen</Text>
            </View>
          )}
          {/* Badge del código */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{producto.CodProducto}</Text>
          </View>
          <LinearGradient
            colors={['rgba(255,165,0,0.5)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
          <View style={styles.backButton}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="#FF8C00" />
            </Pressable>
          </View>
        </View>
        <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>{producto.Stock > 0 ? `${producto.Stock} Unidades` : 'Sin stock'}</Text>
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productTitle}>{producto.Producto}</Text>
          <Text style={styles.productDescription}>{producto.Descripcion}</Text>
          <View style={styles.rowContainer}>
            <Text style={[styles.detail, styles.whiteText]}>{producto.Medida}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {findMarcasById(producto.CodMarca)?.Marca || 'Desconocida'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sucursalesContainer}>
          <Text style={styles.sucursalesTitle}>Disponibilidad por sucursal:</Text>
          {producto.Sucursales.map((sucursal) => {
            const sucursalData = findSucursalById(sucursal.CodSucursal);
            return (
              <View key={sucursal.CodSucursal} style={styles.sucursalRow}>
                <Text style={styles.sucursalText}>
                  {sucursalData?.NombreSuc || 'Sucursal desconocida'} ({sucursal.Cantidad})
                </Text>
              </View>
            );
          })}
        </View>
        <ProductPricing
      Producto={producto.Producto}
      Precio={producto.Precio}
      formaPagoPlanes={formaPagoPlanes}
      findFormaPagoById={findFormaPagoById}
    />
      </ScrollView>
      
      {/* Contenedor fijo para el precio */}
      <View style={styles.fixedDetailsContainer}>
        <Text style={styles.priceText}>Precio de lista {formatPrice(producto.Precio)}</Text>
      </View>
    </View>
  );
  
};

// Estilos
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#FF8C00',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: screenHight * 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
    top: 40,
    left: 10,
    elevation: 9,
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
  stockBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: screenHight * 0.4 - 20, // Posicionado en la mitad entre la imagen y el siguiente div
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 3,
    elevation: 5,
  },
  stockBadgeText: {
    color: colors.neutral.dark,
    fontSize: 14,
    fontWeight: 'bold',
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
  productInfoContainer: {
    backgroundColor: colors.neutral.dark, // Asegúrate de que el contenedor tenga un fondo
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 24, // Redondear el borde inferior izquierdo
    borderBottomRightRadius: 24, // Redondear el borde inferior derecho
    overflow: 'hidden', // Garantiza que el contenido respete los bordes redondeados
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
    color: colors.primary.light,
  },
  productDescription: {
    fontSize: 16,
    color: colors.primary.dark,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 16,
    // backgroundColor: '#f9f9f9',
    backgroundColor: colors.primary.main,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginVertical: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que ocupe todo el ancho del contenedor
    paddingHorizontal: 16, // Opcional: añade espacio a los lados
    paddingTop:5,
  },
  whiteText: {
    color: '#fff', // Texto blanco
  },
  
  badgeContainer: {
    backgroundColor: colors.primary.main, // Fondo del badge
    paddingHorizontal: 10, // Espaciado horizontal
    paddingVertical: 4, // Espaciado vertical
    borderRadius: 12, // Bordes redondeados
    alignItems: 'center', // Centrar el texto
  },
 
  centerPrice: {
  justifyContent: 'center', // Centrar verticalmente
  alignItems: 'center', // Centrar horizontalmente
},

priceText: {
  fontSize: 20, // Tamaño del texto del precio
  fontWeight: 'bold', // Negrita para destacar el precio
  color: colors.neutral.dark // Texto blanco
},
debugText: {
  fontSize: 12,
  color: '#333', // Color gris para mejor legibilidad
  marginTop: 10,
  backgroundColor: '#f5f5f5', // Fondo para distinguir el JSON
  padding: 10,
  borderRadius: 8,
  fontFamily: 'monospace', // Fuente monospace para que sea más claro
},
/* sucursalesContainer: {
  marginTop: 16,
  paddingHorizontal: 16,
}, */
/* sucursalesTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#333',
}, */
/* sucursalText: {
  fontSize: 16,
  marginVertical: 4,
  color: '#555',
}, */
sucursalesContainer: {
  marginTop: 16,
  paddingHorizontal: 16,
},
sucursalesTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#333',
},
sucursalRow: {
  marginBottom: 8, // Espaciado entre filas
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: '#f5f5f5', // Color de fondo para cada fila
  borderRadius: 8, // Bordes redondeados
  borderWidth: 1,
  borderColor: '#ddd', // Color del borde
},
sucursalText: {
  fontSize: 12,
  color: '#555',
},
fixedDetailsContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: colors.primary.main,
  padding: 16,
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: '#ddd',
},

});

export default ProductScreen;
