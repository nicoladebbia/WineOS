import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WineFormData, WineType, Country, Wine } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import { regions } from '@/constants/regions';
import { translations } from '@/constants/translations';
import Colors from '@/constants/colors';
import {
  ChevronDown,
  Save,
  CheckCircle,
  Percent,
  Package,
  Lightbulb,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';

interface QuickAddFormProps {
  onSuccess?: () => void;
}

// Constants for magic numbers
const MIN_SEARCH_LENGTH = 3;
const MAX_RECENT_SUPPLIERS = 5;
const MIN_QUANTITY_RATIO = 0.25;
const DEFAULT_MIN_QUANTITY = 6;
const DEFAULT_TARGET_QUANTITY = 24;
const TOAST_DURATION = 2000;
const CURRENCY_SYMBOL = '€';
const MAX_PRICE = 10000; // Maximum price per bottle (€10,000)
const MAX_QUANTITY = 100000; // Maximum quantity (100,000 bottles)
const MIN_PRICE_FOR_MARGIN = 0.01; // Minimum price to calculate meaningful margin
const DECIMAL_PRECISION = 2; // Decimal places for prices
const SEARCH_DEBOUNCE_MS = 300; // Debounce delay for name search

// Quantity presets for wine cases
const QUANTITY_PRESETS = [
  { label: '1', value: 1, subtitle: 'bottle' },
  { label: '6', value: 6, subtitle: '½ case' },
  { label: '12', value: 12, subtitle: 'case' },
  { label: '24', value: 24, subtitle: '2 cases' },
  { label: '36', value: 36, subtitle: '3 cases' },
  { label: '48', value: 48, subtitle: '4 cases' },
];

// Margin presets for pricing
const MARGIN_PRESETS = [
  { label: '30', value: 0.3 },
  { label: '40', value: 0.4 },
  { label: '50', value: 0.5 },
  { label: '60', value: 0.6 },
];

export default function QuickAddFormSimple({ onSuccess }: QuickAddFormProps) {
  const router = useRouter();
  const addWine = useWineStore((state) => state.addWine);
  const updateWine = useWineStore((state) => state.updateWine);
  const wines = useWineStore((state) => state.wines);

  // Calculate smart defaults (works invisibly) - Only recalculate when wine count changes
  const smartDefaults = useMemo(() => {
    if (wines.length === 0) {
      return {
        recentSuppliers: [],
      };
    }

    // Get most common suppliers, filter out empty strings
    const supplierCounts = wines.reduce((acc, wine) => {
      if (wine.supplier && wine.supplier.trim().length > 0) {
        acc[wine.supplier] = (acc[wine.supplier] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const sortedSuppliers = Object.entries(supplierCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([supplier]) => supplier);
    
    const recentSuppliers = sortedSuppliers.slice(0, MAX_RECENT_SUPPLIERS);

    return {
      recentSuppliers,
    };
  }, [wines.length]); // Only recalculate when count changes, not on every wine mutation

  const [formData, setFormData] = useState<WineFormData>({
    name: '',
    year: new Date().getFullYear(),
    type: 'Red',
    country: 'Italy',
    region: '',
    grapeVariety: '',
    supplier: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    minQuantity: DEFAULT_MIN_QUANTITY.toString(),
    quantityTarget: DEFAULT_TARGET_QUANTITY.toString(),
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WineFormData, string>>>({});
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedMargin, setSelectedMargin] = useState<number | null>(null); // No default - user must select
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for cleanup and preventing race conditions
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const duplicateFlowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);
  
  // Smart auto-population based on wine name
  const [suggestions, setSuggestions] = useState<{
    region?: string;
    grapeVariety?: string;
    supplier?: string;
  }>({});

  const wineTypes: WineType[] = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
  const countries: Country[] = ['Italy', 'France', 'Spain', 'USA', 'Argentina', 'Australia', 'Germany', 'Portugal', 'South Africa', 'Chile'];

  // Removed auto-populate supplier - user must select manually for clean slate
  
  // Generate year options (current year back to 1900 for vintage wines) - Memoized for performance
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  }, []);

  // Smart auto-population when name changes (works invisibly) - with debouncing
  useEffect(() => {
    // Clear previous debounce timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (formData.name.length >= MIN_SEARCH_LENGTH) {
      // Debounce the search to avoid excessive filtering on every keystroke
      searchDebounceRef.current = setTimeout(() => {
        // Find matching wines for auto-population
        const matchingWines = wines.filter(wine =>
          wine.name.toLowerCase().includes(formData.name.toLowerCase())
        );

        if (matchingWines.length > 0) {
          const mostRecent = matchingWines[matchingWines.length - 1];
          // Always set suggestions - the UI will decide what to show based on filled fields
          setSuggestions({
            region: mostRecent.region || undefined,
            grapeVariety: mostRecent.grapeVariety || undefined,
            supplier: mostRecent.supplier || undefined,
          });
        } else {
          setSuggestions({});
        }
      }, SEARCH_DEBOUNCE_MS);
    } else {
      setSuggestions({});
    }

    // Cleanup on unmount
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [formData.name, wines]); // findSimilarWine removed - not needed, only wines array matters

  // Auto-calculate selling price based on margin
  const handlePurchasePriceChange = (value: string) => {
    // Sanitize input - only allow numbers and single decimal point with max 2 decimal places
    const parts = value.replace(/[^0-9.]/g, '').split('.');
    let sanitized = parts.length > 1 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : parts[0];
    
    // Limit decimal precision to 2 places
    if (sanitized.includes('.')) {
      const [whole, decimal] = sanitized.split('.');
      sanitized = whole + '.' + decimal.slice(0, DECIMAL_PRECISION);
    }
    
    setFormData(prev => ({ ...prev, purchasePrice: sanitized }));
    
    if (sanitized && !isNaN(Number(sanitized)) && selectedMargin !== null) {
      const purchase = Number(sanitized);
      const selling = (purchase * (1 + selectedMargin)).toFixed(2);
      setFormData(prev => ({ ...prev, sellingPrice: selling }));
    } else if (selectedMargin !== null && !sanitized) {
      // Clear selling price if purchase price is cleared
      setFormData(prev => ({ ...prev, sellingPrice: '' }));
    }
  };

  // Apply margin preset
  const applyMargin = (margin: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedMargin(margin);
    
    if (formData.purchasePrice && !isNaN(Number(formData.purchasePrice))) {
      const purchase = Number(formData.purchasePrice);
      const selling = (purchase * (1 + margin)).toFixed(2);
      setFormData(prev => ({ ...prev, sellingPrice: selling }));
      
      // Clear selling price error if it exists
      if (errors.sellingPrice) {
        setErrors(prev => ({ ...prev, sellingPrice: undefined }));
      }
    }
  };

  // Apply quantity preset
  const applyQuantityPreset = (quantity: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setFormData(prev => ({ 
      ...prev, 
      quantity: quantity.toString(),
      minQuantity: Math.max(1, Math.floor(quantity * MIN_QUANTITY_RATIO)).toString(),
      quantityTarget: Math.max(quantity, DEFAULT_TARGET_QUANTITY).toString(),
    }));
    
    // Clear quantity error if it exists
    if (errors.quantity) {
      setErrors(prev => ({ ...prev, quantity: undefined }));
    }
  };

  // Apply suggestion
  const applySuggestion = (field: 'region' | 'grapeVariety' | 'supplier') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const value = suggestions[field];
    if (value) {
      // If applying region, batch both region and country updates to avoid double render
      if (field === 'region') {
        const country = Object.entries(regions).find(([_, regionList]) =>
          regionList.includes(value)
        )?.[0] as Country;
        
        // Single state update with both changes
        setFormData(prev => ({ 
          ...prev, 
          region: value,
          ...(country && { country })
        }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
      
      // Clear this specific suggestion after applying it
      setSuggestions(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (field: keyof WineFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WineFormData, string>> = {};

    const requiredFields: (keyof WineFormData)[] = [
      'name', 'year', 'country', 'region', 'supplier',
      'purchasePrice', 'sellingPrice', 'quantity', 'minQuantity', 'quantityTarget'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
        newErrors[field] = `${fieldName} is required`;
      }
    });

    const numericFields: (keyof WineFormData)[] = [
      'year', 'purchasePrice', 'sellingPrice', 'quantity', 'minQuantity', 'quantityTarget'
    ];

    numericFields.forEach(field => {
      if (formData[field] && (isNaN(Number(formData[field])) || Number(formData[field]) <= 0)) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
        newErrors[field] = `${fieldName} must be greater than zero`;
      }
    });

    // Validate price upper limits
    if (formData.purchasePrice && Number(formData.purchasePrice) > MAX_PRICE) {
      newErrors.purchasePrice = `Purchase price cannot exceed ${CURRENCY_SYMBOL}${MAX_PRICE.toLocaleString()}`;
    }
    if (formData.sellingPrice && Number(formData.sellingPrice) > MAX_PRICE) {
      newErrors.sellingPrice = `Selling price cannot exceed ${CURRENCY_SYMBOL}${MAX_PRICE.toLocaleString()}`;
    }

    // Validate quantity upper limit
    if (formData.quantity && Number(formData.quantity) > MAX_QUANTITY) {
      newErrors.quantity = `Quantity cannot exceed ${MAX_QUANTITY.toLocaleString()} bottles`;
    }
    if (formData.quantityTarget && Number(formData.quantityTarget) > MAX_QUANTITY) {
      newErrors.quantityTarget = `Target quantity cannot exceed ${MAX_QUANTITY.toLocaleString()} bottles`;
    }

    const currentYear = new Date().getFullYear();
    if (Number(formData.year) > currentYear || Number(formData.year) < 1900) {
      newErrors.year = `Year must be between 1900 and ${currentYear}`;
    }

    // Validate selling price > purchase price
    if (formData.purchasePrice && formData.sellingPrice) {
      if (Number(formData.sellingPrice) <= Number(formData.purchasePrice)) {
        newErrors.sellingPrice = 'Selling price must be higher than purchase price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Prevent rapid double-clicks with ref (synchronous check)
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    if (!validateForm()) {
      isSubmittingRef.current = false;
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    // Smart duplicate detection - check for EXACT match (name + year)
    const exactMatch = wines.find(wine => {
      const nameMatch = wine.name.toLowerCase().trim() === formData.name.toLowerCase().trim();
      const yearMatch = wine.year === Number(formData.year);
      return nameMatch && yearMatch;
    });

    if (exactMatch) {
      const quantityToAdd = Number(formData.quantity);
      const currentStock = exactMatch.quantity;
      const newTotal = currentStock + quantityToAdd;
      
      if (Platform.OS === 'web') {
        const confirmed = window.confirm(
          `🍷 This Wine Already Exists!\n\n${exactMatch.name} (${exactMatch.year})\nRegion: ${exactMatch.region}\n\n📦 Current stock: ${currentStock} bottles\n➕ Adding: ${quantityToAdd} bottles\n━━━━━━━━━━━━━━━\n📊 New total: ${newTotal} bottles\n\nAdd to existing inventory?`
        );
        if (confirmed) {
          updateWine(exactMatch.id, { 
            quantity: newTotal,
            // Optionally update prices if they changed
            purchasePrice: Number(Number(formData.purchasePrice).toFixed(DECIMAL_PRECISION)),
            sellingPrice: Number(Number(formData.sellingPrice).toFixed(DECIMAL_PRECISION)),
          });
          setToastMessage(`Added ${quantityToAdd} bottles to ${exactMatch.name}. New total: ${newTotal}`);
          setShowToast(true);
          
          // Reset form and navigate - tracked for cleanup
          duplicateFlowTimeoutRef.current = setTimeout(() => {
            setFormData({
              name: '',
              year: new Date().getFullYear(),
              type: 'Red',
              country: 'Italy',
              region: '',
              grapeVariety: '',
              supplier: '',
              purchasePrice: '',
              sellingPrice: '',
              quantity: '',
              minQuantity: DEFAULT_MIN_QUANTITY.toString(),
              quantityTarget: DEFAULT_TARGET_QUANTITY.toString(),
              notes: '',
            });
            setSelectedMargin(null);
            setSuggestions({});
            setErrors({});
            isSubmittingRef.current = false;
            
            if (onSuccess) {
              onSuccess();
            } else {
              router.push(`/wine/${exactMatch.id}`);
            }
          }, TOAST_DURATION);
        } else {
          isSubmittingRef.current = false;
        }
        return;
      } else {
        // Mobile Alert
        Alert.alert(
          '🍷 This Wine Already Exists!',
          `${exactMatch.name} (${exactMatch.year})\nRegion: ${exactMatch.region}\n\n📦 Current stock: ${currentStock} bottles\n➕ Adding: ${quantityToAdd} bottles\n━━━━━━━━━━━━━━━\n📊 New total: ${newTotal} bottles`,
          [
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => {
                isSubmittingRef.current = false;
              }
            },
            { 
              text: `Add ${quantityToAdd} Bottles`, 
              style: 'default',
              onPress: () => {
                updateWine(exactMatch.id, { 
                  quantity: newTotal,
                  purchasePrice: Number(Number(formData.purchasePrice).toFixed(DECIMAL_PRECISION)),
                  sellingPrice: Number(Number(formData.sellingPrice).toFixed(DECIMAL_PRECISION)),
                });
                setToastMessage(`Added ${quantityToAdd} bottles. New total: ${newTotal}`);
                setShowToast(true);
                
                // Reset form and navigate - tracked for cleanup
                duplicateFlowTimeoutRef.current = setTimeout(() => {
                  setFormData({
                    name: '',
                    year: new Date().getFullYear(),
                    type: 'Red',
                    country: 'Italy',
                    region: '',
                    grapeVariety: '',
                    supplier: '',
                    purchasePrice: '',
                    sellingPrice: '',
                    quantity: '',
                    minQuantity: DEFAULT_MIN_QUANTITY.toString(),
                    quantityTarget: DEFAULT_TARGET_QUANTITY.toString(),
                    notes: '',
                  });
                  setSelectedMargin(null);
                  setSuggestions({});
                  setErrors({});
                  isSubmittingRef.current = false;
                  
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    router.push(`/wine/${exactMatch.id}`);
                  }
                }, TOAST_DURATION);
              }
            }
          ]
        );
        return;
      }
    }

    // No duplicate - proceed with normal submit
    submitWine();
  };

  const submitWine = () => {
    setIsSubmitting(true);

    const wineData = {
      name: formData.name.trim(), // Trim whitespace to prevent duplicates
      year: Number(formData.year),
      type: formData.type,
      country: formData.country,
      region: formData.region,
      grapeVariety: formData.grapeVariety.trim(),
      supplier: formData.supplier.trim(),
      purchasePrice: Number(Number(formData.purchasePrice).toFixed(DECIMAL_PRECISION)),
      sellingPrice: Number(Number(formData.sellingPrice).toFixed(DECIMAL_PRECISION)),
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
      quantityTarget: Number(formData.quantityTarget),
      averageWeeklySales: 0,
      notes: formData.notes.trim(),
    };

    try {
      addWine(wineData);
      setToastMessage(translations.notifications.wineAdded);
      setShowToast(true);

      // Store timeout for cleanup
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        
        // Reset form to initial state
        setFormData({
          name: '',
          year: new Date().getFullYear(),
          type: 'Red',
          country: 'Italy',
          region: '',
          grapeVariety: '',
          supplier: '',
          purchasePrice: '',
          sellingPrice: '',
          quantity: '',
          minQuantity: DEFAULT_MIN_QUANTITY.toString(),
          quantityTarget: DEFAULT_TARGET_QUANTITY.toString(),
          notes: '',
        });
        setSelectedMargin(null);
        setSuggestions({});
        setErrors({});
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Safe navigation - check if can go back
          if (router.canGoBack && router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }
      }, TOAST_DURATION);
    } catch (error) {
      console.error('Failed to add wine:', error);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      setToastMessage('Failed to add wine. Please try again.');
      setShowToast(true);
      
      // Auto-hide error toast - tracked for cleanup
      errorToastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, TOAST_DURATION);
    }
  };

  const profit = useMemo(() => {
    const purchase = parseFloat(formData.purchasePrice);
    const selling = parseFloat(formData.sellingPrice);
    if (!isNaN(purchase) && !isNaN(selling)) {
      return selling - purchase;
    }
    return 0;
  }, [formData.purchasePrice, formData.sellingPrice]);

  const profitMargin = useMemo(() => {
    const purchase = parseFloat(formData.purchasePrice);
    const selling = parseFloat(formData.sellingPrice);
    // Prevent absurd margins from very small purchase prices
    if (!isNaN(purchase) && !isNaN(selling) && purchase >= MIN_PRICE_FOR_MARGIN) {
      return ((selling - purchase) / purchase) * 100;
    }
    return 0;
  }, [formData.purchasePrice, formData.sellingPrice]);

  // Cleanup all timeouts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
      if (duplicateFlowTimeoutRef.current) {
        clearTimeout(duplicateFlowTimeoutRef.current);
      }
      if (errorToastTimeoutRef.current) {
        clearTimeout(errorToastTimeoutRef.current);
      }
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >

        {/* Wine Name */}
        <FormField label="Wine Name" error={errors.name} required>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={value => handleChange('name', value)}
            placeholder="e.g., Barolo Riserva"
            placeholderTextColor={Colors.lightText}
            maxLength={100}
          />
          {formData.name && !errors.name && (
            <View style={styles.validationIcon}>
              <CheckCircle size={20} color={Colors.success} />
            </View>
          )}
        </FormField>

        {/* Smart Suggestions - Only shows when there are suggestions */}
        {(suggestions.region || suggestions.grapeVariety || suggestions.supplier) && (
          <View style={styles.suggestionsCard}>
            <View style={styles.suggestionsHeader}>
              <Lightbulb size={14} color={Colors.success} />
              <Text style={styles.suggestionsTitle}>Based on similar wines</Text>
            </View>
            {suggestions.region && (
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => applySuggestion('region')}
              >
                <Text style={styles.suggestionRowLabel}>Region:</Text>
                <Text style={styles.suggestionRowValue}>{suggestions.region}</Text>
              </TouchableOpacity>
            )}
            {suggestions.grapeVariety && (
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => applySuggestion('grapeVariety')}
              >
                <Text style={styles.suggestionRowLabel}>Grape:</Text>
                <Text style={styles.suggestionRowValue}>{suggestions.grapeVariety}</Text>
              </TouchableOpacity>
            )}
            {suggestions.supplier && (
              <TouchableOpacity
                style={styles.suggestionRow}
                onPress={() => applySuggestion('supplier')}
              >
                <Text style={styles.suggestionRowLabel}>Supplier:</Text>
                <Text style={styles.suggestionRowValue}>{suggestions.supplier}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Year and Type */}
        <View style={styles.row}>
          <FormField label="Year" error={errors.year} containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton, errors.year && styles.inputError]}
              onPress={() => {
                setShowYearPicker(!showYearPicker);
                setShowTypePicker(false);
                setShowCountryPicker(false);
                setShowRegionPicker(false);
              }}
            >
              <Text style={styles.pickerButtonText}>{formData.year}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>

          <FormField label="Type" containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton]}
              onPress={() => {
                setShowTypePicker(!showTypePicker);
                setShowYearPicker(false);
                setShowCountryPicker(false);
                setShowRegionPicker(false);
              }}
            >
              <Text style={styles.pickerButtonText}>{formData.type}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>
        </View>

        {showYearPicker && (
          <View style={styles.pickerOptions}>
            <ScrollView style={styles.yearScrollView} nestedScrollEnabled>
              {yearOptions.map(year => (
                <TouchableOpacity
                  key={year}
                  style={styles.pickerOption}
                  onPress={() => {
                    handleChange('year', year);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, formData.year === year && styles.pickerOptionSelected]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {showTypePicker && (
          <View style={styles.pickerOptions}>
            <ScrollView style={styles.typeScrollView} nestedScrollEnabled>
              {wineTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={styles.pickerOption}
                  onPress={() => {
                    handleChange('type', type);
                    setShowTypePicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, formData.type === type && styles.pickerOptionSelected]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Country and Region */}
        <View style={styles.row}>
          <FormField label="Country" error={errors.country} containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton]}
              onPress={() => {
                setShowCountryPicker(!showCountryPicker);
                setShowYearPicker(false);
                setShowTypePicker(false);
                setShowRegionPicker(false);
              }}
            >
              <Text style={styles.pickerButtonText}>{formData.country}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>

          <FormField label="Region" error={errors.region} containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton]}
              onPress={() => {
                setShowRegionPicker(!showRegionPicker);
                setShowYearPicker(false);
                setShowTypePicker(false);
                setShowCountryPicker(false);
              }}
            >
              <Text style={styles.pickerButtonText}>{formData.region || 'Select'}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>
        </View>

        {showCountryPicker && (
          <View style={styles.pickerOptions}>
            <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
              {countries.map(country => (
                <TouchableOpacity
                  key={country}
                  style={styles.pickerOption}
                  onPress={() => {
                    handleChange('country', country);
                    handleChange('region', '');
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, formData.country === country && styles.pickerOptionSelected]}>
                    {country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {showRegionPicker && formData.country && regions[formData.country] && (
          <View style={styles.pickerOptions}>
            <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
              {regions[formData.country].map(region => (
                <TouchableOpacity
                  key={region}
                  style={styles.pickerOption}
                  onPress={() => {
                    handleChange('region', region);
                    setShowRegionPicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, formData.region === region && styles.pickerOptionSelected]}>
                    {region}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Supplier with Recent Chips */}
        <FormField label="Supplier" error={errors.supplier} required>
          {smartDefaults.recentSuppliers.length > 0 && (
            <>
              <Text style={styles.supplierHint}>Your most used suppliers (tap to select):</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supplierChipsScroll}>
                {smartDefaults.recentSuppliers.map((supplier, index) => (
                  <TouchableOpacity
                    key={`${supplier}-${index}`}
                    style={[
                      styles.supplierChip,
                      formData.supplier === supplier && styles.supplierChipSelected,
                    ]}
                    onPress={() => handleChange('supplier', supplier)}
                  >
                    <Text
                      style={[
                        styles.supplierChipText,
                        formData.supplier === supplier && styles.supplierChipTextSelected,
                      ]}
                    >
                      {supplier}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
          <TextInput
            style={[styles.input, errors.supplier && styles.inputError]}
            value={formData.supplier}
            onChangeText={value => handleChange('supplier', value)}
            placeholder="Or type custom supplier"
            placeholderTextColor={Colors.lightText}
            maxLength={50}
          />
        </FormField>

        {/* Pricing Section */}
        <View style={styles.pricingCard}>
          <View style={styles.sectionHeader}>
            <Percent size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Pricing</Text>
          </View>
          
          <FormField label="Purchase Price" error={errors.purchasePrice} required>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>{CURRENCY_SYMBOL}</Text>
              <TextInput
                style={[styles.input, styles.priceInput, errors.purchasePrice && styles.inputError]}
                value={formData.purchasePrice.toString()}
                onChangeText={handlePurchasePriceChange}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="decimal-pad"
              />
            </View>
          </FormField>

          {/* Margin Buttons */}
          <View style={styles.marginSection}>
            <Text style={styles.marginLabel}>Quick Margin:</Text>
            <View style={styles.marginButtons}>
              {MARGIN_PRESETS.map(preset => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.marginButton,
                    selectedMargin === preset.value && styles.marginButtonSelected,
                  ]}
                  onPress={() => applyMargin(preset.value)}
                >
                  <Text
                    style={[
                      styles.marginButtonText,
                      selectedMargin === preset.value && styles.marginButtonTextSelected,
                    ]}
                  >
                    {preset.label}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FormField label="Selling Price" error={errors.sellingPrice} required>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>{CURRENCY_SYMBOL}</Text>
              <TextInput
                style={[styles.input, styles.priceInput, errors.sellingPrice && styles.inputError]}
                value={formData.sellingPrice.toString()}
                onChangeText={value => {
                  // Sanitize - only allow numbers and single decimal point with max 2 decimal places
                  const parts = value.replace(/[^0-9.]/g, '').split('.');
                  let sanitized = parts.length > 1 
                    ? parts[0] + '.' + parts.slice(1).join('') 
                    : parts[0];
                  
                  // Limit decimal precision to 2 places
                  if (sanitized.includes('.')) {
                    const [whole, decimal] = sanitized.split('.');
                    sanitized = whole + '.' + decimal.slice(0, DECIMAL_PRECISION);
                  }
                  
                  handleChange('sellingPrice', sanitized);
                  setSelectedMargin(null);
                }}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="decimal-pad"
              />
            </View>
          </FormField>

          {/* Profit Display - shows profit or loss */}
          {profit !== 0 && !errors.purchasePrice && !errors.sellingPrice && (
            <View style={[styles.profitDisplay, profit < 0 && styles.lossDisplay]}>
              <Text style={[styles.profitText, profit < 0 && styles.lossText]}>
                {profit > 0 ? 'Profit' : '⚠️ Loss'}: {CURRENCY_SYMBOL}{Math.abs(profit).toFixed(2)}/bottle ({Math.abs(profitMargin).toFixed(0)}% margin)
              </Text>
            </View>
          )}
        </View>

        {/* Quantity Section */}
        <View style={styles.quantityCard}>
          <View style={styles.quantityHeader}>
            <Package size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Quantity</Text>
          </View>
          
          <View style={styles.quantityGrid}>
            {QUANTITY_PRESETS.map(preset => (
              <TouchableOpacity
                key={preset.value}
                style={[
                  styles.quantityButton,
                  formData.quantity === preset.value.toString() && styles.quantityButtonSelected,
                ]}
                onPress={() => applyQuantityPreset(preset.value)}
              >
                <Package 
                  size={18} 
                  color={formData.quantity === preset.value.toString() ? Colors.secondary : Colors.primary} 
                />
                <Text
                  style={[
                    styles.quantityButtonText,
                    formData.quantity === preset.value.toString() && styles.quantityButtonTextSelected,
                  ]}
                >
                  {preset.label}
                </Text>
                <Text style={[
                  styles.quantityButtonLabel,
                  formData.quantity === preset.value.toString() && styles.quantityButtonLabelSelected,
                ]}>
                  {preset.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Quantity Input - Outside card for alignment */}
        <FormField label="Or enter custom quantity" error={errors.quantity}>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            value={formData.quantity.toString()}
            onChangeText={value => handleChange('quantity', value)}
            placeholder="0"
            placeholderTextColor={Colors.lightText}
            keyboardType="number-pad"
          />
        </FormField>

        {/* Target Stock - Always Visible */}
        <FormField label="Target Stock Level" error={errors.quantityTarget} required>
          <TextInput
            style={[styles.input, errors.quantityTarget && styles.inputError]}
            value={formData.quantityTarget.toString()}
            onChangeText={value => handleChange('quantityTarget', value)}
            placeholder="24"
            placeholderTextColor={Colors.lightText}
            keyboardType="number-pad"
          />
          <Text style={styles.fieldHint}>
            Ideal inventory level for this wine
          </Text>
        </FormField>

        {/* Optional: Grape Variety */}
        <FormField label="Grape Variety (Optional)">
          <TextInput
            style={styles.input}
            value={formData.grapeVariety}
            onChangeText={value => handleChange('grapeVariety', value)}
            placeholder="e.g., Nebbiolo"
            placeholderTextColor={Colors.lightText}
            maxLength={50}
          />
        </FormField>

        {/* Optional: Notes */}
        <FormField label="Notes (Optional)">
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={value => handleChange('notes', value)}
            placeholder="Any additional notes..."
            placeholderTextColor={Colors.lightText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={500}
          />
        </FormField>
      </ScrollView>

      {/* Fixed Submit Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Save size={20} color={Colors.secondary} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Adding Wine...' : 'Add Wine to Inventory'}
          </Text>
        </TouchableOpacity>
      </View>

      <Toast message={toastMessage} visible={showToast} onClose={() => setShowToast(false)} />
    </KeyboardAvoidingView>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  required?: boolean;
}

function FormField({ label, error, children, containerStyle, required }: FormFieldProps) {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    paddingBottom: 100,
  },
  suggestionsCard: {
    backgroundColor: 'rgba(67, 160, 71, 0.08)',
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(67, 160, 71, 0.25)',
    overflow: 'hidden',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(67, 160, 71, 0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(67, 160, 71, 0.15)',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(67, 160, 71, 0.1)',
  },
  suggestionRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
    width: 70,
  },
  suggestionRowValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  fieldContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  validationIcon: {
    position: 'absolute',
    right: 12,
    top: 42,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  fieldHint: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  pickerOptions: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    maxHeight: 200,
    overflow: 'hidden',
  },
  regionScrollView: {
    maxHeight: 150,
  },
  typeScrollView: {
    maxHeight: 150,
  },
  yearScrollView: {
    maxHeight: 250,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pickerOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  pickerOptionSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  supplierHint: {
    fontSize: 13,
    color: Colors.lightText,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  supplierChipsScroll: {
    marginBottom: 12,
  },
  supplierChip: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: Colors.divider,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supplierChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  supplierChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  supplierChipTextSelected: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  pricingCard: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
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
    backgroundColor: 'transparent',
  },
  marginSection: {
    marginVertical: 12,
  },
  marginLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  marginButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  marginButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.divider,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  marginButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  marginButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  marginButtonTextSelected: {
    color: Colors.secondary,
  },
  profitDisplay: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(67, 160, 71, 0.1)',
    borderRadius: 6,
  },
  lossDisplay: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  profitText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    textAlign: 'center',
  },
  lossText: {
    color: Colors.danger,
  },
  quantityCard: {
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
  quantityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  quantityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  quantityButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: Colors.divider,
    width: '48%', // 2 columns layout for perfect balance
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  quantityButtonTextSelected: {
    color: Colors.secondary,
  },
  quantityButtonLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.lightText,
    marginTop: 2,
  },
  quantityButtonLabelSelected: {
    color: 'rgba(248, 244, 227, 0.8)',
  },
  textArea: {
    minHeight: 80,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
