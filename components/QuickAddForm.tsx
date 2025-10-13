import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WineFormData, WineType, Country } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import { regions } from '@/constants/regions';
import { grapeVarieties } from '@/constants/grapeVarieties';
import { translations } from '@/constants/translations';
import Colors from '@/constants/colors';
import { 
  ChevronDown, 
  Save, 
  Sparkles, 
  TrendingUp, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Percent,
  Package,
  Copy,
  AlertTriangle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';

interface QuickAddFormProps {
  onSuccess?: () => void;
}

export default function QuickAddForm({ onSuccess }: QuickAddFormProps) {
  const router = useRouter();
  const addWine = useWineStore((state) => state.addWine);
  const wines = useWineStore((state) => state.wines);

  // Calculate smart defaults from existing inventory
  const getSmartDefaults = () => {
    if (wines.length === 0) {
      return {
        supplier: '',
        purchasePrice: '',
        sellingPrice: '',
        minQuantity: '6',
        quantityTarget: '24',
      };
    }

    // Get most common supplier
    const supplierCounts = wines.reduce((acc, wine) => {
      acc[wine.supplier] = (acc[wine.supplier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonSupplier = Object.entries(supplierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    // Calculate average prices
    const avgPurchase = wines.reduce((sum, w) => sum + w.purchasePrice, 0) / wines.length;
    const avgSelling = wines.reduce((sum, w) => sum + w.sellingPrice, 0) / wines.length;

    // Calculate average quantities
    const avgMin = Math.round(wines.reduce((sum, w) => sum + w.minQuantity, 0) / wines.length);
    const avgTarget = Math.round(wines.reduce((sum, w) => sum + w.quantityTarget, 0) / wines.length);

    return {
      supplier: mostCommonSupplier,
      purchasePrice: avgPurchase.toFixed(2),
      sellingPrice: avgSelling.toFixed(2),
      minQuantity: avgMin.toString(),
      quantityTarget: avgTarget.toString(),
    };
  };

  const smartDefaults = getSmartDefaults();

  const [formData, setFormData] = useState<WineFormData>({
    name: '',
    year: new Date().getFullYear(),
    type: 'Red',
    country: 'Italy',
    region: '',
    grapeVariety: '',
    supplier: smartDefaults.supplier,
    purchasePrice: smartDefaults.purchasePrice,
    sellingPrice: smartDefaults.sellingPrice,
    quantity: '',
    minQuantity: smartDefaults.minQuantity,
    quantityTarget: smartDefaults.quantityTarget,
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WineFormData, string>>>({});
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const wineTypes: WineType[] = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
  const countries: Country[] = ['Italy', 'France', 'Spain', 'USA', 'Argentina', 'Australia', 'Germany', 'Portugal', 'South Africa', 'Chile'];

  // Auto-calculate selling price with 40% margin when purchase price changes
  useEffect(() => {
    if (formData.purchasePrice && !isNaN(Number(formData.purchasePrice))) {
      const purchase = Number(formData.purchasePrice);
      const suggested = (purchase * 1.4).toFixed(2);
      if (!formData.sellingPrice || formData.sellingPrice === smartDefaults.sellingPrice) {
        setFormData((prev) => ({ ...prev, sellingPrice: suggested }));
      }
    }
  }, [formData.purchasePrice]);

  // Auto-calculate target quantity (4x min quantity)
  useEffect(() => {
    if (formData.minQuantity && !isNaN(Number(formData.minQuantity))) {
      const min = Number(formData.minQuantity);
      const suggested = (min * 4).toString();
      if (!formData.quantityTarget || formData.quantityTarget === smartDefaults.quantityTarget) {
        setFormData((prev) => ({ ...prev, quantityTarget: suggested }));
      }
    }
  }, [formData.minQuantity]);

  const handleChange = (field: keyof WineFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WineFormData, string>> = {};

    const requiredFields: (keyof WineFormData)[] = [
      'name', 'year', 'country', 'region', 'supplier',
      'purchasePrice', 'sellingPrice', 'quantity', 'quantityTarget'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = translations.formValidation.required;
      }
    });

    const numericFields: (keyof WineFormData)[] = [
      'year', 'purchasePrice', 'sellingPrice', 'quantity', 'quantityTarget'
    ];

    numericFields.forEach((field) => {
      if (formData[field] && (isNaN(Number(formData[field])) || Number(formData[field]) < 0)) {
        newErrors[field] = translations.formValidation.positiveNumber;
      }
    });

    const currentYear = new Date().getFullYear();
    if (Number(formData.year) > currentYear || Number(formData.year) < 1900) {
      newErrors.year = translations.formValidation.validYear;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!validateForm()) {
      return;
    }

    const wineData = {
      name: formData.name,
      year: Number(formData.year),
      type: formData.type,
      country: formData.country,
      region: formData.region,
      grapeVariety: formData.grapeVariety,
      supplier: formData.supplier,
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity || 0),
      quantityTarget: Number(formData.quantityTarget),
      averageWeeklySales: 0,
      notes: formData.notes,
    };

    addWine(wineData);
    setToastMessage(translations.notifications.wineAdded);
    setShowToast(true);

    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    }, 1500);
  };

  const completionPercentage = () => {
    const requiredFields = ['name', 'year', 'country', 'region', 'supplier', 'purchasePrice', 'sellingPrice', 'quantity', 'quantityTarget'];
    const completed = requiredFields.filter(field => formData[field as keyof WineFormData]).length;
    return Math.round((completed / requiredFields.length) * 100);
  };

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
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Sparkles size={16} color={Colors.primary} />
            <Text style={styles.progressText}>Form Completion: {completionPercentage()}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercentage()}%` }]} />
          </View>
        </View>

        {/* Smart Defaults Indicator */}
        {wines.length > 0 && (
          <View style={styles.smartDefaultsCard}>
            <TrendingUp size={16} color={Colors.success} />
            <Text style={styles.smartDefaultsText}>
              Smart defaults applied based on your inventory patterns
            </Text>
          </View>
        )}

        {/* Essential Fields */}
        <FormField label={translations.wine.name} error={errors.name} required>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="e.g., Barolo Riserva"
            placeholderTextColor={Colors.lightText}
          />
        </FormField>

        <View style={styles.row}>
          <FormField label={translations.wine.year} error={errors.year} containerStyle={styles.halfField} required>
            <TextInput
              style={[styles.input, errors.year && styles.inputError]}
              value={formData.year.toString()}
              onChangeText={(value) => handleChange('year', value)}
              placeholder={new Date().getFullYear().toString()}
              placeholderTextColor={Colors.lightText}
              keyboardType="numeric"
            />
          </FormField>

          <FormField label={translations.wine.type} containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton]}
              onPress={() => setShowTypePicker(!showTypePicker)}
            >
              <Text style={styles.pickerButtonText}>{formData.type}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>
        </View>

        {showTypePicker && (
          <View style={styles.pickerOptions}>
            {wineTypes.map((type) => (
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
          </View>
        )}

        <View style={styles.row}>
          <FormField label={translations.wine.country} error={errors.country} containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton]}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Text style={styles.pickerButtonText}>{formData.country}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>

          <FormField label={translations.wine.region} error={errors.region} containerStyle={styles.halfField} required>
            <TouchableOpacity
              style={[styles.input, styles.pickerButton]}
              onPress={() => setShowRegionPicker(!showRegionPicker)}
            >
              <Text style={styles.pickerButtonText}>{formData.region || 'Select'}</Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </FormField>
        </View>

        {showCountryPicker && (
          <View style={styles.pickerOptions}>
            <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
              {countries.map((country) => (
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

        {showRegionPicker && formData.country && (
          <View style={styles.pickerOptions}>
            <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
              {regions[formData.country].map((region) => (
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

        <FormField label={translations.wine.supplier} error={errors.supplier} required>
          <TextInput
            style={[styles.input, errors.supplier && styles.inputError]}
            value={formData.supplier}
            onChangeText={(value) => handleChange('supplier', value)}
            placeholder="e.g., Wine Imports Ltd"
            placeholderTextColor={Colors.lightText}
          />
        </FormField>

        <View style={styles.row}>
          <FormField label={translations.wine.purchasePrice} error={errors.purchasePrice} containerStyle={styles.halfField} required>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={[styles.input, styles.priceInput, errors.purchasePrice && styles.inputError]}
                value={formData.purchasePrice.toString()}
                onChangeText={(value) => handleChange('purchasePrice', value)}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="numeric"
              />
            </View>
          </FormField>

          <FormField label={translations.wine.sellingPrice} error={errors.sellingPrice} containerStyle={styles.halfField} required>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={[styles.input, styles.priceInput, errors.sellingPrice && styles.inputError]}
                value={formData.sellingPrice.toString()}
                onChangeText={(value) => handleChange('sellingPrice', value)}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="numeric"
              />
            </View>
            {formData.purchasePrice && formData.sellingPrice && (
              <Text style={styles.marginHint}>
                Margin: {(((Number(formData.sellingPrice) - Number(formData.purchasePrice)) / Number(formData.purchasePrice)) * 100).toFixed(0)}%
              </Text>
            )}
          </FormField>
        </View>

        <View style={styles.row}>
          <FormField label={translations.wine.quantity} error={errors.quantity} containerStyle={styles.halfField} required>
            <TextInput
              style={[styles.input, errors.quantity && styles.inputError]}
              value={formData.quantity.toString()}
              onChangeText={(value) => handleChange('quantity', value)}
              placeholder="0"
              placeholderTextColor={Colors.lightText}
              keyboardType="numeric"
            />
          </FormField>

          <FormField label={translations.wine.minQuantity} containerStyle={styles.halfField}>
            <TextInput
              style={styles.input}
              value={formData.minQuantity.toString()}
              onChangeText={(value) => handleChange('minQuantity', value)}
              placeholder="6"
              placeholderTextColor={Colors.lightText}
              keyboardType="numeric"
            />
          </FormField>
        </View>

        <FormField label={translations.wine.quantityTarget} error={errors.quantityTarget} required>
          <TextInput
            style={[styles.input, errors.quantityTarget && styles.inputError]}
            value={formData.quantityTarget.toString()}
            onChangeText={(value) => handleChange('quantityTarget', value)}
            placeholder="24"
            placeholderTextColor={Colors.lightText}
            keyboardType="numeric"
          />
          <Text style={styles.fieldHint}>
            Recommended: 4x minimum quantity for optimal stock levels
          </Text>
        </FormField>

        <FormField label={translations.wine.notes}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleChange('notes', value)}
            placeholder="Optional notes..."
            placeholderTextColor={Colors.lightText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </FormField>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Save size={20} color={Colors.secondary} />
          <Text style={styles.submitButtonText}>Add Wine</Text>
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
  containerStyle?: object;
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
  progressContainer: {
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
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  smartDefaultsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 160, 71, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  smartDefaultsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
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
  inputError: {
    borderColor: Colors.danger,
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
  marginHint: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 4,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
