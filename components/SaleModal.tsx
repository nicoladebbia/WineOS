import React, { useState } from 'react';
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
import { ShoppingCart, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Toast from './Toast';

interface SaleModalProps {
  visible: boolean;
  wine: Wine;
  onClose: () => void;
}

export default function SaleModal({ visible, wine, onClose }: SaleModalProps) {
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  const recordSale = useWineStore((state) => state.recordSale);
  
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
    
    recordSale(wine.id, parseInt(quantity, 10), date);
    setShowToast(true);
    
    // Reset form and close modal
    setTimeout(() => {
      setQuantity('1');
      onClose();
    }, 500);
  };
  
  const handleClose = () => {
    setQuantity('1');
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
              <Text style={styles.modalTitle}>{translations.sales.title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.wineInfo}>
              <Text style={styles.wineName}>{wine.name}</Text>
              <Text style={styles.wineDetails}>{wine.year} • {wine.region}, {wine.country}</Text>
              <Text style={styles.wineQuantity}>
                {translations.wine.quantity}: {wine.quantity} {wine.quantity === 1 ? 'bottiglia' : 'bottiglie'}
              </Text>
            </View>
            
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
      
      <Toast
        message={translations.sales.success}
        type="success"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
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