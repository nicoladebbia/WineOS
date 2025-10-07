import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Wine, WineFormData } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import { regions } from '@/constants/regions';
import { translations } from '@/constants/translations';
import Colors from '@/constants/colors';
import { ChevronDown, Save, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';
import SimilarWineDialog from '@/components/SimilarWineDialog';

interface WineFormProps {
  initialData?: Wine;
  isEditing?: boolean;
}

export default function WineForm({ initialData, isEditing = false }: WineFormProps) {
  const router = useRouter();
  const addWine = useWineStore((state) => state.addWine);
  const updateWine = useWineStore((state) => state.updateWine);
  const findSimilarWine = useWineStore((state) => state.findSimilarWine);
  
  const [formData, setFormData] = useState<WineFormData>({
    name: '',
    year: new Date().getFullYear(),
    country: 'Italy',
    region: '',
    supplier: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    minQuantity: '',
    quantityTarget: '', // New field for target inventory
    notes: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof WineFormData, string>>>({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addAnother, setAddAnother] = useState(false);
  
  // For duplicate detection
  const [showSimilarWineDialog, setShowSimilarWineDialog] = useState(false);
  const [similarWine, setSimilarWine] = useState<Wine | null>(null);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        year: initialData.year,
        country: initialData.country,
        region: initialData.region,
        supplier: initialData.supplier,
        purchasePrice: initialData.purchasePrice,
        sellingPrice: initialData.sellingPrice,
        quantity: initialData.quantity,
        minQuantity: initialData.minQuantity,
        quantityTarget: initialData.quantityTarget || initialData.minQuantity * 2, // Default to 2x minQuantity if not set
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);
  
  const handleChange = (field: keyof WineFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WineFormData, string>> = {};
    
    // Required fields
    const requiredFields: (keyof WineFormData)[] = [
      'name', 'year', 'country', 'region', 'supplier', 
      'purchasePrice', 'sellingPrice', 'quantity', 'quantityTarget'
    ];
    
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = translations.formValidation.required;
      }
    });
    
    // Numeric fields
    const numericFields: (keyof WineFormData)[] = [
      'year', 'purchasePrice', 'sellingPrice', 'quantity', 'quantityTarget'
    ];
    
    numericFields.forEach((field) => {
      if (formData[field] && (isNaN(Number(formData[field])) || Number(formData[field]) < 0)) {
        newErrors[field] = translations.formValidation.positiveNumber;
      }
    });
    
    // Year validation
    const currentYear = new Date().getFullYear();
    if (Number(formData.year) > currentYear || Number(formData.year) < 1900) {
      newErrors.year = translations.formValidation.validYear;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const checkForSimilarWine = () => {
    if (isEditing) return false; // Skip check if editing
    
    const similar = findSimilarWine(formData.name);
    if (similar) {
      setSimilarWine(similar);
      setShowSimilarWineDialog(true);
      return true;
    }
    
    return false;
  };
  
  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!validateForm()) {
      return;
    }
    
    // Check for similar wine before adding
    if (!isEditing && checkForSimilarWine()) {
      return;
    }
    
    saveWine();
  };
  
  const saveWine = () => {
    const wineData = {
      name: formData.name,
      year: Number(formData.year),
      country: formData.country,
      region: formData.region,
      supplier: formData.supplier,
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity || 0), // Use 0 as default if not provided
      quantityTarget: Number(formData.quantityTarget),
      averageWeeklySales: 0, // Will be calculated based on sales
      notes: formData.notes,
    };
    
    if (isEditing && initialData) {
      updateWine(initialData.id, wineData);
      setToastMessage(translations.notifications.wineUpdated);
      setShowToast(true);
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } else {
      addWine(wineData);
      setToastMessage(translations.notifications.wineAdded);
      setShowToast(true);
      
      if (addAnother) {
        // Reset form but keep some fields
        setFormData({
          name: '',
          year: formData.year,
          country: formData.country,
          region: formData.region,
          supplier: formData.supplier,
          purchasePrice: '',
          sellingPrice: '',
          quantity: '',
          minQuantity: '',
          quantityTarget: '',
          notes: '',
        });
      } else {
        // Navigate back after a short delay
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    }
  };
  
  const handleAddAnyway = () => {
    setShowSimilarWineDialog(false);
    saveWine();
  };
  
  const handleEditExisting = () => {
    setShowSimilarWineDialog(false);
    if (similarWine) {
      router.push(`/wine/${similarWine.id}`);
    }
  };
  
  const handleCancelSimilarDialog = () => {
    setShowSimilarWineDialog(false);
  };
  
  const selectCountry = (country: 'Italy' | 'France') => {
    handleChange('country', country);
    handleChange('region', '');
    setShowCountryPicker(false);
  };
  
  const selectRegion = (region: string) => {
    handleChange('region', region);
    setShowRegionPicker(false);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label={translations.wine.name}
          error={errors.name}
        >
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder={translations.wine.name}
            placeholderTextColor={Colors.lightText}
          />
        </FormField>
        
        <FormField
          label={translations.wine.year}
          error={errors.year}
        >
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            value={formData.year.toString()}
            onChangeText={(value) => handleChange('year', value)}
            placeholder={translations.wine.year}
            placeholderTextColor={Colors.lightText}
            keyboardType="numeric"
          />
        </FormField>
        
        <FormField
          label={translations.wine.country}
          error={errors.country}
        >
          <TouchableOpacity
            style={[styles.input, styles.pickerButton]}
            onPress={() => setShowCountryPicker(!showCountryPicker)}
          >
            <Text style={styles.pickerButtonText}>
              {formData.country || translations.filters.country}
            </Text>
            <ChevronDown size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          {showCountryPicker && (
            <View style={styles.pickerOptions}>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => selectCountry('Italy')}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.country === 'Italy' && styles.pickerOptionSelected
                ]}>
                  Italy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => selectCountry('France')}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.country === 'France' && styles.pickerOptionSelected
                ]}>
                  France
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </FormField>
        
        <FormField
          label={translations.wine.region}
          error={errors.region}
        >
          <TouchableOpacity
            style={[styles.input, styles.pickerButton]}
            onPress={() => {
              if (formData.country) {
                setShowRegionPicker(!showRegionPicker);
              } else {
                setErrors((prev) => ({
                  ...prev,
                  country: translations.formValidation.required,
                }));
              }
            }}
          >
            <Text style={styles.pickerButtonText}>
              {formData.region || translations.filters.region}
            </Text>
            <ChevronDown size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          {showRegionPicker && formData.country && (
            <View style={styles.pickerOptions}>
              <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
                {regions[formData.country].map((region) => (
                  <TouchableOpacity
                    key={region}
                    style={styles.pickerOption}
                    onPress={() => selectRegion(region)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.region === region && styles.pickerOptionSelected
                    ]}>
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </FormField>
        
        <FormField
          label={translations.wine.supplier}
          error={errors.supplier}
        >
          <TextInput
            style={[styles.input, errors.supplier && styles.inputError]}
            value={formData.supplier}
            onChangeText={(value) => handleChange('supplier', value)}
            placeholder={translations.wine.supplier}
            placeholderTextColor={Colors.lightText}
          />
        </FormField>
        
        <View style={styles.row}>
          <FormField
            label={translations.wine.purchasePrice}
            error={errors.purchasePrice}
            containerStyle={styles.halfField}
          >
            <TextInput
              style={[styles.input, errors.purchasePrice && styles.inputError]}
              value={formData.purchasePrice.toString()}
              onChangeText={(value) => handleChange('purchasePrice', value)}
              placeholder="0.00"
              placeholderTextColor={Colors.lightText}
              keyboardType="numeric"
            />
          </FormField>
          
          <FormField
            label={translations.wine.sellingPrice}
            error={errors.sellingPrice}
            containerStyle={styles.halfField}
          >
            <TextInput
              style={[styles.input, errors.sellingPrice && styles.inputError]}
              value={formData.sellingPrice.toString()}
              onChangeText={(value) => handleChange('sellingPrice', value)}
              placeholder="0.00"
              placeholderTextColor={Colors.lightText}
              keyboardType="numeric"
            />
          </FormField>
        </View>
        
        <FormField
          label={translations.wine.quantity}
          error={errors.quantity}
        >
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            value={formData.quantity.toString()}
            onChangeText={(value) => handleChange('quantity', value)}
            placeholder="0"
            placeholderTextColor={Colors.lightText}
            keyboardType="numeric"
          />
        </FormField>
        
        <FormField
          label={translations.wine.quantityTarget}
          error={errors.quantityTarget}
        >
          <TextInput
            style={[styles.input, errors.quantityTarget && styles.inputError]}
            value={formData.quantityTarget.toString()}
            onChangeText={(value) => handleChange('quantityTarget', value)}
            placeholder="0"
            placeholderTextColor={Colors.lightText}
            keyboardType="numeric"
          />
        </FormField>
        
        <FormField
          label={translations.wine.notes}
        >
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleChange('notes', value)}
            placeholder={translations.wine.notes}
            placeholderTextColor={Colors.lightText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </FormField>
        
        {!isEditing && (
          <TouchableOpacity
            style={styles.addAnotherContainer}
            onPress={() => setAddAnother(!addAnother)}
          >
            <View style={[styles.checkbox, addAnother && styles.checkboxChecked]}>
              {addAnother && <Plus size={14} color={Colors.secondary} />}
            </View>
            <Text style={styles.addAnotherText}>{translations.actions.addAnother}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Save size={20} color={Colors.secondary} />
          <Text style={styles.submitButtonText}>
            {isEditing ? translations.actions.save : translations.actions.add}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Toast
        message={toastMessage}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <SimilarWineDialog
        visible={showSimilarWineDialog}
        similarWine={similarWine}
        newWineName={formData.name}
        newWineYear={formData.year}
        onAddAnyway={handleAddAnyway}
        onEditExisting={handleEditExisting}
        onCancel={handleCancelSimilarDialog}
      />
    </KeyboardAvoidingView>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  containerStyle?: object;
}

function FormField({ label, error, children, containerStyle }: FormFieldProps) {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
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
    paddingBottom: 40,
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
  textArea: {
    minHeight: 100,
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
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.divider,
    maxHeight: 200,
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
  addAnotherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  addAnotherText: {
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
    marginTop: 16,
    gap: 8,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});