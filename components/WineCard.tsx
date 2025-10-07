import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Wine, ReorderStatus } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Wine as WineIcon, AlertTriangle, AlertCircle, Check, ShoppingCart, Package } from 'lucide-react-native';
import SaleModal from './SaleModal';
import RestockModal from './RestockModal';

interface WineCardProps {
  wine: Wine;
}

export default function WineCard({ wine }: WineCardProps) {
  const router = useRouter();
  const getReorderStatus = useWineStore((state) => state.getReorderStatus);
  const getSuggestedReorderQuantity = useWineStore((state) => state.getSuggestedReorderQuantity);
  
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  
  const status = getReorderStatus(wine);
  const totalSales = wine.sales && Array.isArray(wine.sales) ? wine.sales.reduce((total, sale) => total + sale.quantity, 0) : 0;
  const suggestedReorderQuantity = getSuggestedReorderQuantity(wine);
  const needsReorder = wine.quantity < wine.quantityTarget;
  
  const handlePress = () => {
    router.push(`/wine/${wine.id}`);
  };
  
  const handleSell = () => {
    setShowSaleModal(true);
  };
  
  const handleRestock = () => {
    setShowRestockModal(true);
  };
  
  return (
    <>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed
        ]}
        onPress={handlePress}
      >
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <WineIcon size={18} color={Colors.primary} />
            <Text style={styles.name}>{wine.name} {wine.year}</Text>
          </View>
          <View style={styles.statusContainer}>
            {needsReorder && status === 'ok' && (
              <AlertTriangle size={16} color={Colors.warning} style={styles.warningIcon} />
            )}
            <StatusBadge status={status} />
          </View>
        </View>
        
        <View style={styles.details}>
          <DetailItem label={translations.wine.country} value={wine.country} />
          <DetailItem label={translations.wine.region} value={wine.region} />
          
          <View style={styles.stockSection}>
            <DetailItem 
              label={translations.wine.quantity} 
              value={wine.quantity.toString()}
              highlight={status !== 'ok'}
            />
            
            <DetailItem 
              label={translations.wine.soldBottles} 
              value={totalSales.toString()}
              icon={<ShoppingCart size={14} color={Colors.primary} />}
            />
            
            <DetailItem 
              label={translations.wine.quantityTarget} 
              value={wine.quantityTarget.toString()}
              icon={needsReorder ? <AlertTriangle size={14} color={Colors.warning} /> : null}
            />
          </View>
          
          <DetailItem 
            label={translations.wine.sellingPrice} 
            value={`€${wine.sellingPrice.toFixed(2)}`} 
          />
          
          {status !== 'ok' && (
            <DetailItem 
              label={translations.wine.suggestedReorderQuantity} 
              value={suggestedReorderQuantity.toString()}
              highlight={true}
              icon={<AlertTriangle size={14} color={Colors.danger} />}
            />
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.sellButton, wine.quantity <= 0 && styles.disabledButton]} 
            onPress={handleSell}
            disabled={wine.quantity <= 0}
          >
            <ShoppingCart size={16} color={Colors.secondary} />
            <Text style={styles.actionButtonText}>{translations.actions.sell}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.restockButton]} 
            onPress={handleRestock}
          >
            <Package size={16} color={Colors.secondary} />
            <Text style={styles.actionButtonText}>{translations.actions.restock}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
      
      <SaleModal 
        visible={showSaleModal} 
        wine={wine} 
        onClose={() => setShowSaleModal(false)} 
      />
      
      <RestockModal 
        visible={showRestockModal} 
        wine={wine} 
        onClose={() => setShowRestockModal(false)} 
      />
    </>
  );
}

function StatusBadge({ status }: { status: ReorderStatus }) {
  let backgroundColor;
  let textColor = Colors.text;
  let Icon;
  let label;
  
  switch (status) {
    case 'urgent':
      backgroundColor = 'rgba(229, 57, 53, 0.15)';
      textColor = Colors.danger;
      Icon = AlertCircle;
      label = translations.reorderStatus.urgent;
      break;
    case 'warning':
      backgroundColor = 'rgba(255, 160, 0, 0.15)';
      textColor = Colors.warning;
      Icon = AlertTriangle;
      label = translations.reorderStatus.warning;
      break;
    default:
      backgroundColor = 'rgba(67, 160, 71, 0.15)';
      textColor = Colors.success;
      Icon = Check;
      label = translations.reorderStatus.ok;
  }
  
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Icon size={14} color={textColor} />
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

interface DetailItemProps { 
  label: string; 
  value: string; 
  highlight?: boolean;
  icon?: React.ReactNode;
}

function DetailItem({ 
  label, 
  value, 
  highlight = false,
  icon = null
}: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailLabelContainer}>
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
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    gap: 8,
  },
  stockSection: {
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  highlightedValue: {
    color: Colors.danger,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  sellButton: {
    backgroundColor: Colors.primary,
  },
  restockButton: {
    backgroundColor: Colors.success,
  },
  disabledButton: {
    backgroundColor: Colors.lightText,
    opacity: 0.7,
  },
  actionButtonText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});