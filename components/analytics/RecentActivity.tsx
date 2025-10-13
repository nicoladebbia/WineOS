import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useWineStore } from '@/store/wineStore';
import { Wine, Sale } from '@/types/wine';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Clock, ShoppingCart } from 'lucide-react-native';
import { formatTimeAgo, groupSalesByDateCategory, type SaleWithDate } from '@/utils/analyticsHelpers';
import * as Haptics from 'expo-haptics';

// Constants
const MAX_RECENT_SALES = 20;

// Proper interface that extends SaleWithDate
interface SaleWithWine extends SaleWithDate {
  sale: Sale;
  wine: Wine;
}

export default function RecentActivity() {
  const router = useRouter();
  const wines = useWineStore((state) => state.wines);

  const recentSales = useMemo(() => {
    const allSales: SaleWithWine[] = [];

    wines.forEach((wine) => {
      if (wine.sales && Array.isArray(wine.sales)) {
        wine.sales.forEach((sale) => {
          allSales.push({ 
            date: sale.date,
            sale, 
            wine 
          });
        });
      }
    });

    // Sort by date (most recent first)
    allSales.sort((a, b) => {
      return new Date(b.sale.date).getTime() - new Date(a.sale.date).getTime();
    });

    // Take most recent sales
    return allSales.slice(0, MAX_RECENT_SALES);
  }, [wines]);

  // FIXED: No more type casting! groupSalesByDateCategory handles the generic type
  const groupedSales = useMemo(() => {
    return groupSalesByDateCategory<SaleWithWine>(recentSales);
  }, [recentSales]);

  const handleSalePress = (wineId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(`/wine/${wineId}`);
  };

  // FIXED: Use Pressable instead of TouchableOpacity
  const renderSaleItem = (item: SaleWithWine) => {
    return (
      <Pressable
        key={`${item.sale.id}-${item.wine.id}`}
        style={({ pressed }) => [
          styles.saleItem,
          pressed && styles.saleItemPressed,
        ]}
        onPress={() => handleSalePress(item.wine.id)}
      >
        <View style={styles.iconContainer}>
          <ShoppingCart size={16} color={Colors.primary} />
        </View>
        <View style={styles.saleInfo}>
          <Text style={styles.wineName} numberOfLines={1}>
            {item.wine.name} {item.wine.year}
          </Text>
          <Text style={styles.saleDetails}>
            {item.sale.quantity} {item.sale.quantity === 1 ? 'bottle' : 'bottles'} • {item.wine.region}
          </Text>
        </View>
        <Text style={styles.timeAgo}>{formatTimeAgo(item.sale.date)}</Text>
      </Pressable>
    );
  };

  // FIXED: Simplified section rendering
  const renderSection = (title: string, data: SaleWithWine[]) => {
    if (data.length === 0) return null;

    return (
      <View key={title} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((item) => renderSaleItem(item))}
      </View>
    );
  };

  if (recentSales.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Clock size={20} color={Colors.primary} />
          <Text style={styles.title}>{translations.analytics?.recentActivity || 'Recent Activity'}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingCart size={48} color={Colors.lightText} />
          <Text style={styles.emptyText}>
            {translations.analytics?.noRecentSales || 'No recent sales to display'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={20} color={Colors.primary} />
        <Text style={styles.title}>{translations.analytics?.recentActivity || 'Recent Activity'}</Text>
        <Text style={styles.subtitle}>({recentSales.length} sales)</Text>
      </View>

      {/* FIXED: No more type casting! Types are correct now */}
      <View style={styles.sectionsContainer}>
        {renderSection('Today', groupedSales.today)}
        {renderSection('Yesterday', groupedSales.yesterday)}
        {renderSection('This Week', groupedSales.thisWeek)}
        {renderSection('Older', groupedSales.older)}
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 'auto',
  },
  sectionsContainer: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.lightText,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    gap: 12,
  },
  saleItemPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  saleDetails: {
    fontSize: 12,
    color: Colors.lightText,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.lightText,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 12,
    textAlign: 'center',
  },
});
