import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { AlertTriangle, Plus, Eye, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Wine } from '@/types/wine';

interface DuplicateWineDialogProps {
  visible: boolean;
  duplicateWine: Wine | null;
  matchType: 'exact' | 'similar';
  confidence: number;
  onUpdateQuantity: () => void;
  onAddAnyway: () => void;
  onCancel: () => void;
}

export default function DuplicateWineDialog({
  visible,
  duplicateWine,
  matchType,
  confidence,
  onUpdateQuantity,
  onAddAnyway,
  onCancel,
}: DuplicateWineDialogProps) {
  if (!duplicateWine) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <AlertTriangle size={48} color={Colors.warning} />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {matchType === 'exact' ? 'Duplicate Detected' : 'Similar Wine Found'}
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            {matchType === 'exact'
              ? 'You already have this wine in your inventory:'
              : `A similar wine (${confidence}% match) is already in your inventory:`}
          </Text>

          {/* Existing Wine Card */}
          <View style={styles.wineCard}>
            <View style={styles.wineHeader}>
              <Text style={styles.wineName}>{duplicateWine.name}</Text>
              <Text style={styles.wineYear}>{duplicateWine.year}</Text>
            </View>
            <View style={styles.wineDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Current Quantity:</Text>
                <Text style={styles.detailValue}>{duplicateWine.quantity} bottles</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Supplier:</Text>
                <Text style={styles.detailValue}>{duplicateWine.supplier}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Purchase Price:</Text>
                <Text style={styles.detailValue}>€{duplicateWine.purchasePrice.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={onUpdateQuantity}
            >
              <Plus size={20} color={Colors.secondary} />
              <Text style={styles.actionButtonTextPrimary}>Update Quantity</Text>
            </TouchableOpacity>

            {matchType === 'similar' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onAddAnyway}
              >
                <Eye size={20} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Add as Separate Entry</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <X size={18} color={Colors.lightText} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 20,
  },
  wineCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  wineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  wineName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  wineYear: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  wineDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  actions: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.lightText,
  },
});
