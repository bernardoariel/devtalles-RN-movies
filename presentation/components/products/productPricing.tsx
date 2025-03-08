import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { formatPrice } from '@/config/helpers/formatPrice';
import colors from '@/config/helpers/colors';
import useProductPricing from '@/presentation/hooks/useProductPrecing';


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

const ProductPricing = ({ Producto, Precio, formaPagoPlanes, findFormaPagoById }: ProductPricingProps) => {
  const { preciosFormateados } = useProductPricing(Precio);

  const arrayCreditos = ['CRE', 'TNA', 'TNP', 'TVI']; // Códigos de crédito permitidos

  // Agrupar planes de pago por código de forma de pago
  const groupedTarjetas: GroupedTarjetas = formaPagoPlanes.reduce<GroupedTarjetas>(
    (acc, tarjeta) => {
      if (arrayCreditos.includes(tarjeta.CodForPago)) {
        if (!acc[tarjeta.CodForPago]) {
          acc[tarjeta.CodForPago] = []; // Ahora TypeScript reconoce que es un array
        }
        acc[tarjeta.CodForPago].push(tarjeta);
      }
      return acc;
    },
    {} as GroupedTarjetas // Inicializamos el acumulador con el tipo correcto
  );

  // Calcular el total para cada tarjeta
  const calculateTotal = (tarjeta: FormaPagoPlan) => {
    const cuota =
      (Precio * (1 + (tarjeta.Interes / 100) * tarjeta.NCuota)) /
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
      {/* Sección de precios */}
      <View style={styles.priceContainer}>
        <View style={styles.priceBox}>
          <Text style={styles.priceTitle}>Contado</Text>
          <Text style={styles.priceValue}>{preciosFormateados.contado}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.priceTitle}>Débito</Text>
          <Text style={styles.priceValue}>{preciosFormateados.debito}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.priceTitle}>Lista</Text>
          <Text style={styles.priceValue}>{preciosFormateados.lista}</Text>
        </View>
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
                {group
                  .filter((tarjeta) =>
                    codTarjeta === 'CRE' ? [1, 3, 6, 12, 15, 18].includes(tarjeta.NCuota) : true
                  )
                  .map((tarjeta) => (
                    <View key={tarjeta.NCuota} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{tarjeta.NCuota}</Text>
                      <Text style={styles.tableCell}>
                        {formatPrice(
                          tarjeta.NCuota === 1
                            ? Precio * (1 + tarjeta.Interes / 100)
                            : (Precio *
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
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.neutral.dark,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  priceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary.light,
  },
  priceValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.neutral.dark,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.dark,
  },
  table: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: '#FFF',
    paddingVertical: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    color: colors.primary.light,
  },
  totalCell: {
    fontWeight: 'bold',
    color: colors.primary.dark,
  },
});

export default ProductPricing;
