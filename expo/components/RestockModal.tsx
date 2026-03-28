import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Platform
} from 'react-native';
import { Wine } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Package, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useToastStore } from '@/store/toastStore';
import { PRICE_HISTORY_COUNT } from '@/constants/filterOptions';
import { pluralizeBottles } from '@/utils/dateHelpers';

interface RestockModalProps {
  visible: boolean;
  wine: Wine;
  onClose: () => void;
}

export default function RestockModal({ visible, wine, onClose }: RestockModalProps) {
  // Calculate suggested restock quantity safely (minimum of 1)
  const suggestedQuantity = useMemo(() => {
    if (wine?.quantityTarget && wine?.quantity) {
      const needed = wine.quantityTarget - wine.quantity;
      return Math.max(1, needed); // Minimum of 1, never suggest 0
    }
    return 6; // Default fallback
  }, [wine?.quantityTarget, wine?.quantity]);
  
  const [quantity, setQuantity] = useState(suggestedQuantity.toString());
  const [purchasePrice, setPurchasePrice] = useState(wine?.purchasePrice?.toString() || '');
  const [error, setError] = useState<string | null>(null);
  
  const updateWine = useWineStore((state) => state.updateWine);
  const showToast = useToastStore((state) => state.showToast);
  
  // Reset form when modal opens (fixes error persistence)
  useEffect(() => {
    if (visible && wine) {
      setQuantity(suggestedQuantity.toString());
      setPurchasePrice(wine.purchasePrice?.toString() || '');
      setError(null);
    }
  }, [visible, wine, suggestedQuantity]);
  
  // Get previous purchase prices for comparison
  const previousPrices = useMemo(() => {
    if (!wine?.restocks || wine.restocks.length === 0) return [];
    return wine.restocks
      .slice(-PRICE_HISTORY_COUNT) // Configurable count
      .reverse()
      .map(r => r.purchasePrice);
  }, [wine?.restocks]);
  
  const handleQuantityChange = useCallback((value: string) => {
    // Only allow positive integers
    if (/^\d*$/.test(value)) {
      setQuantity(value);
      setError(null);
    }
  }, []);
  
  const handlePurchasePriceChange = useCallback((value: string) => {
    // Allow positive numbers with decimals (must have at least one digit)
    if (value === '' || /^\d+\.?\d{0,2}$/.test(value)) {
      setPurchasePrice(value);
      setError(null);
    }
  }, []);
  
  const validateForm = (): boolean => {
    const quantityNum = parseInt(quantity, 10);
    const priceNum = parseFloat(purchasePrice);
    
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError(translations.formValidation.quantityRequired);
      return false;
    }
    
    if (!purchasePrice || isNaN(priceNum) || priceNum <= 0) {
      setError(translations.formValidation.priceRequired);
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
    
    const quantityNum = parseInt(quantity, 10);
    const priceNum = parseFloat(purchasePrice);
    const totalCost = quantityNum * priceNum;
    
    // Create restock record
    const restock = {
      id: nanoid(),
      date: new Date().toISOString(),
      quantity: quantityNum,
      purchasePrice: priceNum,
      totalCost: totalCost
    };
    
    // Update wine with new quantity, purchase price, and restock history
    const newQuantity = wine.quantity + quantityNum;
    const existingRestocks = wine.restocks || [];
    
    updateWine(wine.id, { 
      quantity: newQuantity,
      purchasePrice: priceNum, // Update the current purchase price
      restocks: [...existingRestocks, restock],
      lastUpdated: new Date().toISOString()
    });
    
    showToast(translations.notifications.restockSuccess, 'success');
    
    // Reset form and close modal immediately (no arbitrary delay)
    setQuantity(suggestedQuantity.toString());
    setPurchasePrice(wine.purchasePrice?.toString() || '');
    setError(null);
    onClose();
  };
  
  const handleClose = () => {
    // Clear error state when closing
    setQuantity(suggestedQuantity.toString());
    setPurchasePrice(wine.purchasePrice?.toString() || '');
    setError(null);
    onClose();
  };
  
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
              <Text style={styles.modalTitle}>{translations.actions.restock}</Text>
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
              {wine.quantityTarget > wine.quantity && (
                <Text style={styles.targetQuantity}>
                  {translations.wine.quantityTarget}: {wine.quantityTarget} {pluralizeBottles(wine.quantityTarget, translations.wine)}
                </Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity to Add</Text>
              
              {/* Quick action buttons */}
              <View style={styles.quickActions}>
                {[1, 2, 6, 12].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.quickButton,
                      quantity === num.toString() && styles.quickButtonActive
                    ]}
                    onPress={() => {
                      setQuantity(num.toString());
                      setError(null);
                    }}
                  >
                    <Text style={[
                      styles.quickButtonText,
                      quantity === num.toString() && styles.quickButtonTextActive
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
                placeholder="6"
                placeholderTextColor={Colors.lightText}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Purchase Price (per bottle)</Text>
              
              {/* Show previous prices for comparison */}
              {previousPrices.length > 0 && (
                <View style={styles.priceHistory}>
                  <Text style={styles.priceHistoryLabel}>Recent prices:</Text>
                  <View style={styles.priceHistoryList}>
                    {previousPrices.map((price, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.priceHistoryItem}
                        onPress={() => {
                          setPurchasePrice(price.toFixed(2));
                          setError(null);
                        }}
                      >
                        <Text style={styles.priceHistoryValue}>€{price.toFixed(2)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>€</Text>
                <TextInput
                  style={[styles.priceInput, error && styles.inputError]}
                  value={purchasePrice}
                  onChangeText={handlePurchasePriceChange}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={Colors.lightText}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
              
              {quantity && purchasePrice && 
               !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0 &&
               !isNaN(parseFloat(purchasePrice)) && parseFloat(purchasePrice) > 0 && (
                <View style={styles.costSummary}>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>New stock total:</Text>
                    <Text style={styles.costValue}>
                      {wine.quantity + parseInt(quantity, 10)} bottles
                    </Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Total cost:</Text>
                    <Text style={styles.totalCostValue}>
                      €{(parseInt(quantity, 10) * parseFloat(purchasePrice)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Package size={20} color={Colors.secondary} />
              <Text style={styles.submitButtonText}>{translations.actions.confirm}</Text>
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
  targetQuantity: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success,
    marginTop: 4,
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
  quickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quickButtonTextActive: {
    color: Colors.primary,
  },
  priceHistory: {
    marginBottom: 12,
  },
  priceHistoryLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 6,
    fontWeight: '500',
  },
  priceHistoryList: {
    flexDirection: 'row',
    gap: 8,
  },
  priceHistoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(125, 29, 63, 0.2)',
  },
  priceHistoryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  costSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalCostValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});