import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Trophy, Wine as WineIcon } from 'lucide-react-native';
import { getMedalEmoji, getPercentageOfMax, getPeriodLabel } from '@/utils/analyticsHelpers';
import { useCurrency } from '@/contexts/I18nContext';
import * as Haptics from 'expo-haptics';

interface TopSellingWinesProps {
  selectedPeriod: number;
  limit?: number;
}

export default function TopSellingWines({ selectedPeriod, limit = 10 }: TopSellingWinesProps) {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const getTopSellingWinesByRevenue = useWineStore((state) => state.getTopSellingWinesByRevenue);

  const topWines = useMemo(() => {
    return getTopSellingWinesByRevenue(limit, selectedPeriod);
  }, [selectedPeriod, limit, getTopSellingWinesByRevenue]);

  const maxRevenue = topWines.length > 0 ? topWines[0].revenue : 0;

  const handleWinePress = (wineId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(`/wine/${wineId}`);
  };

  // FIXED: Use .map() instead of FlatList with scrollEnabled={false}
  const renderWineItem = (item: typeof topWines[0], index: number) => {
    const percentage = getPercentageOfMax(item.revenue, maxRevenue);

    return (
      <Pressable
        key={item.wine.id}
        style={({ pressed }) => [
          styles.wineItem,
          pressed && styles.wineItemPressed,
        ]}
        onPress={() => handleWinePress(item.wine.id)}
      >
        <View style={styles.wineHeader}>
          <View style={styles.wineInfo}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{getMedalEmoji(index + 1)}</Text>
            </View>
            <View style={styles.wineDetails}>
              <Text style={styles.wineName} numberOfLines={1}>
                {item.wine.name} {item.wine.year}
              </Text>
              <Text style={styles.wineRegion} numberOfLines={1}>
                {item.wine.region}, {item.wine.country}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.quantityText}>
              {item.quantity} {item.quantity === 1 
                ? (translations.wine?.bottle || 'bottle')
                : (translations.wine?.bottles || 'bottles')
              }
            </Text>
            <Text style={styles.revenueText}>{formatCurrency(item.revenue)}</Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
      </Pressable>
    );
  };

  if (topWines.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Trophy size={20} color={Colors.primary} />
          <Text style={styles.title}>{translations.analytics?.topSellers || 'Top Sellers'}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <WineIcon size={48} color={Colors.lightText} />
          <Text style={styles.emptyText}>
            {translations.analytics?.noSalesYet || 'No sales in this period'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={20} color={Colors.primary} />
        <Text style={styles.title}>{translations.analytics?.topSellers || 'Top Sellers'}</Text>
        <Text style={styles.subtitle}>({getPeriodLabel(selectedPeriod)})</Text>
      </View>

      {/* FIXED: Use .map() instead of FlatList */}
      <View>
        {topWines.map((item, index) => renderWineItem(item, index))}
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
  wineItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  wineItemPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
  },
  wineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 20,
  },
  wineDetails: {
    flex: 1,
  },
  wineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  wineRegion: {
    fontSize: 12,
    color: Colors.lightText,
  },
  statsContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  revenueText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
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
  },
});
