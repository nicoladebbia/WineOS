import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Search,
  X,
  Wine as WineIcon,
  Building2,
  Calendar,
  ChevronRight,
  Plus,
  Calculator,
  Layers,
  Info,
  Package,
  DollarSign,
  Lightbulb,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { searchWines, getPopularWines } from '@/services/wineSearchService';
import { WineTemplate } from '@/types/wineDatabase';
import { useWineStore } from '@/store/wineStore';
import { useRouter } from 'expo-router';
import Toast from '@/components/Toast';
import { translations } from '@/constants/translations';

// Enhanced hooks
import { useSmartPricing } from '@/hooks/useSmartPricing';
import { useSupplierMemory } from '@/hooks/useSupplierMemory';
import { useSmartQuantityDefaults } from '@/hooks/useSmartQuantityDefaults';
import { useDuplicateDetection } from '@/hooks/useDuplicateDetection';
import { useDatabaseFilters } from '@/hooks/useDatabaseFilters';
import { useInventoryContext } from '@/hooks/useInventoryContext';

// Enhanced components
import PriceCalculatorModal from '@/components/PriceCalculatorModal';
import BatchAddModal from '@/components/BatchAddModal';
import WineDatabaseFilters from '@/components/WineDatabaseFilters';
import SuccessActionsModal from '@/components/SuccessActionsModal';
import RecentlyAddedStrip from '@/components/RecentlyAddedStrip';
import DuplicateWineDialog from '@/components/DuplicateWineDialog';

interface DatabaseSearchModeProps {
  onSuccess?: () => void;
}

