import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Sale } from '@/types/wine';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Calendar, ShoppingCart } from 'lucide-react-native';

interface SalesHistoryProps {
  sales: Sale[];
}

export default function SalesHistory({ sales }: SalesHistoryProps) {
  // Ensure sales is an array
  const salesArray = sales && Array.isArray(sales) ? sales : [];
  
  if (salesArray.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{translations.sales.noSales}</Text>
      </View>
    );
  }
  
  // Sort sales by date (most recent first)
  const sortedSales = [...salesArray].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const renderSaleItem = ({ item }: { item: Sale }) => (
    <View style={styles.saleItem}>
      <View style={styles.saleInfo}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={Colors.primary} />
          <Text style={styles.dateText}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.quantityContainer}>
          <ShoppingCart size={16} color={Colors.primary} />
          <Text style={styles.quantityText}>
            {item.quantity} {item.quantity === 1 ? 'bottle' : 'bottles'}
          </Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translations.sales.history}</Text>
      <FlatList
        data={sortedSales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 8,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  saleInfo: {
    flex: 1,
    gap: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    fontSize: 14,
    color: Colors.lightText,
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    padding: 16,
  },
});