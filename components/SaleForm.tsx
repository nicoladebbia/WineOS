import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { ShoppingCart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface SaleFormProps {
  wineId: string;
  onSaleComplete: () => void;
}

export default function SaleForm({ wineId, onSaleComplete }: SaleFormProps) {
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  
  const wine = useWineStore((state) => state.getWineById(wineId));
  const recordSale = useWineStore((state) => state.recordSale);
  
  if (!wine) return null;
  
  const handleQuantityChange = (value: string) => {
    // Only allow positive integers
    if (/^\d*$/.test(value)) {
      setQuantity(value);
      setError(null);
    }
  };
  
  const validateForm = (): boolean => {
    const quantityNum = parseInt(quantity, 10);
    
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError(translations.formValidation.positiveNumber);
      return false;
    }
    
    if (quantityNum > wine.quantity) {
      setError(`Non puoi vendere più di ${wine.quantity} bottiglie`);
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
    
    recordSale(wineId, parseInt(quantity, 10), date);
    onSaleComplete();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translations.sales.title}</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>{translations.sales.quantity}</Text>
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
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.lightText}
        />
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <ShoppingCart size={20} color={Colors.secondary} />
        <Text style={styles.submitButtonText}>{translations.sales.submit}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
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
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});