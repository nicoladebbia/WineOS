import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Alert,
  Platform
} from 'react-native';
import { useWineStore } from '@/store/wineStore';
import { Wine, DailySaleFormData, Sale } from '@/types/wine';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Search, Calendar, ShoppingCart, Wine as WineIcon, X, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import EmptyState from '@/components/EmptyState';
import Toast from '@/components/Toast';

export default function DailySalesScreen() {
  const wines = useWineStore((state) => state.wines);
  const searchWines = useWineStore((state) => state.searchWines);
  const recordSale = useWineStore((state) => state.recordSale);
  const getTotalSalesInPeriod = useWineStore((state) => state.getTotalSalesInPeriod);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showWineDropdown, setShowWineDropdown] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [formData, setFormData] = useState<DailySaleFormData>({
    wineId: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState<string | null>(null);
  const [todaySales, setTodaySales] = useState<{wine: Wine, sale: Sale}[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate sales statistics
  const todayBottles = getTotalSalesInPeriod(1);
  const weeklyBottles = getTotalSalesInPeriod(7);
  const monthlyBottles = getTotalSalesInPeriod(30);
  
  // Filter wines based on search query
  const filteredWines = searchQuery ? searchWines(searchQuery) : wines;
  
  // Get all sales made today
  useEffect(() => {
    const salesToday: {wine: Wine, sale: Sale}[] = [];
    
    wines.forEach(wine => {
      // Check if wine.sales exists and is an array before calling forEach
      if (wine.sales && Array.isArray(wine.sales)) {
        wine.sales.forEach(sale => {
          if (sale.date === today) {
            salesToday.push({ wine, sale });
          }
        });
      }
    });
    
    // Sort by most recent first
    salesToday.sort((a, b) => {
      return new Date(b.sale.date).getTime() - new Date(a.sale.date).getTime();
    });
    
    setTodaySales(salesToday);
  }, [wines, today]);
  
  const handleWineSelect = (wine: Wine) => {
    setSelectedWine(wine);
    setFormData(prev => ({
      ...prev,
      wineId: wine.id
    }));
    setShowWineDropdown(false);
    setSearchQuery('');
  };
  
  const handleQuantityChange = (value: string) => {
    // Only allow positive integers
    if (/^\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        quantity: value
      }));
      setError(null);
    }
  };
  
  const validateForm = (): boolean => {
    if (!selectedWine) {
      setError(translations.formValidation.required);
      return false;
    }
    
    const quantityNum = parseInt(String(formData.quantity), 10);
    
    if (!formData.quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError(translations.formValidation.positiveNumber);
      return false;
    }
    
    if (selectedWine.quantity <= 0) {
      setError(translations.formValidation.noStock);
      return false;
    }
    
    if (quantityNum > selectedWine.quantity) {
      setError(translations.formValidation.insufficientStock);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!validateForm()) {
      return;
    }
    
    recordSale(
      formData.wineId, 
      parseInt(String(formData.quantity), 10), 
      formData.date
    );
    
    setToastMessage(translations.sales.success);
    setShowToast(true);
    
    // Reset form
    setSelectedWine(null);
    setFormData({
      wineId: '',
      quantity: 1,
      date: today
    });
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const renderWineItem = ({ item }: { item: Wine }) => (
    <TouchableOpacity
      style={styles.wineItem}
      onPress={() => handleWineSelect(item)}
    >
      <View style={styles.wineItemContent}>
        <WineIcon size={16} color={Colors.primary} />
        <View style={styles.wineItemInfo}>
          <Text style={styles.wineItemName}>{item.name}</Text>
          <Text style={styles.wineItemDetails}>
            {item.year} • {item.region}, {item.country} • {translations.wine.quantity}: {item.quantity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderTodaySaleItem = ({ item }: { item: {wine: Wine, sale: Sale} }) => (
    <View style={styles.saleItem}>
      <View style={styles.saleItemLeft}>
        <Text style={styles.saleItemWine}>{item.wine.name}</Text>
        <Text style={styles.saleItemDetails}>
          {item.wine.year} • {item.wine.region}, {item.wine.country}
        </Text>
      </View>
      <View style={styles.saleItemRight}>
        <Text style={styles.saleItemQuantity}>{item.sale.quantity} {item.sale.quantity === 1 ? 'bottiglia' : 'bottiglie'}</Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, todayBottles === 0 && styles.zeroValue]}>{todayBottles}</Text>
            <Text style={styles.statLabel}>{translations.sales.todaySales}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, weeklyBottles === 0 && styles.zeroValue]}>{weeklyBottles}</Text>
            <Text style={styles.statLabel}>{translations.sales.weeklySales}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, monthlyBottles === 0 && styles.zeroValue]}>{monthlyBottles}</Text>
            <Text style={styles.statLabel}>{translations.sales.monthlySales}</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{translations.sales.title}</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{translations.sales.selectWine}</Text>
            <TouchableOpacity
              style={styles.wineSelector}
              onPress={() => setShowWineDropdown(!showWineDropdown)}
            >
              <Text style={selectedWine ? styles.selectedWineText : styles.placeholderText}>
                {selectedWine ? selectedWine.name : translations.sales.selectWine}
              </Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
            
            {showWineDropdown && (
              <View style={styles.dropdownContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={18} color={Colors.lightText} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={translations.actions.search}
                    placeholderTextColor={Colors.lightText}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                      <X size={16} color={Colors.lightText} />
                    </TouchableOpacity>
                  )}
                </View>
                
                <FlatList
                  data={filteredWines}
                  renderItem={renderWineItem}
                  keyExtractor={(item) => item.id}
                  style={styles.wineList}
                  contentContainerStyle={styles.wineListContent}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text style={styles.emptyListText}>Nessun vino trovato</Text>
                  }
                />
              </View>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{translations.sales.quantity}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={String(formData.quantity)}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={Colors.lightText}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{translations.sales.date}</Text>
            <View style={styles.dateInputContainer}>
              <Calendar size={18} color={Colors.primary} style={styles.calendarIcon} />
              <TextInput
                style={styles.dateInput}
                value={formData.date}
                onChangeText={(value) => setFormData(prev => ({ ...prev, date: value }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.lightText}
                editable={false}
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedWine || selectedWine.quantity <= 0) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!selectedWine || selectedWine.quantity <= 0}
          >
            <ShoppingCart size={20} color={Colors.secondary} />
            <Text style={styles.submitButtonText}>{translations.sales.submit}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.todaySalesContainer}>
          <Text style={styles.todaySalesTitle}>{translations.sales.todaySales}</Text>
          
          {todaySales.length > 0 ? (
            <FlatList
              data={todaySales}
              renderItem={renderTodaySaleItem}
              keyExtractor={(item) => item.sale.id}
              scrollEnabled={false}
              contentContainerStyle={styles.todaySalesListContent}
            />
          ) : (
            <EmptyState
              title={translations.emptyState.noSales}
              description={translations.emptyState.noSalesDescription}
            />
          )}
        </View>
      </ScrollView>
      
      <Toast
        message={toastMessage}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </View>
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
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.divider,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  zeroValue: {
    color: Colors.lightText,
    opacity: 0.7,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.lightText,
    textAlign: 'center',
  },
  formContainer: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  wineSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  placeholderText: {
    color: Colors.lightText,
    fontSize: 16,
  },
  selectedWineText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownContainer: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.divider,
    maxHeight: 300,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  wineList: {
    maxHeight: 200,
  },
  wineListContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  wineItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  wineItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wineItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  wineItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  wineItemDetails: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 2,
  },
  emptyListText: {
    padding: 16,
    textAlign: 'center',
    color: Colors.lightText,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: Colors.lightText,
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  todaySalesContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todaySalesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  todaySalesListContent: {
    paddingBottom: 8,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  saleItemLeft: {
    flex: 1,
  },
  saleItemWine: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  saleItemDetails: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 2,
  },
  saleItemRight: {
    marginLeft: 8,
  },
  saleItemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});