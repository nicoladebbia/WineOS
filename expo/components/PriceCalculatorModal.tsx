import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Calculator, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface PriceCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  initialPurchasePrice?: string;
  onApply: (purchasePrice: number, sellingPrice: number, margin: number) => void;
}

const MARGIN_PRESETS = [
  { label: '30%', value: 0.3 },
  { label: '40%', value: 0.4 },
  { label: '50%', value: 0.5 },
  { label: '60%', value: 0.6 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1.0 },
];

export default function PriceCalculatorModal({
  visible,
  onClose,
  initialPurchasePrice,
  onApply,
}: PriceCalculatorModalProps) {
  const [purchasePrice, setPurchasePrice] = useState(initialPurchasePrice || '');
  const [sellingPrice, setSellingPrice] = useState('');
  const [selectedMargin, setSelectedMargin] = useState<number | null>(null);
  const [customMargin, setCustomMargin] = useState('');

  // Reset when opening with new initial price
  useEffect(() => {
    if (visible && initialPurchasePrice) {
      setPurchasePrice(initialPurchasePrice);
      setSellingPrice('');
      setSelectedMargin(null);
      setCustomMargin('');
    }
  }, [visible, initialPurchasePrice]);

  const calculateFromMargin = (margin: number) => {
    const purchase = parseFloat(purchasePrice);
    if (isNaN(purchase) || purchase <= 0) {
      return;
    }

    const selling = purchase * (1 + margin);
    setSellingPrice(selling.toFixed(2));
    setSelectedMargin(margin);
    setCustomMargin('');
  };

  const calculateMarginFromPrices = () => {
    const purchase = parseFloat(purchasePrice);
    const selling = parseFloat(sellingPrice);

    if (isNaN(purchase) || isNaN(selling) || purchase <= 0 || selling <= purchase) {
      return 0;
    }

    return (selling - purchase) / purchase;
  };

  const handlePurchasePriceChange = (value: string) => {
    setPurchasePrice(value);
    // Recalculate selling price if margin is selected
    if (selectedMargin !== null) {
      const purchase = parseFloat(value);
      if (!isNaN(purchase) && purchase > 0) {
        const selling = purchase * (1 + selectedMargin);
        setSellingPrice(selling.toFixed(2));
      }
    }
  };

  const handleSellingPriceChange = (value: string) => {
    setSellingPrice(value);
    setSelectedMargin(null);
    setCustomMargin('');
  };

  const handleCustomMarginChange = (value: string) => {
    setCustomMargin(value);
    setSelectedMargin(null);
    
    const marginPercent = parseFloat(value);
    if (!isNaN(marginPercent) && marginPercent >= 0) {
      calculateFromMargin(marginPercent / 100);
    }
  };

  const handleApply = () => {
    const purchase = parseFloat(purchasePrice);
    const selling = parseFloat(sellingPrice);
    const margin = calculateMarginFromPrices();

    if (isNaN(purchase) || isNaN(selling) || purchase <= 0 || selling <= purchase) {
      return;
    }

    onApply(purchase, selling, margin);
    onClose();
  };

  const currentMargin = calculateMarginFromPrices();
  const profit = parseFloat(sellingPrice) - parseFloat(purchasePrice);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Calculator size={24} color={Colors.primary} />
            <Text style={styles.title}>Price Calculator</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Purchase Price */}
          <View style={styles.section}>
            <Text style={styles.label}>Purchase Price *</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.priceInput}
                value={purchasePrice}
                onChangeText={handlePurchasePriceChange}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Margin Presets */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Margin</Text>
            <View style={styles.presetsContainer}>
              {MARGIN_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.presetButton,
                    selectedMargin === preset.value && styles.presetButtonSelected,
                  ]}
                  onPress={() => calculateFromMargin(preset.value)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      selectedMargin === preset.value && styles.presetTextSelected,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Custom Margin */}
            <View style={styles.customMarginContainer}>
              <Text style={styles.customLabel}>Or custom margin:</Text>
              <View style={styles.customMarginInput}>
                <TextInput
                  style={styles.marginInput}
                  value={customMargin}
                  onChangeText={handleCustomMarginChange}
                  placeholder="0"
                  placeholderTextColor={Colors.lightText}
                  keyboardType="numeric"
                />
                <Text style={styles.percentSymbol}>%</Text>
              </View>
            </View>
          </View>

          {/* Selling Price */}
          <View style={styles.section}>
            <Text style={styles.label}>Selling Price *</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.priceInput}
                value={sellingPrice}
                onChangeText={handleSellingPriceChange}
                placeholder="0.00"
                placeholderTextColor={Colors.lightText}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Calculation Results */}
          {parseFloat(purchasePrice) > 0 && parseFloat(sellingPrice) > parseFloat(purchasePrice) && (
            <View style={styles.resultsCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Profit per Bottle:</Text>
                <Text style={styles.resultValue}>€{profit.toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Margin:</Text>
                <Text style={styles.resultValueHighlight}>
                  {(currentMargin * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Profit per Case (6):</Text>
                <Text style={styles.resultValue}>€{(profit * 6).toFixed(2)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Profit per Case (12):</Text>
                <Text style={styles.resultValue}>€{(profit * 12).toFixed(2)}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoBox}>
            <TrendingUp size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              Industry standard wine margins range from 40-60%
            </Text>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.applyButton,
              (!purchasePrice || !sellingPrice || parseFloat(sellingPrice) <= parseFloat(purchasePrice)) &&
                styles.applyButtonDisabled,
            ]}
            onPress={handleApply}
            disabled={!purchasePrice || !sellingPrice || parseFloat(sellingPrice) <= parseFloat(purchasePrice)}
          >
            <Text style={styles.applyButtonText}>Apply Prices</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    paddingVertical: 16,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  presetButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  presetTextSelected: {
    color: Colors.secondary,
  },
  customMarginContainer: {
    marginTop: 16,
  },
  customLabel: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 8,
  },
  customMarginInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingHorizontal: 12,
  },
  marginInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  resultsCard: {
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  resultValueHighlight: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.lightText,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
