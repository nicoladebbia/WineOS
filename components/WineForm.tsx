import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  InputAccessoryView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Wine, WineFormData, WineType, Country } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import { regions } from '@/constants/regions';
import { grapeVarieties } from '@/constants/grapeVarieties';
import { translations } from '@/constants/translations';
import Colors from '@/constants/colors';
import { ChevronDown, Save, Plus, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';
import SimilarWineDialog from '@/components/SimilarWineDialog';
import WineSearchModal from '@/components/WineSearchModal';
import ProducerSelector from '@/components/ProducerSelector';
import YearInput from '@/components/YearInput';
import { WineTemplate } from '@/types/wineDatabase';

interface WineFormProps {
  initialData?: Wine;
  isEditing?: boolean;
}

export default function WineForm({ initialData, isEditing = false }: WineFormProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const addWine = useWineStore((state) => state.addWine);
  const updateWine = useWineStore((state) => state.updateWine);
  const findSimilarWine = useWineStore((state) => state.findSimilarWine);
  
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
    minQuantity: '',
    quantityTarget: '', // New field for target inventory
    notes: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof WineFormData, string>>>({});
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showGrapeVarietyPicker, setShowGrapeVarietyPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addAnother, setAddAnother] = useState(false);
  
  // For duplicate detection
  const [showSimilarWineDialog, setShowSimilarWineDialog] = useState(false);
  const [similarWine, setSimilarWine] = useState<Wine | null>(null);
  
  // Wine database search
  const [showWineSearch, setShowWineSearch] = useState(false);
  const [showProducerSelector, setShowProducerSelector] = useState(false);
  const [showYearInput, setShowYearInput] = useState(false);
  const [selectedWineTemplate, setSelectedWineTemplate] = useState<WineTemplate | null>(null);
  const [selectedProducer, setSelectedProducer] = useState('');
  
  // Wine types and countries
  const wineTypes: WineType[] = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
  const countries: Country[] = ['Italy', 'France', 'Spain', 'USA', 'Argentina', 'Australia', 'Germany', 'Portugal', 'South Africa', 'Chile'];
  
  // Get grape varieties based on wine type
  const availableGrapeVarieties = formData.type ? (grapeVarieties[formData.type] || grapeVarieties.Red) : grapeVarieties.Red;
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        year: initialData.year,
        type: initialData.type,
        country: initialData.country,
        region: initialData.region,
        grapeVariety: initialData.grapeVariety || '',
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
      type: formData.type,
      country: formData.country,
      region: formData.region,
      grapeVariety: formData.grapeVariety,
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
          type: formData.type,
          country: formData.country,
          region: formData.region,
          grapeVariety: '',
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
  
  const selectType = (type: WineType) => {
    handleChange('type', type);
    handleChange('grapeVariety', ''); // Reset grape variety when type changes
    setShowTypePicker(false);
  };
  
  const selectCountry = (country: Country) => {
    handleChange('country', country);
    handleChange('region', '');
    setShowCountryPicker(false);
  };
  
  const selectRegion = (region: string) => {
    handleChange('region', region);
    setShowRegionPicker(false);
  };
  
  const selectGrapeVariety = (variety: string) => {
    handleChange('grapeVariety', variety);
    setShowGrapeVarietyPicker(false);
  };
  
  // Wine database search handlers
  const handleWineSelected = (wine: WineTemplate) => {
    setSelectedWineTemplate(wine);
    setShowWineSearch(false);
    setShowProducerSelector(true);
  };
  
  const handleProducerSelected = (producer: string) => {
    setSelectedProducer(producer);
    setShowProducerSelector(false);
    setShowYearInput(true);
  };
  
  const handleYearSelected = (year: number) => {
    if (selectedWineTemplate) {
      // Auto-fill form with wine database data
      const producerSuffix = selectedProducer ? ` - ${selectedProducer}` : '';
      setFormData({
        ...formData,
        name: `${selectedWineTemplate.name}${producerSuffix}`,
        year: year,
        type: selectedWineTemplate.type,
        country: selectedWineTemplate.country,
        region: selectedWineTemplate.region,
        grapeVariety: selectedWineTemplate.grapeVariety,
      });
      
      // Show success toast
      setToastMessage(`${selectedWineTemplate.name} added! Fill in remaining details.`);
      setShowToast(true);
      
      // Reset search state
      setSelectedWineTemplate(null);
      setSelectedProducer('');
    }
    setShowYearInput(false);
  };
  
  const inputAccessoryViewID = 'uniqueID';
  
  const KeyboardAccessory = () => (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.keyboardAccessory}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            Keyboard.dismiss();
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Wine Database Search Button */}
        <TouchableOpacity
          style={styles.searchDatabaseButton}
          onPress={() => setShowWineSearch(true)}
        >
          <Search size={20} color={Colors.secondary} />
          <Text style={styles.searchDatabaseButtonText}>
            Search Wine Database (100 Italian Wines)
          </Text>
        </TouchableOpacity>
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
          <View style={styles.dividerLine} />
        </View>
        
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
            inputAccessoryViewID={inputAccessoryViewID}
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
            inputAccessoryViewID={inputAccessoryViewID}
          />
        </FormField>
        
        <FormField
          label={translations.wine.type}
          error={errors.type}
        >
          <TouchableOpacity
            style={[styles.input, styles.pickerButton]}
            onPress={() => setShowTypePicker(!showTypePicker)}
          >
            <Text style={styles.pickerButtonText}>
              {formData.type || translations.wine.type}
            </Text>
            <ChevronDown size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          {showTypePicker && (
            <View style={styles.pickerOptions}>
              <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
                {wineTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.pickerOption}
                    onPress={() => selectType(type)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.type === type && styles.pickerOptionSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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
              <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={styles.pickerOption}
                    onPress={() => selectCountry(country)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.country === country && styles.pickerOptionSelected
                    ]}>
                      {country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
          label={translations.wine.grapeVariety}
        >
          <TouchableOpacity
            style={[styles.input, styles.pickerButton]}
            onPress={() => setShowGrapeVarietyPicker(!showGrapeVarietyPicker)}
          >
            <Text style={[styles.pickerButtonText, !formData.grapeVariety && styles.placeholderText]}>
              {formData.grapeVariety || `${translations.wine.grapeVariety} (Optional)`}
            </Text>
            <ChevronDown size={20} color={Colors.lightText} />
          </TouchableOpacity>
          
          {showGrapeVarietyPicker && (
            <View style={styles.pickerOptions}>
              <ScrollView style={styles.regionScrollView} nestedScrollEnabled>
                {availableGrapeVarieties.map((variety) => (
                  <TouchableOpacity
                    key={variety}
                    style={styles.pickerOption}
                    onPress={() => selectGrapeVariety(variety)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.grapeVariety === variety && styles.pickerOptionSelected
                    ]}>
                      {variety}
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
            inputAccessoryViewID={inputAccessoryViewID}
          />
        </FormField>
        
        <View style={styles.row}>
          <FormField
            label={translations.wine.purchasePrice}
            error={errors.purchasePrice}
            containerStyle={styles.halfField}
          >
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.priceInput, errors.purchasePrice && styles.inputError]}
                value={formData.purchasePrice.toString()}
                onChangeText={(value) => handleChange('purchasePrice', value)}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="numeric"
                inputAccessoryViewID={inputAccessoryViewID}
              />
            </View>
          </FormField>
          
          <FormField
            label={translations.wine.sellingPrice}
            error={errors.sellingPrice}
            containerStyle={styles.halfField}
          >
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.priceInput, errors.sellingPrice && styles.inputError]}
                value={formData.sellingPrice.toString()}
                onChangeText={(value) => handleChange('sellingPrice', value)}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="numeric"
                inputAccessoryViewID={inputAccessoryViewID}
              />
            </View>
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
            inputAccessoryViewID={inputAccessoryViewID}
          />
        </FormField>
        
        <FormField
          label={translations.wine.minQuantity}
          error={errors.minQuantity}
        >
          <TextInput
            style={[styles.input, errors.minQuantity && styles.inputError]}
            value={formData.minQuantity.toString()}
            onChangeText={(value) => handleChange('minQuantity', value)}
            placeholder="0"
            placeholderTextColor={Colors.lightText}
            keyboardType="numeric"
            inputAccessoryViewID={inputAccessoryViewID}
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
            inputAccessoryViewID={inputAccessoryViewID}
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
            inputAccessoryViewID={inputAccessoryViewID}
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
      </ScrollView>
      
      {/* Fixed Submit Button - Always Visible */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Save size={20} color={Colors.secondary} />
          <Text style={styles.submitButtonText}>
            {isEditing ? translations.actions.save : translations.actions.add}
          </Text>
        </TouchableOpacity>
      </View>
      
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
      
      {/* Wine Database Search Modals */}
      <WineSearchModal
        visible={showWineSearch}
        onClose={() => setShowWineSearch(false)}
        onSelectWine={handleWineSelected}
      />
      
      <ProducerSelector
        visible={showProducerSelector}
        wine={selectedWineTemplate}
        onClose={() => setShowProducerSelector(false)}
        onSelectProducer={handleProducerSelected}
      />
      
      <YearInput
        visible={showYearInput}
        wine={selectedWineTemplate}
        producer={selectedProducer}
        onClose={() => setShowYearInput(false)}
        onSelectYear={handleYearSelected}
      />
      
      {Platform.OS === 'ios' && <KeyboardAccessory />}
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
    paddingBottom: 100, // Extra space for fixed button
  },
  searchDatabaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  searchDatabaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lightText,
    paddingHorizontal: 12,
    letterSpacing: 0.5,
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
  placeholderText: {
    color: Colors.lightText,
  },
  pickerOptions: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
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
  keyboardAccessory: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  doneButtonText: {
    color: Colors.secondary,
    fontSize: 16,
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
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for home indicator on iOS
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