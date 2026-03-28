import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function AnalyticsSummarySkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.card}>
          <SkeletonLoader width={40} height={40} borderRadius={20} style={styles.icon} />
          <SkeletonLoader width={80} height={12} style={styles.label} />
          <SkeletonLoader width={60} height={28} style={styles.value} />
        </View>
        <View style={styles.divider} />
        <View style={styles.card}>
          <SkeletonLoader width={40} height={40} borderRadius={20} style={styles.icon} />
          <SkeletonLoader width={80} height={12} style={styles.label} />
          <SkeletonLoader width={60} height={28} style={styles.value} />
        </View>
      </View>
      <View style={styles.dividerHorizontal} />
      <View style={styles.row}>
        <View style={styles.card}>
          <SkeletonLoader width={40} height={40} borderRadius={20} style={styles.icon} />
          <SkeletonLoader width={80} height={12} style={styles.label} />
          <SkeletonLoader width={60} height={28} style={styles.value} />
        </View>
        <View style={styles.divider} />
        <View style={styles.card}>
          <SkeletonLoader width={40} height={40} borderRadius={20} style={styles.icon} />
          <SkeletonLoader width={80} height={12} style={styles.label} />
          <SkeletonLoader width={60} height={28} style={styles.value} />
        </View>
      </View>
    </View>
  );
}

export function ChartSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonLoader width={150} height={20} style={styles.title} />
      <View style={styles.chartArea}>
        <SkeletonLoader width="100%" height={150} borderRadius={8} />
      </View>
    </View>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <View style={styles.container}>
      <SkeletonLoader width={150} height={20} style={styles.title} />
      {Array.from({ length: items }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <View style={styles.listItemContent}>
            <SkeletonLoader width="70%" height={16} style={styles.listItemTitle} />
            <SkeletonLoader width="50%" height={12} style={styles.listItemSubtitle} />
          </View>
          <SkeletonLoader width={60} height={16} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.divider,
  },
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 6,
  },
  value: {
    marginBottom: 4,
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
  title: {
    marginBottom: 16,
  },
  chartArea: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    marginBottom: 4,
  },
  listItemSubtitle: {
    marginTop: 4,
  },
});
