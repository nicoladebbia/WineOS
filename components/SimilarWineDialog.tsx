import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Platform
} from 'react-native';
import { Wine } from '@/types/wine';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { AlertTriangle } from 'lucide-react-native';

interface SimilarWineDialogProps {
  visible: boolean;
  similarWine: Wine | null;
  newWineName: string;
  newWineYear: number | string;
  onAddAnyway: () => void;
  onEditExisting: () => void;
  onCancel: () => void;
}

export default function SimilarWineDialog({
  visible,
  similarWine,
  newWineName,
  newWineYear,
  onAddAnyway,
  onEditExisting,
  onCancel
}: SimilarWineDialogProps) {
  if (!visible || !similarWine) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={24} color={Colors.warning} />
            <Text style={styles.warningTitle}>{translations.notifications.similarWineFound}</Text>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <Text style={styles.message}>
              {`${similarWine.name} ${similarWine.year}`}
            </Text>
            
            <View style={styles.comparisonContainer}>
              <View style={styles.wineDetails}>
                <Text style={styles.detailsTitle}>Existing wine:</Text>
                <DetailItem label={translations.wine.name} value={similarWine.name} />
                <DetailItem label={translations.wine.year} value={similarWine.year.toString()} />
                <DetailItem label={translations.wine.region} value={`${similarWine.region}, ${similarWine.country}`} />
                <DetailItem label={translations.wine.quantity} value={similarWine.quantity.toString()} />
              </View>
              
              <View style={styles.wineDetails}>
                <Text style={styles.detailsTitle}>New wine:</Text>
                <DetailItem label={translations.wine.name} value={newWineName} />
                <DetailItem label={translations.wine.year} value={newWineYear.toString()} />
              </View>
            </View>
            
            <Text style={styles.confirmText}>
              Are you sure you want to add {newWineName} {newWineYear}?
            </Text>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{translations.notifications.cancel}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={onEditExisting}
            >
              <Text style={styles.buttonText}>{translations.notifications.editExisting}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.addButton]} 
              onPress={onAddAnyway}
            >
              <Text style={styles.buttonText}>{translations.notifications.addAnyway}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
    width: Platform.OS === 'web' ? 500 : '100%',
    maxWidth: 500,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  warningHeader: {
    backgroundColor: 'rgba(255, 160, 0, 0.15)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    maxHeight: 400,
    padding: 16,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    fontWeight: '500',
  },
  comparisonContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    marginBottom: 16,
  },
  wineDetails: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.lightText,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  confirmText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  editButton: {
    backgroundColor: Colors.success,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});