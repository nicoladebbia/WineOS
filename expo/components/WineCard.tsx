import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Wine, ReorderStatus } from '@/types/wine';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Wine as WineIcon, AlertTriangle, AlertCircle, Check, ShoppingCart, Package } from 'lucide-react-native';
import SaleModal from './SaleModal';
import RestockModal from './RestockModal';

// Export card height for FlatList optimization
// NOTE: This is an approximate value. Actual height may vary slightly based on content.
// If you notice janky scrolling, measure the actual rendered height and update this constant.
export const WINE_CARD_HEIGHT = 220;

interface WineCardProps {
  wine: Wine;
}

function WineCard({ wine }: WineCardProps) {
  const router = useRouter();
  const getReorderStatus = useWineStore((state) => state.getReorderStatus);
  
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  
  const status = getReorderStatus(wine);
  const totalSales = wine.sales?.reduce((total, sale) => total + sale.quantity, 0) ?? 0;
  const needsReorder = wine.quantity < wine.quantityTarget;
  
  const handlePress = useCallback(() => {
    router.push(`/wine/${wine.id}`);
  }, [router, wine.id]);
  
  const handleSell = useCallback(() => {
    setShowSaleModal(true);
  }, []);
  
  const handleRestock = useCallback(() => {
    setShowRestockModal(true);
  }, []);
  
  return (
    <>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed
        ]}
        onPress={handlePress}
      >
        {/* Header with status badge */}
        <View style={styles.statusRow}>
          <StatusBadge status={status} />
          {needsReorder && (
            <View style={styles.reorderBadge}>
              <AlertTriangle size={12} color={Colors.warning} />
              <Text style={styles.reorderText}>{translations.dashboard.reorderNeeded}</Text>
            </View>
          )}
        </View>

        {/* Wine name and year */}
        <View style={styles.header}>
          <WineIcon size={20} color={Colors.primary} />
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {wine.name} {wine.year}
          </Text>
        </View>
        
        {/* Location */}
        <Text style={styles.location} numberOfLines={1}>
          {wine.region}, {wine.country}
        </Text>
        
        {/* Key metrics in a grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{translations.wine.stock}</Text>
            <Text style={[styles.metricValue, status !== 'ok' && styles.metricValueDanger]}>
              {wine.quantity}
            </Text>
          </View>
          
          <View style={styles.metricDivider} />
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{translations.wine.target}</Text>
            <Text style={styles.metricValue}>{wine.quantityTarget}</Text>
          </View>
          
          <View style={styles.metricDivider} />
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{translations.wine.price}</Text>
            <Text style={styles.metricValue}>€{wine.sellingPrice.toFixed(2)}</Text>
          </View>
          
          <View style={styles.metricDivider} />
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{translations.wine.sold}</Text>
            <Text style={styles.metricValue}>{totalSales}</Text>
          </View>
        </View>
        
        {/* Action buttons */}
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reorderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 160, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reorderText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.warning,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 24,
  },
  location: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 16,
    marginLeft: 30,
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
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.lightText,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  metricValueDanger: {
    color: Colors.danger,
  },
  actionButtons: {
    flexDirection: 'row',
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

// Export memoized component for performance
export default React.memo(WineCard);