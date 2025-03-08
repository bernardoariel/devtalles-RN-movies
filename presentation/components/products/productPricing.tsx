import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { formatPrice } from '@/config/helpers/formatPrice';
import colors from '@/config/helpers/colors';
import useProductPricing from '@/presentation/hooks/useProductPrecing';
import { Ionicons } from '@expo/vector-icons';

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
  onSelectCuotas: (selectedCuotas: SelectedCuota[]) => void;
}

interface SelectedCuota {
  NCuota: number;
  total: string;
  formaPago: string;
}

const ProductPricing = ({ Producto, Precio, formaPagoPlanes, findFormaPagoById, onSelectCuotas }: ProductPricingProps) => {
  const { preciosFormateados } = useProductPricing(Precio);
  const [selectedCuotas, setSelectedCuotas] = useState<SelectedCuota[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const arrayCreditos = ['CRE', 'TNA', 'TNP', 'TVI'];

  const groupedTarjetas: GroupedTarjetas = formaPagoPlanes.reduce<GroupedTarjetas>(
    (acc, tarjeta) => {
      if (arrayCreditos.includes(tarjeta.CodForPago)) {
        if (!acc[tarjeta.CodForPago]) acc[tarjeta.CodForPago] = [];
        acc[tarjeta.CodForPago].push(tarjeta);
      }
      return acc;
    },
    {} as GroupedTarjetas
  );

  const calculateTotal = (tarjeta: FormaPagoPlan) => {
    const cuota = (Precio * (1 + (tarjeta.Interes / 100) * tarjeta.NCuota)) / tarjeta.NCuota;
    return cuota * tarjeta.NCuota;
  };

  const toggleCuotaSelection = (tarjeta: FormaPagoPlan, formaPago: string) => {
    setSelectedCuotas((prev) => {
      const exists = prev.find((item) => item.NCuota === tarjeta.NCuota && item.formaPago === formaPago);
      if (exists) {
        return prev.filter((item) => item.NCuota !== tarjeta.NCuota || item.formaPago !== formaPago);
      }
      return [...prev, { NCuota: tarjeta.NCuota, total: formatPrice(calculateTotal(tarjeta)), formaPago }];
    });
  };

  const toggleGroup = (codTarjeta: string) => {
    setExpandedGroups((prev) => ({ ...prev, [codTarjeta]: !prev[codTarjeta] }));
  };

  React.useEffect(() => {
    onSelectCuotas(selectedCuotas);
  }, [selectedCuotas]);

  return (
    <ScrollView style={styles.container}>
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

      {Object.entries(groupedTarjetas).map(([codTarjeta, group]) => {
        const formaPago = findFormaPagoById(codTarjeta)?.FormaPago || 'Sin nombre';
        return (
          <View key={codTarjeta} style={styles.card}>
            <TouchableOpacity onPress={() => toggleGroup(codTarjeta)}>
              <Text style={styles.cardTitle}>{formaPago} - {codTarjeta}</Text>
            </TouchableOpacity>

            {expandedGroups[codTarjeta] && (
              <View style={styles.table}>
                {group.map((tarjeta) => (
                  <TouchableOpacity key={tarjeta.NCuota} onPress={() => toggleCuotaSelection(tarjeta, formaPago)} style={styles.row}>
                    <Ionicons name={selectedCuotas.some((c) => c.NCuota === tarjeta.NCuota && c.formaPago === formaPago) ? 'checkbox' : 'square-outline'} size={20} color="white" />
                    <Text style={styles.tableCell}>{tarjeta.NCuota} cuotas</Text>
                    <Text style={styles.tableCell}>{formatPrice(calculateTotal(tarjeta))}</Text>
                  </TouchableOpacity>
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
  container: { padding: 16 },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  priceBox: { flex: 1, alignItems: 'center', padding: 10, backgroundColor: colors.neutral.dark, borderRadius: 8, marginHorizontal: 5 },
  priceTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary.light },
  priceValue: { fontSize: 10, fontWeight: 'bold', color: '#FFF' },
  card: { marginBottom: 16, padding: 16, backgroundColor: colors.neutral.dark, borderRadius: 8, width:'100%', alignSelf: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary.dark },
  table: { marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  tableCell: { flex: 1, textAlign: 'center', fontSize: 10, color: '#FFF' },
});

export default ProductPricing;
