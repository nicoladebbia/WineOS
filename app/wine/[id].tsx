import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useWineStore } from '@/store/wineStore';
import { Wine } from '@/types/wine';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  User, 
  DollarSign, 
  Package, 
  Clock, 
  FileText,
  ShoppingCart,
  AlertTriangle,
  Target
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import WineForm from '@/components/WineForm';
import SaleForm from '@/components/SaleForm';
import SalesHistory from '@/components/SalesHistory';
import Toast from '@/components/Toast';

export default function WineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const getWineById = useWineStore((state) => state.getWineById);
  const deleteWine = useWineStore((state) => state.deleteWine);
  const getReorderStatus = useWineStore((state) => state.getReorderStatus);
  const getSuggestedReorderQuantity = useWineStore((state) => state.getSuggestedReorderQuantity);
  const getTotalSales = useWineStore((state) => state.getTotalSales);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  
  const wine = getWineById(id);
  
  if (!wine) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vino non trovato</Text>
      </View>
    );
  }
  
  const reorderStatus = getReorderStatus(wine);
  const suggestedReorderQuantity = getSuggestedReorderQuantity(wine);
  const totalSales = getTotalSales(id);
  
  const handleDelete = () => {
    Alert.alert(
      "Conferma eliminazione",
      "Sei sicuro di voler eliminare questo vino?",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Elimina",
          onPress: () => {
            deleteWine(id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleEdit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsEditing(true);
  };
  
  const handleSell = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowSaleForm(true);
  };
  
  const handleSaleComplete = () => {
    setShowSaleForm(false);
    setToastMessage(translations.sales.success);
    setToastType('success');
    setShowToast(true);
  };
  
  // Show reorder notification if stock is below target
  const showReorderNotification = () => {
    if (wine.quantity < wine.quantityTarget) {
      const message = translations.notifications.reorderNeeded
        .replace('{quantity}', wine.quantity.toString())
        .replace('{wine}', `${wine.name} ${wine.year}`)
        .replace('{target}', wine.quantityTarget.toString());
      
      setToastMessage(message);
      setToastType('warning');
      setShowToast(true);
    }
  };
  
  if (isEditing) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: `${translations.actions.edit} ${wine.name}` }} />
        <WineForm initialData={wine} isEditing />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: wine.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleEdit}
              >
                <Edit size={22} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleDelete}
              >
                <Trash2 size={22} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{wine.name}</Text>
          <View style={[
            styles.statusBadge,
            reorderStatus === 'urgent' && styles.urgentBadge,
            reorderStatus === 'warning' && styles.warningBadge,
            reorderStatus === 'ok' && styles.okBadge,
          ]}>
            <Text style={[
              styles.statusText,
              reorderStatus === 'urgent' && styles.urgentText,
              reorderStatus === 'warning' && styles.warningText,
              reorderStatus === 'ok' && styles.okText,
            ]}>
              {translations.reorderStatus[reorderStatus]}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <DetailItem 
            icon={<Calendar size={20} color={Colors.primary} />}
            label={translations.wine.year}
            value={wine.year.toString()}
          />
          
          <DetailItem 
            icon={<MapPin size={20} color={Colors.primary} />}
            label={translations.wine.region}
            value={`${wine.region}, ${wine.country}`}
          />
          
          <DetailItem 
            icon={<User size={20} color={Colors.primary} />}
            label={translations.wine.supplier}
            value={wine.supplier}
          />
        </View>
        
        <View style={styles.section}>
          <DetailItem 
            icon={<DollarSign size={20} color={Colors.primary} />}
            label={translations.wine.purchasePrice}
            value={`€${wine.purchasePrice.toFixed(2)}`}
          />
          
          <DetailItem 
            icon={<DollarSign size={20} color={Colors.primary} />}
            label={translations.wine.sellingPrice}
            value={`€${wine.sellingPrice.toFixed(2)}`}
          />
          
          <DetailItem 
            icon={<Package size={20} color={Colors.primary} />}
            label={translations.wine.quantity}
            value={wine.quantity.toString()}
            highlight={reorderStatus !== 'ok'}
          />
          
          <DetailItem 
            icon={<Package size={20} color={Colors.primary} />}
            label={translations.wine.minQuantity}
            value={wine.minQuantity.toString()}
          />
          
          <DetailItem 
            icon={<Target size={20} color={Colors.primary} />}
            label={translations.wine.quantityTarget}
            value={wine.quantityTarget.toString()}
          />
          
          <DetailItem 
            icon={<ShoppingCart size={20} color={Colors.primary} />}
            label={translations.wine.soldBottles}
            value={totalSales.toString()}
          />
          
          {reorderStatus !== 'ok' && (
            <TouchableOpacity 
              style={styles.reorderNotificationButton}
              onPress={showReorderNotification}
            >
              <AlertTriangle size={20} color={Colors.danger} />
              <View style={styles.reorderTextContainer}>
                <Text style={styles.reorderTitle}>
                  {translations.wine.suggestedReorderQuantity}: {suggestedReorderQuantity}
                </Text>
                <Text style={styles.reorderSubtitle}>
                  Tocca per vedere dettagli
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {wine.notes && (
          <View style={styles.section}>
            <View style={styles.notesHeader}>
              <FileText size={20} color={Colors.primary} />
              <Text style={styles.notesTitle}>{translations.wine.notes}</Text>
            </View>
            <Text style={styles.notesText}>{wine.notes}</Text>
          </View>
        )}
        
        {showSaleForm ? (
          <SaleForm wineId={id} onSaleComplete={handleSaleComplete} />
        ) : (
          <TouchableOpacity
            style={[
              styles.sellButton,
              wine.quantity <= 0 && styles.disabledButton
            ]}
            onPress={handleSell}
            disabled={wine.quantity <= 0}
          >
            <ShoppingCart size={20} color={Colors.secondary} />
            <Text style={styles.sellButtonText}>{translations.actions.sell}</Text>
          </TouchableOpacity>
        )}
        
        <SalesHistory sales={wine.sales || []} />
        
        <View style={styles.section}>
          <DetailItem 
            icon={<Clock size={20} color={Colors.primary} />}
            label={translations.wine.lastUpdated}
            value={new Date(wine.lastUpdated).toLocaleDateString()}
          />
        </View>
      </ScrollView>
      
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </View>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

function DetailItem({ icon, label, value, highlight = false }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailLeft}>
        {icon}
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={[
        styles.detailValue,
        highlight && styles.highlightedValue
      ]}>
        {value}
      </Text>
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
    paddingBottom: 32,
  },
  errorText: {
    fontSize: 18,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 24,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgentBadge: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
  },
  warningBadge: {
    backgroundColor: 'rgba(255, 160, 0, 0.15)',
  },
  okBadge: {
    backgroundColor: 'rgba(67, 160, 71, 0.15)',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  urgentText: {
    color: Colors.danger,
  },
  warningText: {
    color: Colors.warning,
  },
  okText: {
    color: Colors.success,
  },
  section: {
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
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  highlightedValue: {
    color: Colors.danger,
    fontWeight: '600',
  },
  reorderNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 12,
  },
  reorderTextContainer: {
    flex: 1,
  },
  reorderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.danger,
  },
  reorderSubtitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 2,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  notesText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  sellButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: Colors.lightText,
    opacity: 0.7,
  },
  sellButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});