export default function DatabaseSearchMode({ onSuccess }: DatabaseSearchModeProps) {
  const router = useRouter();
  const addWine = useWineStore((state) => state.addWine);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WineTemplate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPopular, setShowPopular] = useState(true);
  const [selectedWine, setSelectedWine] = useState<WineTemplate | null>(null);
  const [selectedProducer, setSelectedProducer] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form fields for completing the wine entry
  const [supplier, setSupplier] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('6');
  const [quantityTarget, setQuantityTarget] = useState('24');

  // Enhanced modals and states
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);
  const [showBatchAdd, setShowBatchAdd] = useState(false);
  const [showSuccessActions, setShowSuccessActions] = useState(false);
  const [lastAddedWineName, setLastAddedWineName] = useState('');
  const [showProducerSearch, setShowProducerSearch] = useState(false);
  const [producerSearchQuery, setProducerSearchQuery] = useState('');
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  
  // Form validation and progress
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [priceExplanation, setPriceExplanation] = useState('');

  // Enhanced hooks
  const priceSuggestion = useSmartPricing(selectedWine);
  const supplierMemory = useSupplierMemory(selectedWine?.country, selectedWine?.region);
  const quantityDefaults = useSmartQuantityDefaults(selectedWine);
  const duplicateMatch = useDuplicateDetection(
    selectedWine?.name || '',
    selectedYear,
    selectedProducer
  );
  const inventoryContext = useInventoryContext(selectedWine);
  
  // Database filters
  const {
    filters,
    filteredWines,
    setFilter,
    resetFilters,
    hasActiveFilters,
    availableClassifications,
  } = useDatabaseFilters(searchResults);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      setShowPopular(false);

      const timer = setTimeout(() => {
        const results = searchWines(searchQuery);
        setSearchResults(results.map((r) => r.wine));
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowPopular(true);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const popularWines = getPopularWines();

  // Apply smart suggestions when wine is selected
  useEffect(() => {
    if (selectedWine) {
      // Apply price suggestions
      if (priceSuggestion) {
        setPurchasePrice(priceSuggestion.purchasePrice.toFixed(2));
        setSellingPrice(priceSuggestion.sellingPrice.toFixed(2));
        setPriceExplanation(priceSuggestion.explanation);
      }
      
      // Apply quantity defaults
      setQuantity(quantityDefaults.quantity.toString());
      setMinQuantity(quantityDefaults.minQuantity.toString());
      setQuantityTarget(quantityDefaults.quantityTarget.toString());
    }
  }, [selectedWine, priceSuggestion, quantityDefaults]);

  // Validate form in real-time
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (selectedWine) {
      if (!selectedYear) errors.year = 'Year is required';
      if (!supplier) errors.supplier = 'Supplier is required';
      if (!purchasePrice || parseFloat(purchasePrice) <= 0) errors.purchasePrice = 'Valid price required';
      if (!sellingPrice || parseFloat(sellingPrice) <= parseFloat(purchasePrice)) errors.sellingPrice = 'Must be higher than purchase price';
      if (!quantity || parseInt(quantity) <= 0) errors.quantity = 'Quantity required';
    }
    
    setFormErrors(errors);
  }, [selectedWine, selectedYear, supplier, purchasePrice, sellingPrice, quantity]);

  const handleSelectWine = (wine: WineTemplate) => {
    setSelectedWine(wine);
    setSelectedProducer('');
    setSelectedYear('');
    setPriceExplanation('');
    setFormErrors({});
  };

  const handleBack = () => {
    setSelectedWine(null);
    setSelectedProducer('');
    setSelectedYear('');
  };

  const handleAddWine = () => {
    // Check for duplicate first
    if (duplicateMatch && !showDuplicateDialog) {
      setShowDuplicateDialog(true);
      return;
    }

    if (!selectedWine || !selectedYear || !supplier || !purchasePrice || !sellingPrice || !quantity) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    const producerSuffix = selectedProducer ? ` - ${selectedProducer}` : '';
    const wineData = {
      name: `${selectedWine.name}${producerSuffix}`,
      year: Number(selectedYear),
      type: selectedWine.type,
      country: selectedWine.country,
      region: selectedWine.region,
      grapeVariety: selectedWine.grapeVariety,
      supplier: supplier,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
      minQuantity: Number(minQuantity || 0),
      quantityTarget: Number(quantityTarget),
      averageWeeklySales: 0,
      notes: '',
    };

    addWine(wineData);
    setLastAddedWineName(`${selectedWine.name}${producerSuffix} ${selectedYear}`);
    setShowSuccessActions(true);
  };

  const handleBatchAdd = (vintages: any[]) => {
    if (!selectedWine || !supplier || !purchasePrice || !sellingPrice) {
      Alert.alert('Missing Information', 'Please complete all fields before batch adding.');
      return;
    }

    vintages.forEach((vintage) => {
      const producerSuffix = selectedProducer ? ` - ${selectedProducer}` : '';
      const wineData = {
        name: `${selectedWine.name}${producerSuffix}`,
        year: Number(vintage.year),
        type: selectedWine.type,
        country: selectedWine.country,
        region: selectedWine.region,
        grapeVariety: selectedWine.grapeVariety,
        supplier: supplier,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        quantity: Number(vintage.quantity),
        minQuantity: Number(minQuantity || 0),
        quantityTarget: Number(quantityTarget),
        averageWeeklySales: 0,
        notes: '',
      };
      addWine(wineData);
    });

    setShowBatchAdd(false);
    setToastMessage(`${vintages.length} vintages added successfully!`);
    setShowToast(true);
    
    setTimeout(() => {
      handleBack();
    }, 2000);
  };

  const handleDuplicateUpdate = () => {
    if (duplicateMatch) {
      const updateWine = useWineStore.getState().updateWine;
      const newQuantity = duplicateMatch.wine.quantity + Number(quantity);
      updateWine(duplicateMatch.wine.id, { quantity: newQuantity });
      
      setToastMessage('Quantity updated successfully!');
      setShowToast(true);
      setShowDuplicateDialog(false);
      
      setTimeout(() => {
        handleBack();
      }, 1500);
    }
  };

  const handleDuplicateAddAnyway = () => {
    setShowDuplicateDialog(false);
    // Continue with normal add
    const producerSuffix = selectedProducer ? ` - ${selectedProducer}` : '';
    const wineData = {
      name: `${selectedWine!.name}${producerSuffix}`,
      year: Number(selectedYear),
      type: selectedWine!.type,
      country: selectedWine!.country,
      region: selectedWine!.region,
      grapeVariety: selectedWine!.grapeVariety,
      supplier: supplier,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
      minQuantity: Number(minQuantity || 0),
      quantityTarget: Number(quantityTarget),
      averageWeeklySales: 0,
      notes: '',
    };
    addWine(wineData);
    setLastAddedWineName(`${selectedWine!.name}${producerSuffix} ${selectedYear}`);
    setShowSuccessActions(true);
  };

  const calculateFormProgress = () => {
    if (!selectedWine) return 0;
    const fields = [
      selectedWine !== null,
      selectedYear !== '',
      supplier !== '',
      purchasePrice !== '',
      sellingPrice !== '',
      quantity !== '',
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleRecentWineSelect = (wineName: string) => {
    setSearchQuery(wineName);
  };

  const handleQuickYearSelect = (year: number) => {
    setSelectedYear(year.toString());
  };

  const renderWineItem = ({ item }: { item: WineTemplate }) => (
    <TouchableOpacity style={styles.wineItem} onPress={() => handleSelectWine(item)}>
      <View style={styles.wineIconContainer}>
        <WineIcon size={24} color={Colors.primary} />
      </View>
      <View style={styles.wineInfo}>
        <Text style={styles.wineName}>{item.name}</Text>
        <Text style={styles.wineDetails}>
          {item.region}, {item.country} • {item.type}
        </Text>
        <Text style={styles.wineProducers}>
          {item.producers.length} producer{item.producers.length !== 1 ? 's' : ''} available
        </Text>
      </View>
      <ChevronRight size={20} color={Colors.lightText} />
    </TouchableOpacity>
  );

  // If wine is selected, show the completion form
  if (selectedWine) {
    const formProgress = calculateFormProgress();
    const currentYear = new Date().getFullYear();
    const quickYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 5];
    
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.formHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <X size={20} color={Colors.text} />
              <Text style={styles.backButtonText}>Back to Search</Text>
            </TouchableOpacity>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${formProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{formProgress}% Complete</Text>
            </View>
          </View>

          {/* Selected Wine Card with Details Preview */}
          <View style={styles.selectedWineCard}>
            <WineIcon size={32} color={Colors.primary} />
            <View style={styles.selectedWineInfo}>
              <Text style={styles.selectedWineName}>{selectedWine.name}</Text>
              <Text style={styles.selectedWineDetails}>
                {selectedWine.region}, {selectedWine.country}
              </Text>
              <Text style={styles.selectedWineGrape}>{selectedWine.grapeVariety}</Text>
              
              {/* Wine Details Preview */}
              {selectedWine.classification && (
                <View style={styles.wineDetailRow}>
                  <Info size={14} color={Colors.primary} />
                  <Text style={styles.wineDetailText}>{selectedWine.classification}</Text>
                </View>
              )}
              {selectedWine.avgPrice && (
                <View style={styles.wineDetailRow}>
                  <DollarSign size={14} color={Colors.primary} />
                  <Text style={styles.wineDetailText}>Avg Market: €{selectedWine.avgPrice}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Inventory Context */}
          {inventoryContext.hasWine && (
            <View style={styles.inventoryContextCard}>
              <View style={styles.contextHeader}>
                <Package size={16} color={Colors.warning} />
                <Text style={styles.contextTitle}>Already in Inventory</Text>
              </View>
              <Text style={styles.contextText}>
                You have {inventoryContext.existingVersions.length} version(s) of this wine:
              </Text>
              {inventoryContext.existingVersions.slice(0, 3).map((wine) => (
                <Text key={wine.id} style={styles.contextWine}>
                  • {wine.year} ({wine.quantity} bottles)
                </Text>
              ))}
              <View style={styles.contextStats}>
                <Text style={styles.contextStat}>Total: {inventoryContext.totalBottles} bottles</Text>
                <Text style={styles.contextStat}>Avg Price: €{inventoryContext.avgPurchasePrice}</Text>
              </View>
            </View>
          )}

          {/* Producer Selection with Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Building2 size={16} color={Colors.text} /> Select Producer (Optional)
            </Text>
            
            {selectedWine.producers.length > 10 && (
              <TextInput
                style={styles.producerSearch}
                placeholder="Search producers..."
                placeholderTextColor={Colors.lightText}
                value={producerSearchQuery}
                onChangeText={setProducerSearchQuery}
              />
            )}
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.producerScroll}>
              {selectedWine.producers
                .filter((p) => 
                  producerSearchQuery === '' || 
                  p.toLowerCase().includes(producerSearchQuery.toLowerCase())
                )
                .slice(0, 20)
                .map((producer) => (
                  <TouchableOpacity
                    key={producer}
                    style={[
                      styles.producerChip,
                      selectedProducer === producer && styles.producerChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedProducer(producer);
                      setProducerSearchQuery('');
                    }}
                  >
                    <Text
                      style={[
                        styles.producerChipText,
                        selectedProducer === producer && styles.producerChipTextSelected,
                      ]}
                    >
                      {producer}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          {/* Enhanced Year Selection with Quick Pick */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Calendar size={16} color={Colors.text} />
                <Text style={styles.sectionTitle}>Vintage Year *</Text>
              </View>
              {formErrors.year && <Text style={styles.errorText}>{formErrors.year}</Text>}
            </View>
            
            {/* Quick Year Selection */}
            <View style={styles.quickYearsContainer}>
              {quickYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.quickYearButton,
                    selectedYear === year.toString() && styles.quickYearButtonSelected,
                  ]}
                  onPress={() => handleQuickYearSelect(year)}
                >
                  <Text
                    style={[
                      styles.quickYearText,
                      selectedYear === year.toString() && styles.quickYearTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={[styles.input, formErrors.year && styles.inputError]}
              value={selectedYear}
              onChangeText={setSelectedYear}
              placeholder="Or enter custom year"
              placeholderTextColor={Colors.lightText}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          {/* Supplier with Memory */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Supplier *</Text>
              {formErrors.supplier && <Text style={styles.errorText}>{formErrors.supplier}</Text>}
            </View>
            
            {supplierMemory.hasSuppliers && (
              <View style={styles.supplierSuggestions}>
                <Text style={styles.suggestionLabel}>Recent suppliers:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {supplierMemory.suggestions.map((sugg) => (
                    <TouchableOpacity
                      key={sugg.name}
                      style={[
                        styles.supplierChip,
                        supplier === sugg.name && styles.supplierChipSelected,
                      ]}
                      onPress={() => setSupplier(sugg.name)}
                    >
                      <Text
                        style={[
                          styles.supplierChipText,
                          supplier === sugg.name && styles.supplierChipTextSelected,
                        ]}
                      >
                        {sugg.name}
                      </Text>
                      <Text style={styles.supplierChipCount}>({sugg.frequency})</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            <TextInput
              style={[styles.input, formErrors.supplier && styles.inputError]}
              value={supplier}
              onChangeText={setSupplier}
              placeholder="Enter supplier name"
              placeholderTextColor={Colors.lightText}
            />
          </View>

          {/* Smart Pricing with Explanation */}
          <View style={styles.section}>
            <View style={styles.pricingHeader}>
              <Text style={styles.sectionTitle}>Pricing *</Text>
              <TouchableOpacity
                style={styles.calculatorButton}
                onPress={() => setShowPriceCalculator(true)}
              >
                <Calculator size={16} color={Colors.primary} />
                <Text style={styles.calculatorButtonText}>Calculator</Text>
              </TouchableOpacity>
            </View>
            
            {/* Price Explanation */}
            {priceExplanation && (
              <View style={styles.priceExplanationCard}>
                <Lightbulb size={16} color={Colors.primary} />
                <Text style={styles.priceExplanationText}>{priceExplanation}</Text>
              </View>
            )}
            
            <View style={styles.row}>
              <View style={styles.halfField}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.fieldLabel}>Purchase Price</Text>
                  {formErrors.purchasePrice && <Text style={styles.errorText}>{formErrors.purchasePrice}</Text>}
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>€</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput, formErrors.purchasePrice && styles.inputError]}
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="0.00"
                    placeholderTextColor={Colors.lightText}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.halfField}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.fieldLabel}>Selling Price</Text>
                  {formErrors.sellingPrice && <Text style={styles.errorText}>{formErrors.sellingPrice}</Text>}
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>€</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput, formErrors.sellingPrice && styles.inputError]}
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                    placeholder="0.00"
                    placeholderTextColor={Colors.lightText}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            {/* Margin Display */}
            {purchasePrice && sellingPrice && parseFloat(sellingPrice) > parseFloat(purchasePrice) && (
              <View style={styles.marginDisplay}>
                <Text style={styles.marginLabel}>Margin:</Text>
                <Text style={styles.marginValue}>
                  {(((parseFloat(sellingPrice) - parseFloat(purchasePrice)) / parseFloat(purchasePrice)) * 100).toFixed(1)}%
                </Text>
                <Text style={styles.profitLabel}>Profit: €{(parseFloat(sellingPrice) - parseFloat(purchasePrice)).toFixed(2)}</Text>
              </View>
            )}
          </View>

          {/* Smart Quantities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantities *</Text>
            
            {/* Quantity Explanation */}
            {quantityDefaults.explanation && (
              <View style={styles.quantityExplanation}>
                <Package size={14} color={Colors.lightText} />
                <Text style={styles.quantityExplanationText}>{quantityDefaults.explanation}</Text>
              </View>
            )}
            
            <View style={styles.row}>
              <View style={styles.halfField}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.fieldLabel}>Current Quantity</Text>
                  {formErrors.quantity && <Text style={styles.errorText}>{formErrors.quantity}</Text>}
                </View>
                <TextInput
                  style={[styles.input, formErrors.quantity && styles.inputError]}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="0"
                  placeholderTextColor={Colors.lightText}
                  keyboardType="numeric"
                />
                {/* Quick Quantity Presets */}
                <View style={styles.quickQuantities}>
                  {[6, 12, 24, 36].map((qty) => (
                    <TouchableOpacity
                      key={qty}
                      style={[
                        styles.quickQtyButton,
                        quantity === qty.toString() && styles.quickQtyButtonSelected,
                      ]}
                      onPress={() => setQuantity(qty.toString())}
                    >
                      <Text
                        style={[
                          styles.quickQtyText,
                          quantity === qty.toString() && styles.quickQtyTextSelected,
                        ]}
                      >
                        {qty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Target Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={quantityTarget}
                  onChangeText={setQuantityTarget}
                  placeholder="24"
                  placeholderTextColor={Colors.lightText}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.addButton,
                Object.keys(formErrors).length > 0 && styles.addButtonDisabled,
              ]}
              onPress={handleAddWine}
              disabled={Object.keys(formErrors).length > 0}
            >
              <Plus size={20} color={Colors.secondary} />
              <Text style={styles.addButtonText}>Add to Inventory</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.batchAddButton}
              onPress={() => setShowBatchAdd(true)}
            >
              <Layers size={18} color={Colors.primary} />
              <Text style={styles.batchAddButtonText}>Batch Add Vintages</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modals */}
        <PriceCalculatorModal
          visible={showPriceCalculator}
          onClose={() => setShowPriceCalculator(false)}
          initialPurchasePrice={purchasePrice}
          onApply={(purchase, selling, margin) => {
            setPurchasePrice(purchase.toFixed(2));
            setSellingPrice(selling.toFixed(2));
            setPriceExplanation(`Calculated with ${(margin * 100).toFixed(1)}% margin`);
          }}
        />
        
        <BatchAddModal
          visible={showBatchAdd}
          wine={selectedWine}
          producer={selectedProducer}
          supplier={supplier}
          purchasePrice={purchasePrice}
          sellingPrice={sellingPrice}
          minQuantity={minQuantity}
          quantityTarget={quantityTarget}
          onClose={() => setShowBatchAdd(false)}
          onBatchAdd={handleBatchAdd}
        />
        
        <DuplicateWineDialog
          visible={showDuplicateDialog}
          duplicateWine={duplicateMatch?.wine || null}
          matchType={duplicateMatch?.matchType || 'exact'}
          confidence={duplicateMatch?.confidence || 0}
          onUpdateQuantity={handleDuplicateUpdate}
          onAddAnyway={handleDuplicateAddAnyway}
          onCancel={() => setShowDuplicateDialog(false)}
        />

        <Toast message={toastMessage} visible={showToast} onClose={() => setShowToast(false)} />
      </View>
    );
  }

  // Search view
  return (
    <View style={styles.container}>
      {/* Recently Added Strip */}
      <RecentlyAddedStrip onWineSelect={handleRecentWineSelect} />
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.lightText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, region, or producer..."
          placeholderTextColor={Colors.lightText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={18} color={Colors.lightText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Advanced Filters */}
      {searchResults.length > 0 && (
        <WineDatabaseFilters
          typeFilter={filters.type}
          countryFilter={filters.country}
          classificationFilter={filters.classification}
          sortBy={filters.sortBy}
          availableClassifications={availableClassifications}
          onTypeChange={(type) => setFilter('type', type)}
          onCountryChange={(country) => setFilter('country', country)}
          onClassificationChange={(classification) => setFilter('classification', classification)}
          onSortChange={(sort) => setFilter('sortBy', sort)}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}
      
      {/* Results */}
      <View style={styles.resultsContainer}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : showPopular ? (
          <>
            <Text style={styles.resultsTitle}>Popular Wines</Text>
            <FlatList
              data={popularWines}
              renderItem={renderWineItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </>
        ) : searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>
              {filteredWines.length} result{filteredWines.length !== 1 ? 's' : ''} found
              {hasActiveFilters && ` (filtered from ${searchResults.length})`}
            </Text>
            <FlatList
              data={filteredWines}
              renderItem={renderWineItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <WineIcon size={48} color={Colors.lightText} />
            <Text style={styles.emptyText}>No wines found</Text>
            <Text style={styles.emptySubtext}>Try searching for "Brunello", "Barolo", or "Chianti"</Text>
          </View>
        )}
      </View>
      
      {/* Success Actions Modal */}
      <SuccessActionsModal
        visible={showSuccessActions}
        wineName={lastAddedWineName}
        onViewInventory={() => {
          setShowSuccessActions(false);
          router.push('/(tabs)');
        }}
        onAddAnother={() => {
          setShowSuccessActions(false);
          // Keep the current wine selected, just reset year and quantity
          setSelectedYear('');
          setQuantity('');
        }}
        onSearchAgain={() => {
          setShowSuccessActions(false);
          handleBack();
        }}
      />
      
      <Toast message={toastMessage} visible={showToast} onClose={() => setShowToast(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lightText,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  wineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  wineInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  wineDetails: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 2,
  },
  wineProducers: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.lightText,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedWineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedWineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedWineName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  selectedWineDetails: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 2,
  },
  selectedWineGrape: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  producerScroll: {
    marginTop: 8,
  },
  producerChip: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  producerChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  producerChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  producerChipTextSelected: {
    color: Colors.secondary,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfField: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  // New Enhanced Styles
  formHeader: {
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
    textAlign: 'right',
  },
  wineDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  wineDetailText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  inventoryContextCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warning,
  },
  contextText: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 8,
  },
  contextWine: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 8,
    marginBottom: 2,
  },
  contextStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  contextStat: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  producerSearch: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 2,
  },
  inputError: {
    borderColor: Colors.danger,
    borderWidth: 2,
  },
  quickYearsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quickYearButton: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  quickYearButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickYearText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  quickYearTextSelected: {
    color: Colors.secondary,
  },
  supplierSuggestions: {
    marginBottom: 12,
  },
  suggestionLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 8,
  },
  supplierChip: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  supplierChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  supplierChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  supplierChipTextSelected: {
    color: Colors.secondary,
  },
  supplierChipCount: {
    fontSize: 12,
    color: Colors.lightText,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calculatorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  priceExplanationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(125, 29, 63, 0.2)',
  },
  priceExplanationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  marginDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  marginLabel: {
    fontSize: 13,
    color: Colors.text,
  },
  marginValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  profitLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  quantityExplanation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  quantityExplanationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.lightText,
  },
  quickQuantities: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  quickQtyButton: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  quickQtyButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickQtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  quickQtyTextSelected: {
    color: Colors.secondary,
  },
  actionButtons: {
    gap: 12,
  },
  batchAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  batchAddButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});
