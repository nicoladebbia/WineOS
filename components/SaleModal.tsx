import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Wine } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { ShoppingCart, X, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useToastStore } from '@/store/toastStore';
import { isToday, isYesterday, getYesterday, formatDateForStorage, pluralizeBottles } from '@/utils/dateHelpers';

interface SaleModalProps {
  visible: boolean;
  wine: Wine;
  onClose: () => void;
}

export default function SaleModal({ visible, wine, onClose }: SaleModalProps) {
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recordSale = useWineStore((state) => state.recordSale);
  const showToast = useToastStore((state) => state.showToast);
  
  const handleQuantityChange = useCallback((value: string) => {
    // Only allow positive integers
    if (/^\d*$/.test(value)) {
      setQuantity(value);
      setError(null);
    }
  }, []);
  
  const validateForm = (): boolean => {
    const quantityNum = parseInt(quantity, 10);
    
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError(translations.formValidation.positiveNumber);
      return false;
    }
    
    if (quantityNum > wine.quantity) {
      setError(translations.formValidation.cannotSellMore.replace('{quantity}', wine.quantity.toString()));
      return false;
    }
    
    return true;
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const handleSubmit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // CRITICAL FIX: Return early if validation fails
    if (!validateForm()) {
      return;
    }
    
    // Format date as YYYY-MM-DD for storage
    const formattedDate = formatDateForStorage(date);
    recordSale(wine.id, parseInt(quantity, 10), formattedDate);
    showToast(translations.sales.success, 'success');
    
    // Reset form and close modal immediately (no arbitrary delay)
    setQuantity('1');
    setDate(new Date());
    setError(null);
    setShowDatePicker(false);
    onClose();
  };
  
  const handleClose = () => {
    // Clear error state when closing
    setQuantity('1');
    setDate(new Date());
    setError(null);
    setShowDatePicker(false);
    onClose();
  };
  
  // Reset form when modal opens/closes (fixes error persistence)
  useEffect(() => {
    if (visible) {
      setQuantity('1');
      setDate(new Date());
      setError(null);
      setShowDatePicker(false);
    }
  }, [visible]);
  
  // Quick date helpers (memoized)
  const setToday = useCallback(() => {
    setDate(new Date());
    setShowDatePicker(false);
  }, []);
  
  const setYesterday = useCallback(() => {
    setDate(getYesterday());
    setShowDatePicker(false);
  }, []);
  
  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{translations.sales.title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.wineInfo}>
              <Text style={styles.wineName}>{wine.name}</Text>
              <Text style={styles.wineDetails}>{wine.year} • {wine.region}, {wine.country}</Text>
              <Text style={styles.wineQuantity}>
                {translations.wine.quantity}: {wine.quantity} {pluralizeBottles(wine.quantity, translations.wine)}
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translations.sales.quantity}</Text>
              
              {/* Quick action buttons */}
              <View style={styles.quickActions}>
                {[1, 2, 6, 12].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.quickButton,
                      quantity === num.toString() && styles.quickButtonActive,
                      num > wine.quantity && styles.quickButtonDisabled
                    ]}
                    onPress={() => {
                      if (num <= wine.quantity) {
                        setQuantity(num.toString());
                        setError(null);
                      }
                    }}
                    disabled={num > wine.quantity}
                  >
                    <Text style={[
                      styles.quickButtonText,
                      quantity === num.toString() && styles.quickButtonTextActive,
                      num > wine.quantity && styles.quickButtonTextDisabled
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={Colors.lightText}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translations.sales.date}</Text>
              
              {/* Quick date selection */}
              <View style={styles.quickDateActions}>
                <TouchableOpacity
                  style={[
                    styles.quickDateButton,
                    isToday(date) && styles.quickDateButtonActive
                  ]}
                  onPress={setToday}
                >
                  <Text style={[
                    styles.quickDateText,
                    isToday(date) && styles.quickDateTextActive
                  ]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.quickDateButton,
                    isYesterday(date) && styles.quickDateButtonActive
                  ]}
                  onPress={setYesterday}
                >
                  <Text style={[
                    styles.quickDateText,
                    isYesterday(date) && styles.quickDateTextActive
                  ]}>Yesterday</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={18} color={Colors.primary} />
                <Text style={styles.dateText}>
                  {date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  textColor={Colors.text}
                />
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                wine.quantity <= 0 && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={wine.quantity <= 0}
            >
              <ShoppingCart size={20} color={Colors.secondary} />
              <Text style={styles.submitButtonText}>{translations.sales.submit}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    width: Platform.OS === 'web' ? 400 : '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  wineInfo: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  wineName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  wineDetails: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 4,
  },
  wineQuantity: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginTop: 8,
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
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  quickButtonActive: {
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderColor: Colors.primary,
  },
  quickButtonDisabled: {
    opacity: 0.4,
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quickButtonTextActive: {
    color: Colors.primary,
  },
  quickButtonTextDisabled: {
    color: Colors.lightText,
  },
  quickDateActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  quickDateButtonActive: {
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderColor: Colors.primary,
  },
  quickDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  quickDateTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
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
});