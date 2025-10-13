import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { CheckCircle, Search, Plus, Eye } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SuccessActionsModalProps {
  visible: boolean;
  wineName: string;
  onViewInventory: () => void;
  onAddAnother: () => void;
  onSearchAgain: () => void;
}

export default function SuccessActionsModal({
  visible,
  wineName,
  onViewInventory,
  onAddAnother,
  onSearchAgain,
}: SuccessActionsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onSearchAgain}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <CheckCircle size={64} color={Colors.success} />
          </View>

          {/* Success Message */}
          <Text style={styles.title}>Wine Added Successfully!</Text>
          <Text style={styles.subtitle}>{wineName}</Text>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={onViewInventory}
            >
              <Eye size={20} color={Colors.secondary} />
              <Text style={styles.actionButtonTextPrimary}>View in Inventory</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onAddAnother}
              >
                <Plus size={20} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Add Another Vintage</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={onSearchAgain}
              >
                <Search size={20} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Search Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 24,
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
  secondaryActions: {
    marginTop: 8,
  },
});
