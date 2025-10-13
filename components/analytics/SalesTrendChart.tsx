import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { TrendingUp } from 'lucide-react-native';
import { getShortDayName } from '@/utils/analyticsHelpers';
import { ALL_TIME_PERIOD } from '@/components/analytics/PeriodSelector';
import { useI18n } from '@/contexts/I18nContext';
import { translations } from '@/constants/translations';

interface SalesTrendChartProps {
  selectedPeriod: number;
}

const CHART_HEIGHT = 180;
const CHART_PADDING_LEFT = 16; // Align with card content
const CHART_PADDING_RIGHT = 16;
const BAR_RENDER_AREA_HEIGHT = 120; // Height available for bar rendering (180 - 20 top - 40 bottom)
const MIN_BAR_HEIGHT = 4; // Minimum height for visibility (matches styles.bar.minHeight)

export default function SalesTrendChart({ selectedPeriod }: SalesTrendChartProps) {
  const { t } = useI18n();
  const getSalesByDay = useWineStore((state) => state.getSalesByDay);
  const getMonthlySalesData = useWineStore((state) => state.getMonthlySalesData);

  const chartData = useMemo(() => {
    
    // OPTIMIZED: Use different functions based on period
    if (selectedPeriod === 1) {
      // TODAY: Show only today
      const salesData = getSalesByDay(1);
      const maxQuantity = salesData.reduce((max, d) => Math.max(max, d.quantity), 1);
      return {
        data: salesData,
        maxQuantity,
        displayType: 'day' as const,
        displayLabel: translations.analytics.periodToday,
      };
    } else if (selectedPeriod === 7) {
      // WEEK: Show 7 days
      const salesData = getSalesByDay(7);
      const maxQuantity = salesData.reduce((max, d) => Math.max(max, d.quantity), 1);
      return {
        data: salesData,
        maxQuantity,
        displayType: 'day' as const,
        displayLabel: translations.analytics.periodLastDays.replace('{count}', '7'),
      };
    } else if (selectedPeriod === 30 || selectedPeriod >= ALL_TIME_PERIOD) {
      // MONTH or ALL: Show 12 months using optimized function
      const monthlyData = getMonthlySalesData(12);
      const maxQuantity = monthlyData.reduce((max, d) => Math.max(max, d.quantity), 1);
      return {
        data: monthlyData,
        maxQuantity,
        displayType: 'month' as const,
        displayLabel: translations.analytics.periodLastMonths,
      };
    }

    // Default: Last X days
    const salesData = getSalesByDay(selectedPeriod);
    const maxQuantity = salesData.reduce((max, d) => Math.max(max, d.quantity), 1);
    return {
      data: salesData,
      maxQuantity,
      displayType: 'day' as const,
      displayLabel: translations.analytics.periodLastDays.replace('{count}', String(selectedPeriod)),
    };
  }, [selectedPeriod, getSalesByDay, getMonthlySalesData]);

  // Check if all data is zero
  const hasData = chartData.data.some(d => d.quantity > 0);

  // Accessibility description for screen readers
  const accessibilityLabel = hasData
    ? `Sales trend chart for ${chartData.displayLabel}. Maximum sales: ${chartData.maxQuantity} bottles. Chart shows ${chartData.data.length} data points.`
    : `Sales trend chart for ${chartData.displayLabel}. No sales data available.`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color={Colors.primary} />
        <Text style={styles.title}>{t.analytics.salesTrend}</Text>
        <Text style={styles.subtitle}>({chartData.displayLabel})</Text>
      </View>

      {hasData ? (
        <View 
          style={styles.chartArea}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint="Visual bar chart showing sales quantity over time"
        >
          {/* Y-axis */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>{chartData.maxQuantity}</Text>
            <Text style={styles.yAxisLabel}>{Math.floor(chartData.maxQuantity / 2)}</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>

          {/* Chart content */}
          <View style={styles.chartContent}>
            {/* Grid lines */}
            <View style={styles.gridContainer}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
              {chartData.data.map((item, index) => {
                const barHeight = chartData.maxQuantity > 0
                  ? (item.quantity / chartData.maxQuantity) * BAR_RENDER_AREA_HEIGHT
                  : 0;

                return (
                  <View key={`bar-${index}`} style={styles.barColumn}>
                    {item.quantity > 0 && (
                      <Text style={styles.barLabel}>{item.quantity}</Text>
                    )}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(barHeight, item.quantity > 0 ? MIN_BAR_HEIGHT : 0),
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>

            {/* X-axis labels - separate from bars */}
            <View style={styles.xAxisContainer}>
              {chartData.data.map((item, index) => (
                <Text key={`label-${index}`} style={styles.xAxisLabel}>
                  {chartData.displayType === 'month' 
                    ? (item.date || '').substring(0, 3)
                    : (getShortDayName(item.date) || '').substring(0, 3)
                  }
                </Text>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.analytics.noSalesData}</Text>
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
  subtitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 'auto',
  },
  chartArea: {
    flexDirection: 'row',
    height: CHART_HEIGHT,
    paddingLeft: CHART_PADDING_LEFT,
    paddingRight: CHART_PADDING_RIGHT,
  },
  yAxis: {
    width: 32,
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingTop: 20,
    paddingBottom: 40, // Positions "0" at bar bottom (140px)
  },
  yAxisLabel: {
    fontSize: 11,
    color: Colors.lightText,
    textAlign: 'right',
    fontWeight: '500',
  },
  chartContent: {
    flex: 1,
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 40, // Matches Y-axis bottom padding
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: Colors.divider,
    opacity: 0.2,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    height: 140, // Bars end at 140px
    paddingTop: 20, // Space for value labels
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    maxWidth: 32,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8, // Closer to bars
  },
  xAxisLabel: {
    flex: 1,
    fontSize: 10,
    color: Colors.lightText,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.lightText,
  },
});
