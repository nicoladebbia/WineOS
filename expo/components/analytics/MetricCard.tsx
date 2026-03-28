import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { getTrendInfo } from '@/utils/analyticsHelpers';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  valueColor?: string;
}

export default function MetricCard({ 
  label, 
  value, 
  subtitle, 
  trend, 
  icon,
  valueColor = Colors.primary 
}: MetricCardProps) {
  // Memoize trend display to avoid IIFE in JSX
  const trendDisplay = useMemo(() => {
    if (!trend || trend.value === undefined || trend.value === null) {
      return <Text style={styles.trendPlaceholder}> </Text>;
    }
    
    const trendInfo = getTrendInfo(trend.value);
    return (
      <>
        <Text style={[styles.trendText, { color: trendInfo.color }]}>
          {trendInfo.icon} {Math.abs(trend.value).toFixed(1)}%
        </Text>
        <Text style={styles.trendLabel}>{trend.label}</Text>
      </>
    );
  }, [trend]);

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.trendContainer}>{trendDisplay}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 6,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.lightText,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
    minHeight: 20, // Reserve space to prevent layout shift
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendLabel: {
    fontSize: 11,
    color: Colors.lightText,
  },
  trendPlaceholder: {
    fontSize: 12,
    color: 'transparent',
  },
});
