import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface InventorySummaryProps {
  winesNeedingReorder: number;
  totalBottles: number;
  totalWines: number;
  inventoryValue: number;
  trend: 'up' | 'down' | 'stable';
}

export default function InventorySummary({ 
  winesNeedingReorder, 
  totalBottles,
  totalWines,
  inventoryValue,
  trend
}: InventorySummaryProps) {
  // Determine trend icon and color based on trend value
  const getTrendDisplay = () => {
    switch (trend) {
      case 'up':
        return { Icon: TrendingUp, color: Colors.success };
      case 'down':
        return { Icon: TrendingDown, color: Colors.danger };
      default:
        return { Icon: null, color: Colors.lightText };
    }
  };
  
  const { Icon: TrendIcon, color: trendColor } = getTrendDisplay();
  
  return (
    <View style={styles.container}>
      <View style={styles.metricRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{totalWines}</Text>
          <Text style={styles.metricLabel}>{translations.dashboard.totalWines}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{totalBottles}</Text>
          <Text style={styles.metricLabel}>{translations.dashboard.totalBottles}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, winesNeedingReorder > 0 && styles.warningText]}>{winesNeedingReorder}</Text>
          <Text style={styles.metricLabel}>{translations.dashboard.lowStock}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={styles.valueWithIcon}>
            <Text style={styles.metricValue}>€{inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
            {TrendIcon && <TrendIcon size={14} color={trendColor} style={styles.trendIcon} />}
          </View>
          <Text style={styles.metricLabel}>{translations.dashboard.inventoryValue}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.lightText,
    fontWeight: '500',
  },
  valueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warningText: {
    color: Colors.warning,
  },
  trendIcon: {
    marginLeft: 2,
  },
});