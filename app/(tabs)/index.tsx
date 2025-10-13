import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  type FlatList as FlatListType,
} from 'react-native';
import { useWineStore } from '@/store/wineStore';
import { Wine, ReorderStatus, WineType, Country } from '@/types/wine';
import WineCard, { WINE_CARD_HEIGHT } from '@/components/WineCard';
import EmptyState from '@/components/EmptyState';
import FilterBar, { FilterDropdown } from '@/components/FilterBar';
import InventorySummary from '@/components/InventorySummary';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react-native';
import { useToastStore } from '@/store/toastStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as Haptics from 'expo-haptics';
import { logger } from '@/utils/logger';

// Constants
const DEBOUNCE_DELAY = 300;

function InventoryScreenContent() {
  // Zustand selectors - only select data, not functions
  const wines = useWineStore((state) => state.wines);
  
  // Get functions from store once (they don't change)
  const { searchWines, getReorderStatus, getWinesNeedingReorder } = useWineStore.getState();
  
  // State
  const [selectedTypes, setSelectedTypes] = useState<WineType[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ReorderStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'region'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Global toast
  const showToast = useToastStore((state) => state.showToast);
  
  // Refs
  const searchDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownReorderToast = useRef(false);
  
  // Memoized calculations
  const winesNeedingReorder = useMemo(() => getWinesNeedingReorder(), [wines]);
  
  const totalBottles = useMemo(
    () => wines.reduce((total, wine) => total + wine.quantity, 0),
    [wines]
  );
  
  // Calculate inventory value (quantity × purchase price)
  const inventoryValue = useMemo(
    () => wines.reduce((total, wine) => total + (wine.quantity * wine.purchasePrice), 0),
    [wines]
  );
  
  // Calculate trend based on recent restocks vs sales
  const trend = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let recentRestocks = 0;
    let recentSales = 0;
    let hasData = false;
    
    wines.forEach(wine => {
      // Count recent restocks
      if (wine.restocks) {
        wine.restocks.forEach(restock => {
          const restockDate = new Date(restock.date);
          if (restockDate >= sevenDaysAgo) {
            recentRestocks += restock.quantity;
            hasData = true;
          }
        });
      }
      
      // Count recent sales
      if (wine.sales) {
        wine.sales.forEach(sale => {
          const saleDate = new Date(sale.date);
          if (saleDate >= sevenDaysAgo) {
            recentSales += sale.quantity;
            hasData = true;
          }
        });
      }
    });
    
    // If no data, return 'stable' (no trend to show)
    if (!hasData || (recentRestocks === 0 && recentSales === 0)) {
      return 'stable';
    }
    
    // Determine trend based on activity
    if (recentRestocks > recentSales * 1.2) return 'up';
    if (recentSales > recentRestocks * 1.2) return 'down';
    return 'stable';
  }, [wines]) as 'up' | 'down' | 'stable';
  
  // Debounced search
  useEffect(() => {
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
    
    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);
    
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [searchQuery]);
  
  // Show reorder notification when wines needing reorder changes (only once per session)
  useEffect(() => {
    if (winesNeedingReorder.length > 0 && !hasShownReorderToast.current) {
      showToast(
        `⚠️ ${winesNeedingReorder.length} ${translations.dashboard.winesNeedingReorder}`,
        'warning'
      );
      hasShownReorderToast.current = true;
    }
    
    // Reset if no wines need reorder anymore
    if (winesNeedingReorder.length === 0) {
      hasShownReorderToast.current = false;
    }
  }, [winesNeedingReorder.length, showToast]);
  
  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    logger.time('Inventory Refresh');
    
    // Force re-render to show any changes from other tabs
    // In a real app, this would sync with Supabase
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }
    
    refreshTimer.current = setTimeout(() => {
      setRefreshing(false);
      logger.timeEnd('Inventory Refresh');
      logger.info('Inventory refreshed', { wineCount: wines.length });
    }, 300);
  }, [wines.length]);
  
  // Get filtered wines based on search and filters (memoized for performance)
  const filteredWines = useMemo(() => {
    try {
      logger.time('Filter Wines');
      
      // First apply search
      let result = debouncedSearchQuery ? searchWines(debouncedSearchQuery) : wines;
      
      // Then apply filters
      if (selectedTypes.length > 0) {
        result = result.filter(wine => selectedTypes.includes(wine.type));
      }
      
      if (selectedCountries.length > 0) {
        result = result.filter(wine => selectedCountries.includes(wine.country));
      }
      
      if (selectedRegions.length > 0) {
        result = result.filter(wine => selectedRegions.includes(wine.region));
      }
      
      if (selectedStatuses.length > 0) {
        result = result.filter(wine => selectedStatuses.includes(getReorderStatus(wine)));
      }
      
      // Apply sorting (sort in place to avoid extra array copy)
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
            break;
          case 'quantity':
            comparison = a.quantity - b.quantity;
            break;
          case 'region':
            comparison = a.region.localeCompare(b.region, 'en', { sensitivity: 'base' });
            break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
      
      logger.timeEnd('Filter Wines');
      logger.debug('Filtered wines', {
        total: wines.length,
        filtered: result.length,
        hasSearch: !!debouncedSearchQuery,
        hasFilters: !!(selectedTypes.length > 0 || selectedCountries.length > 0 || selectedRegions.length > 0 || selectedStatuses.length > 0),
      });
      
      return result;
    } catch (error) {
      logger.error('Error filtering wines', error);
      return wines; // Fallback to all wines on error
    }
  }, [
    wines,
    debouncedSearchQuery,
    selectedTypes,
    selectedCountries,
    selectedRegions,
    selectedStatuses,
    sortBy,
    sortDirection,
  ]);
  
  const handleSort = useCallback((field: 'name' | 'quantity' | 'region') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and reset direction to asc
      setSortBy(field);
      setSortDirection('asc');
    }
    
    logger.debug('Sort changed', { field, direction: sortBy === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc' });
  }, [sortBy, sortDirection]);
  
  const clearSearch = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSearchQuery('');
    setDebouncedSearchQuery('');
    Keyboard.dismiss();
    logger.debug('Search cleared');
  }, []);
  
  const clearAllFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSelectedTypes([]);
    setSelectedCountries([]);
    setSelectedRegions([]);
    setSelectedStatuses([]);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSortBy('name');
    setSortDirection('asc');
    logger.debug('All filters cleared');
  }, []);
  
  const renderItem = useCallback(({ item }: { item: Wine }) => (
    <WineCard wine={item} />
  ), []);
  
  const keyExtractor = useCallback((item: Wine) => item.id, []);
  
  const getItemLayout = useCallback(
    (_data: ArrayLike<Wine> | null | undefined, index: number) => ({
      length: WINE_CARD_HEIGHT,
      offset: WINE_CARD_HEIGHT * index,
      index,
    }),
    []
  );
  
  const renderSortIcon = useCallback((field: 'name' | 'quantity' | 'region') => {
    if (sortBy !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} color={Colors.primary} />
    ) : (
      <ChevronDown size={16} color={Colors.primary} />
    );
  }, [sortBy, sortDirection]);
  
  // Memoize active filters check (includes search)
  const hasActiveFilters = useMemo(
    () => selectedTypes.length > 0 || selectedCountries.length > 0 || selectedRegions.length > 0 || selectedStatuses.length > 0 || !!debouncedSearchQuery,
    [selectedTypes.length, selectedCountries.length, selectedRegions.length, selectedStatuses.length, debouncedSearchQuery]
  );
  
  // Active filters WITHOUT search (for filter dropdown)
  const hasActiveFiltersOnly = useMemo(
    () => selectedTypes.length > 0 || selectedCountries.length > 0 || selectedRegions.length > 0 || selectedStatuses.length > 0,
    [selectedTypes.length, selectedCountries.length, selectedRegions.length, selectedStatuses.length]
  );
  
  const showingCount = filteredWines.length;
  const totalCount = wines.length;
  
  return (
    <View style={styles.container}>
      {/* Summary stats */}
      <InventorySummary 
        winesNeedingReorder={winesNeedingReorder.length}
        totalBottles={totalBottles}
        totalWines={wines.length}
        inventoryValue={inventoryValue}
        trend={trend}
      />
      
      {wines.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredWines}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          contentContainerStyle={filteredWines.length === 0 ? styles.emptyListContent : styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          windowSize={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={10}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* Search + Filter Row */}
              <View style={styles.searchFilterRow}>
                <View style={styles.searchInputContainer}>
                  <Search size={16} color={Colors.lightText} />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={translations.actions.search}
                    placeholderTextColor={Colors.lightText}
                    returnKeyType="search"
                    onSubmitEditing={Keyboard.dismiss}
                    onBlur={() => Keyboard.dismiss()}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch}>
                      <X size={16} color={Colors.lightText} />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.filterButtonContainer}>
                  <FilterBar
                    selectedTypes={selectedTypes}
                    selectedCountries={selectedCountries}
                    selectedRegions={selectedRegions}
                    selectedStatuses={selectedStatuses}
                    onSelectTypes={setSelectedTypes}
                    onSelectCountries={setSelectedCountries}
                    onSelectRegions={setSelectedRegions}
                    onSelectStatuses={setSelectedStatuses}
                    onClearAll={clearAllFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                  />
                </View>
              </View>
              
              {showFilters && (
                <FilterDropdown
                  selectedTypes={selectedTypes}
                  selectedCountries={selectedCountries}
                  selectedRegions={selectedRegions}
                  selectedStatuses={selectedStatuses}
                  onSelectTypes={setSelectedTypes}
                  onSelectCountries={setSelectedCountries}
                  onSelectRegions={setSelectedRegions}
                  onSelectStatuses={setSelectedStatuses}
                  onClearAll={clearAllFilters}
                  hasActiveFilters={hasActiveFiltersOnly}
                />
              )}
              
              {hasActiveFilters && (
                <View style={styles.resultsContainerCompact}>
                  <Text style={styles.resultsTextCompact}>
                    {showingCount} of {totalCount} wines
                  </Text>
                </View>
              )}
              
              <View style={styles.sortContainer}>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => handleSort('name')}
                  accessibilityLabel={`Sort by name ${sortBy === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : ''}`}
                  accessibilityRole="button"
                >
                  <View style={styles.sortButtonContent}>
                    <Text style={[
                      styles.sortButtonText,
                      sortBy === 'name' && styles.activeSortButton
                    ]}>
                      {translations.wine.name}
                    </Text>
                    {renderSortIcon('name')}
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => handleSort('region')}
                  accessibilityLabel={`Sort by region ${sortBy === 'region' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : ''}`}
                  accessibilityRole="button"
                >
                  <View style={styles.sortButtonContent}>
                    <Text style={[
                      styles.sortButtonText,
                      sortBy === 'region' && styles.activeSortButton
                    ]}>
                      {translations.wine.region}
                    </Text>
                    {renderSortIcon('region')}
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => handleSort('quantity')}
                  accessibilityLabel={`Sort by quantity ${sortBy === 'quantity' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : ''}`}
                  accessibilityRole="button"
                >
                  <View style={styles.sortButtonContent}>
                    <Text style={[
                      styles.sortButtonText,
                      sortBy === 'quantity' && styles.activeSortButton
                    ]}>
                      {translations.wine.quantity}
                    </Text>
                    {renderSortIcon('quantity')}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState 
              title={translations.emptyState.noResults}
              description={translations.emptyState.noResultsDescription}
            />
          }
          testID="wine-list"
        />
      )}
      
    </View>
  );
}

export default function InventoryScreen() {
  return (
    <ErrorBoundary>
      <InventoryScreenContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.card,
    overflow: 'visible',
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.card,
    overflow: 'visible',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    height: 44,
  },
  filterButtonContainer: {
    position: 'relative',
    zIndex: 100,
    overflow: 'visible',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  resultsContainerCompact: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.card,
  },
  resultsTextCompact: {
    fontSize: 12,
    color: Colors.lightText,
    textAlign: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  sortButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 13,
    color: Colors.lightText,
    fontWeight: '600',
  },
  activeSortButton: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});
