import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { X, Plus, Trash2, Check, Calendar, Package } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { WineTemplate } from '@/types/wineDatabase';

interface VintageEntry {
  id: string;
  year: string;
  quantity: string;
}

interface BatchAddModalProps {
  visible: boolean;
  wine: WineTemplate | null;
  producer: string;
  supplier: string;
  purchasePrice: string;
  sellingPrice: string;
  minQuantity: string;
  quantityTarget: string;
  onClose: () => void;
  onBatchAdd: (vintages: VintageEntry[]) => void;
}

export default function BatchAddModal({
  visible,
  wine,
  producer,
  supplier,
  purchasePrice,
  sellingPrice,
  minQuantity,
  quantityTarget,
  onClose,
  onBatchAdd,
}: BatchAddModalProps) {
  const [vintages, setVintages] = useState<VintageEntry[]>([
    { id: '1', year: '', quantity: '' },
  ]);

  const currentYear = new Date().getFullYear();

  const addVintage = () => {
    setVintages([
      ...vintages,
      { id: Date.now().toString(), year: '', quantity: '' },
    ]);
  };

  const removeVintage = (id: string) => {
    if (vintages.length === 1) {
      Alert.alert('Cannot Remove', 'You must have at least one vintage.');
      return;
    }
    setVintages(vintages.filter((v) => v.id !== id));
  };

  const updateVintage = (id: string, field: 'year' | 'quantity', value: string) => {
    setVintages(
      vintages.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleAddAll = () => {
    // Validate all vintages
    const validVintages = vintages.filter((v) => {
      const year = parseInt(v.year);
      const quantity = parseInt(v.quantity);
      return (
        !isNaN(year) &&
        year >= 1900 &&
        year <= currentYear + 1 &&
        !isNaN(quantity) &&
        quantity > 0
      );
    });

    if (validVintages.length === 0) {
      Alert.alert('Invalid Data', 'Please enter valid years and quantities.');
      return;
    }

    if (validVintages.length < vintages.length) {
      Alert.alert(
        'Some Entries Invalid',
        `Only ${validVintages.length} of ${vintages.length} entries are valid. Continue with valid entries only?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => {
              onBatchAdd(validVintages);
              setVintages([{ id: '1', year: '', quantity: '' }]);
            },
          },
        ]
      );
      return;
    }

    onBatchAdd(validVintages);
    setVintages([{ id: '1', year: '', quantity: '' }]);
  };

  const quickYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const renderVintageItem = ({ item, index }: { item: VintageEntry; index: number }) => (
    <View style={styles.vintageCard}>
      <View style={styles.vintageHeader}>
        <Text style={styles.vintageNumber}>#{index + 1}</Text>
        {vintages.length > 1 && (
          <TouchableOpacity
            onPress={() => removeVintage(item.id)}
            style={styles.removeButton}
          >
            <Trash2 size={18} color={Colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      {/* Year Input */}
      <View style={styles.fieldContainer}>
        <View style={styles.fieldLabel}>
          <Calendar size={16} color={Colors.primary} />
          <Text style={styles.label}>Vintage Year</Text>
        </View>
        <TextInput
          style={styles.input}
          value={item.year}
          onChangeText={(value) => updateVintage(item.id, 'year', value)}
          placeholder="e.g., 2020"
          placeholderTextColor={Colors.lightText}
          keyboardType="numeric"
          maxLength={4}
        />
        
        {/* Quick Year Selection */}
        <View style={styles.quickYearsRow}>
          {quickYears.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.quickYearButton,
                item.year === year.toString() && styles.quickYearButtonSelected,
              ]}
              onPress={() => updateVintage(item.id, 'year', year.toString())}
            >
              <Text
                style={[
                  styles.quickYearText,
                  item.year === year.toString() && styles.quickYearTextSelected,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quantity Input */}
      <View style={styles.fieldContainer}>
        <View style={styles.fieldLabel}>
          <Package size={16} color={Colors.primary} />
          <Text style={styles.label}>Quantity</Text>
        </View>
        <TextInput
          style={styles.input}
          value={item.quantity}
          onChangeText={(value) => updateVintage(item.id, 'quantity', value)}
          placeholder="0"
          placeholderTextColor={Colors.lightText}
          keyboardType="numeric"
        />
        
        {/* Quick Quantity Selection */}
        <View style={styles.quickQuantitiesRow}>
          {[6, 12, 24, 36].map((qty) => (
            <TouchableOpacity
              key={qty}
              style={[
                styles.quickQuantityButton,
                item.quantity === qty.toString() && styles.quickQuantityButtonSelected,
              ]}
              onPress={() => updateVintage(item.id, 'quantity', qty.toString())}
            >
              <Text
                style={[
                  styles.quickQuantityText,
                  item.quantity === qty.toString() && styles.quickQuantityTextSelected,
                ]}
              >
                {qty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Batch Add Vintages</Text>
            {wine && (
              <Text style={styles.subtitle}>
                {wine.name}
                {producer && ` - ${producer}`}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Shared Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Supplier:</Text>
            <Text style={styles.infoValue}>{supplier || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Purchase Price:</Text>
            <Text style={styles.infoValue}>€{purchasePrice || '0.00'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Selling Price:</Text>
            <Text style={styles.infoValue}>€{sellingPrice || '0.00'}</Text>
          </View>
        </View>

        {/* Vintages List */}
        <FlatList
          data={vintages}
          renderItem={renderVintageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={addVintage}>
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add Another Vintage</Text>
            </TouchableOpacity>
          }
        />

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleAddAll}>
            <Check size={20} color={Colors.secondary} />
            <Text style={styles.submitButtonText}>
              Add {vintages.length} Vintage{vintages.length !== 1 ? 's' : ''}
            </Text>
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
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  vintageCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  vintageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vintageNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  removeButton: {
    padding: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
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
  quickYearsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickYearButton: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  quickYearButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickYearText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  quickYearTextSelected: {
    color: Colors.secondary,
  },
  quickQuantitiesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickQuantityButton: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  quickQuantityButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickQuantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  quickQuantityTextSelected: {
    color: Colors.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
