import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { DollarSign } from 'lucide-react-native';
import { getProfitMarginColor } from '@/utils/analyticsHelpers';
import { useCurrency } from '@/contexts/I18nContext';

interface RevenueInsightsProps {
  selectedPeriod: number;
}

export default function RevenueInsights({ selectedPeriod }: RevenueInsightsProps) {
  const { formatCurrency } = useCurrency();
  const getRevenueMetrics = useWineStore((state) => state.getRevenueMetrics);

  const metrics = useMemo(() => {
    return getRevenueMetrics(selectedPeriod);
  }, [selectedPeriod, getRevenueMetrics]);

  // FIXED: Use utility function instead of duplicating logic

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DollarSign size={20} color={Colors.success} />
        <Text style={styles.title}>{translations.analytics?.revenueInsights || 'Revenue Insights'}</Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{translations.analytics?.totalRevenue || 'Total Revenue'}</Text>
          <Text style={[styles.metricValue, styles.revenueValue]}>
            {formatCurrency(metrics.totalRevenue)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{translations.analytics?.totalCost || 'Total Cost'}</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(metrics.totalCost)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, styles.highlightLabel]}>
            {translations.analytics?.grossProfit || 'Gross Profit'}
          </Text>
          <Text style={[styles.metricValue, styles.profitValue]}>
            {formatCurrency(metrics.grossProfit)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{translations.analytics?.profitMargin || 'Profit Margin'}</Text>
          <Text
            style={[
              styles.metricValue,
              styles.marginValue,
              { color: getProfitMarginColor(metrics.profitMargin) },
            ]}
          >
            {metrics.profitMargin.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{translations.analytics?.avgProfitPerSale || 'Avg Profit/Sale'}</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(metrics.avgProfitPerSale)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{translations.analytics?.avgSaleValue || 'Avg Sale Value'}</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(metrics.avgSaleValue)}
          </Text>
        </View>
      </View>

      {/* FIXED: Empty state only shows if truly empty */}
      {metrics.totalRevenue === 0 && metrics.totalCost === 0 && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>
            {translations.analytics?.noRevenueData || 'No revenue data for this period'}
          </Text>
        </View>
      )}
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
  metricsContainer: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  highlightLabel: {
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  revenueValue: {
    color: Colors.success,
    fontSize: 18,
  },
  profitValue: {
    color: Colors.warning,
    fontSize: 18,
    fontWeight: '700',
  },
  marginValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
  emptyOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
  },
});
