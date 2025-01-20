import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { formatPrice } from '@/config/helpers/formatPrice';
import colors from '@/config/helpers/colors';

interface FormaPagoPlan {
  CodForPago: string;
  NCuota: number;
  Interes: number;
}

interface GroupedTarjetas {
  [key: string]: FormaPagoPlan[];
}

interface ProductPricingProps {
  Producto: string;
  Precio: number;
  formaPagoPlanes: FormaPagoPlan[];
  findFormaPagoById: (id: string) => { FormaPago: string } | undefined;
}

const ProductPricing = ({
  Producto,
  Precio,
  formaPagoPlanes,
  findFormaPagoById,
}: ProductPricingProps) => {
  const precioLista = Precio;
  const precioContado = precioLista * 0.82; // 18% de descuento
  const precioDebito = precioLista * 0.9; // 10% de descuento
  const arrayCreditos = ['CRE', 'TNA', 'TNP', 'TVI']; // Códigos de crédito permitidos

  // Agrupar planes de pago por código de forma de pago
  const groupedTarjetas: GroupedTarjetas = formaPagoPlanes.reduce(
    (acc, tarjeta) => {
      if (arrayCreditos.includes(tarjeta.CodForPago)) {
        if (!acc[tarjeta.CodForPago]) acc[tarjeta.CodForPago] = [];
        acc[tarjeta.CodForPago].push(tarjeta);
      }
      return acc;
    },
    {}
  );

  // Calcular el total para cada tarjeta
  const calculateTotal = (tarjeta: FormaPagoPlan) => {
    const cuota =
      (precioLista * (1 + (tarjeta.Interes / 100) * tarjeta.NCuota)) /
      tarjeta.NCuota;
    return cuota * tarjeta.NCuota;
  };

  // Estado para controlar la expansión/colapso de los grupos
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>(
    () => Object.keys(groupedTarjetas).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const toggleGroup = (codTarjeta: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [codTarjeta]: !prev[codTarjeta],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.pricesContainer}>
        <Text style={styles.price}>Contado: {formatPrice(precioContado)}</Text>
        <Text style={styles.price}>Débito: {formatPrice(precioDebito)}</Text>
        <Text style={styles.price}>Lista: {formatPrice(precioLista)}</Text>
      </View>
      {/* Renderizar tablas agrupadas */}
      {Object.entries(groupedTarjetas).map(([codTarjeta, group]) => {
        const formaPago = findFormaPagoById(codTarjeta)?.FormaPago || 'Sin nombre';
        const isExpanded = expandedGroups[codTarjeta];

        return (
          <View key={codTarjeta} style={styles.card}>
            <TouchableOpacity onPress={() => toggleGroup(codTarjeta)}>
              <Text style={styles.cardTitle}>
                {formaPago} - {codTarjeta}
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.table}>
                {/* Encabezados */}
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Cuotas</Text>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Importe Cuota</Text>
                  <Text style={[styles.tableCell, styles.tableHeader]}>Total</Text>
                </View>
                {/* Filas */}
                {group.map((tarjeta) => (
                  <View key={tarjeta.NCuota} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{tarjeta.NCuota}</Text>
                    <Text style={styles.tableCell}>
                      {formatPrice(
                        tarjeta.NCuota === 1
                          ? precioLista * (1 + tarjeta.Interes / 100)
                          : (precioLista *
                              (1 + (tarjeta.Interes / 100) * tarjeta.NCuota)) /
                            tarjeta.NCuota
                      )}
                    </Text>
                    <Text style={[styles.tableCell, styles.totalCell]}>
                      {formatPrice(calculateTotal(tarjeta))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  price: {
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.neutral.dark,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.dark,
    marginBottom: 8,
  },
  table: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#FFF',
  },
  tableHeader: {
    fontWeight: 'bold',
    color: colors.neutral.dark
  },
  totalCell: {
    fontWeight: 'bold',
    color: colors.primary.dark,
  },
});

export default ProductPricing;
