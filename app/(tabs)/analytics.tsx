import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PeriodSelector from '@/components/analytics/PeriodSelector';
import AnalyticsSummary from '@/components/analytics/AnalyticsSummary';
import TopSellingWines from '@/components/analytics/TopSellingWines';
import SalesTrendChart from '@/components/analytics/SalesTrendChart';
import RevenueInsights from '@/components/analytics/RevenueInsights';
import VelocityAlerts from '@/components/analytics/VelocityAlerts';
import RecentActivity from '@/components/analytics/RecentActivity';
import { AnalyticsSummarySkeleton, ChartSkeleton, ListSkeleton } from '@/components/analytics/SkeletonLoader';
import { useAnalyticsRefresh, usePeriodChange } from '@/hooks/useAnalyticsRefresh';

// Constants for configuration
const DEFAULT_PERIOD_DAYS = 7;
const TOP_WINES_LIMIT = 10;
const SCROLL_BOTTOM_PADDING = 100;

function AnalyticsScreenContent() {
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_PERIOD_DAYS);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Use real refresh hook instead of fake delays
  const { isRefreshing, refresh } = useAnalyticsRefresh();
  const { isChanging, changePeriod } = usePeriodChange();

  // Real refresh logic that forces Zustand recalculation
  const onRefresh = useCallback(async () => {
    try {
      await refresh();
      // Force components to remount after refresh
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      // Error already logged in hook
    }
  }, [refresh]);

  // Handle period change with real computation time
  const handlePeriodChange = useCallback(async (days: number) => {
    await changePeriod(days, setSelectedPeriod);
  }, [changePeriod]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelectorContainer}>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onSelectPeriod={handlePeriodChange}
          />
        </View>

        {/* Show skeleton loaders during period change */}
        {isChanging ? (
          <>
            <AnalyticsSummarySkeleton />
            <ChartSkeleton />
            <ListSkeleton items={5} />
            <ListSkeleton items={3} />
            <ListSkeleton items={3} />
            <ListSkeleton items={5} />
          </>
        ) : (
          <>
            <ErrorBoundary key={`summary-${refreshKey}`}>
              <AnalyticsSummary selectedPeriod={selectedPeriod} />
            </ErrorBoundary>

            <ErrorBoundary key={`chart-${refreshKey}`}>
              <SalesTrendChart selectedPeriod={selectedPeriod} />
            </ErrorBoundary>

            <ErrorBoundary key={`top-${refreshKey}`}>
              <TopSellingWines selectedPeriod={selectedPeriod} limit={TOP_WINES_LIMIT} />
            </ErrorBoundary>

            <ErrorBoundary key={`revenue-${refreshKey}`}>
              <RevenueInsights selectedPeriod={selectedPeriod} />
            </ErrorBoundary>

            <ErrorBoundary key={`velocity-${refreshKey}`}>
              <VelocityAlerts />
            </ErrorBoundary>

            <ErrorBoundary key={`activity-${refreshKey}`}>
              <RecentActivity />
            </ErrorBoundary>
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default function AnalyticsScreen() {
  return (
    <ErrorBoundary>
      <AnalyticsScreenContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: SCROLL_BOTTOM_PADDING,
  },
  periodSelectorContainer: {
    marginBottom: 16,
  },
});
