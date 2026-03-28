import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react-native';
import MetricCard from './MetricCard';
import { useI18n, useCurrency } from '@/contexts/I18nContext';

interface AnalyticsSummaryProps {
  selectedPeriod: number;
}

export default function AnalyticsSummary({ selectedPeriod }: AnalyticsSummaryProps) {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  
  const getComprehensiveAnalytics = useWineStore((state) => state.getComprehensiveAnalytics);
  const getTrendComparison = useWineStore((state) => state.getTrendComparison);
  const getRevenueMetrics = useWineStore((state) => state.getRevenueMetrics);

  const metrics = useMemo(() => {
    // Three O(n) passes through data (one per analytics function)
    // TODO: Could be optimized to single pass in future
    const analytics = getComprehensiveAnalytics(selectedPeriod);
    const trend = getTrendComparison(selectedPeriod);
    const revenueMetrics = getRevenueMetrics(selectedPeriod);

    return {
      bottles: analytics.bottles,
      revenue: analytics.revenue,
      profit: analytics.profit,
      avgSaleValue: analytics.avgSaleValue,
      profitMargin: revenueMetrics.profitMargin,
      trend,
    };
  }, [selectedPeriod, getComprehensiveAnalytics, getTrendComparison, getRevenueMetrics]);

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Sales summary. Bottles sold: ${metrics.bottles}. Revenue: ${formatCurrency(metrics.revenue)}. Profit: ${formatCurrency(metrics.profit)}. Average sale: ${formatCurrency(metrics.avgSaleValue)}.`}
    >
      <View style={styles.metricsRow}>
        <MetricCard
          icon={<ShoppingCart size={20} color={Colors.primary} />}
          label={t.analytics.bottlesSold}
          value={metrics.bottles}
          valueColor={metrics.bottles === 0 ? Colors.lightText : Colors.primary}
          trend={{
            value: metrics.trend.change,
            label: selectedPeriod === 1 ? t.analytics.vsYesterday : t.analytics.vsPrevious,
          }}
        />

        <View style={styles.divider} />

        <MetricCard
          icon={<DollarSign size={20} color={Colors.success} />}
          label={t.analytics.revenue}
          value={formatCurrency(metrics.revenue)}
          valueColor={metrics.revenue === 0 ? Colors.lightText : Colors.success}
        />
      </View>

      <View style={styles.dividerHorizontal} />

      <View style={styles.metricsRow}>
        <MetricCard
          icon={<TrendingUp size={20} color={Colors.warning} />}
          label={t.analytics.profit}
          value={formatCurrency(metrics.profit)}
          valueColor={metrics.profit === 0 ? Colors.lightText : Colors.warning}
          subtitle={
            metrics.revenue > 0 && isFinite(metrics.profitMargin)
              ? `${metrics.profitMargin.toFixed(1)}% ${t.analytics.margin}`
              : undefined
          }
        />

        <View style={styles.divider} />

        <MetricCard
          icon={<Package size={20} color={Colors.text} />}
          label={t.analytics.avgSale}
          value={formatCurrency(metrics.avgSaleValue)}
          valueColor={metrics.avgSaleValue === 0 ? Colors.lightText : Colors.text}
        />
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 8,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
});
