import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useWineStore } from '@/store/wineStore';
import { Wine } from '@/types/wine';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import {
  AlertTriangle,
  TrendingDown,
  Package,
  DollarSign,
  CheckCircle,
  Plus,
} from 'lucide-react-native';
import Toast from '@/components/Toast';
import * as Haptics from 'expo-haptics';

interface ReorderItem extends Wine {
  suggestedQuantity: number;
  estimatedCost: number;
  urgency: 'critical' | 'warning' | 'low';
}

export default function ReorderAssistantMode() {
  const wines = useWineStore((state) => state.wines);
  const updateWine = useWineStore((state) => state.updateWine);
  const getReorderStatus = useWineStore((state) => state.getReorderStatus);
  const getSuggestedReorderQuantity = useWineStore((state) => state.getSuggestedReorderQuantity);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [customQuantities, setCustomQuantities] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate reorder items with urgency
  const reorderItems: ReorderItem[] = useMemo(() => {
    return wines
      .filter((wine) => wine.quantity < wine.quantityTarget)
      .map((wine) => {
        const status = getReorderStatus(wine);
        const suggestedQuantity = getSuggestedReorderQuantity(wine);
        const estimatedCost = suggestedQuantity * wine.purchasePrice;

        let urgency: 'critical' | 'warning' | 'low';
        if (status === 'urgent') {
          urgency = 'critical';
        } else if (status === 'warning') {
          urgency = 'warning';
        } else {
          urgency = 'low';
        }

        return {
          ...wine,
          suggestedQuantity,
          estimatedCost,
          urgency,
        };
      })
      .sort((a, b) => {
        // Sort by urgency first
        const urgencyOrder = { critical: 0, warning: 1, low: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        // Then by quantity deficit
        const aDeficit = a.quantityTarget - a.quantity;
        const bDeficit = b.quantityTarget - b.quantity;
        return bDeficit - aDeficit;
      });
  }, [wines]);

  // Group by supplier
  const itemsBySupplier = useMemo(() => {
    const grouped: Record<string, ReorderItem[]> = {};
    reorderItems.forEach((item) => {
      if (!grouped[item.supplier]) {
        grouped[item.supplier] = [];
      }
      grouped[item.supplier].push(item);
    });
    return grouped;
  }, [reorderItems]);

  const totalEstimatedCost = useMemo(() => {
    return Array.from(selectedItems).reduce((total, wineId) => {
      const wine = reorderItems.find((w) => w.id === wineId);
      if (!wine) return total;
      const quantity = customQuantities[wineId]
        ? Number(customQuantities[wineId])
        : wine.suggestedQuantity;
      return total + quantity * wine.purchasePrice;
    }, 0);
  }, [selectedItems, customQuantities, reorderItems]);

  const handleToggleItem = (wineId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newSelected = new Set(selectedItems);
    if (newSelected.has(wineId)) {
      newSelected.delete(wineId);
    } else {
      newSelected.add(wineId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (selectedItems.size === reorderItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(reorderItems.map((item) => item.id)));
    }
  };

  const handleRestock = () => {
    if (selectedItems.size === 0) {
      setToastMessage('Please select at least one wine to restock');
      setShowToast(true);
      return;
    }

    Alert.alert(
      'Confirm Restock',
      `Restock ${selectedItems.size} wine${selectedItems.size > 1 ? 's' : ''} for €${totalEstimatedCost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Array.from(selectedItems).forEach((wineId) => {
              const wine = reorderItems.find((w) => w.id === wineId);
              if (!wine) return;

              const quantity = customQuantities[wineId]
                ? Number(customQuantities[wineId])
                : wine.suggestedQuantity;

              updateWine(wineId, {
                quantity: wine.quantity + quantity,
              });
            });

            setToastMessage(`Successfully restocked ${selectedItems.size} wine${selectedItems.size > 1 ? 's' : ''}!`);
            setShowToast(true);
            setSelectedItems(new Set());
            setCustomQuantities({});
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ReorderItem }) => {
    const isSelected = selectedItems.has(item.id);
    const quantity = customQuantities[item.id]
      ? Number(customQuantities[item.id])
      : item.suggestedQuantity;
    const cost = quantity * item.purchasePrice;

    return (
      <TouchableOpacity
        style={[styles.itemCard, isSelected && styles.itemCardSelected]}
        onPress={() => handleToggleItem(item.id)}
      >
        {/* Header with urgency badge */}
        <View style={styles.itemHeader}>
          <View style={styles.itemHeaderLeft}>
            <View
              style={[
                styles.checkbox,
                isSelected && styles.checkboxSelected,
              ]}
            >
              {isSelected && <CheckCircle size={20} color={Colors.primary} />}
            </View>
            <View style={styles.itemTitleContainer}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name} {item.year}
              </Text>
              <Text style={styles.itemSupplier}>{item.supplier}</Text>
            </View>
          </View>
          <UrgencyBadge urgency={item.urgency} />
        </View>

        {/* Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Current</Text>
            <Text style={[styles.metricValue, styles.metricValueDanger]}>
              {item.quantity}
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Target</Text>
            <Text style={styles.metricValue}>{item.quantityTarget}</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Deficit</Text>
            <Text style={[styles.metricValue, styles.metricValueWarning]}>
              {item.quantityTarget - item.quantity}
            </Text>
          </View>
        </View>

        {/* Quantity Input */}
        {isSelected && (
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Restock Quantity:</Text>
            <View style={styles.quantityInputContainer}>
              <TextInput
                style={styles.quantityInput}
                value={customQuantities[item.id] || item.suggestedQuantity.toString()}
                onChangeText={(value) =>
                  setCustomQuantities({ ...customQuantities, [item.id]: value })
                }
                keyboardType="numeric"
                placeholder={item.suggestedQuantity.toString()}
              />
              <Text style={styles.quantitySuffix}>bottles</Text>
            </View>
            <Text style={styles.costText}>Cost: €{cost.toFixed(2)}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (reorderItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CheckCircle size={64} color={Colors.success} />
        <Text style={styles.emptyTitle}>All Stock Levels Healthy!</Text>
        <Text style={styles.emptyDescription}>
          All wines are at or above their target inventory levels.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Header */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <AlertTriangle size={20} color={Colors.danger} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{reorderItems.length}</Text>
              <Text style={styles.summaryLabel}>Wines Below Target</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <DollarSign size={20} color={Colors.primary} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>
                €{reorderItems.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>Total Est. Cost</Text>
            </View>
          </View>
        </View>

        {selectedItems.size > 0 && (
          <View style={styles.selectedSummary}>
            <Text style={styles.selectedText}>
              {selectedItems.size} selected • €{totalEstimatedCost.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
          <Text style={styles.selectAllText}>
            {selectedItems.size === reorderItems.length ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.restockButton, selectedItems.size === 0 && styles.restockButtonDisabled]}
          onPress={handleRestock}
          disabled={selectedItems.size === 0}
        >
          <Plus size={20} color={Colors.secondary} />
          <Text style={styles.restockButtonText}>Restock Selected</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={reorderItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Toast message={toastMessage} visible={showToast} onClose={() => setShowToast(false)} />
    </View>
  );
}

function UrgencyBadge({ urgency }: { urgency: 'critical' | 'warning' | 'low' }) {
  let backgroundColor, textColor, Icon, label;

  switch (urgency) {
    case 'critical':
      backgroundColor = 'rgba(229, 57, 53, 0.15)';
      textColor = Colors.danger;
      Icon = AlertTriangle;
      label = 'Critical';
      break;
    case 'warning':
      backgroundColor = 'rgba(255, 160, 0, 0.15)';
      textColor = Colors.warning;
      Icon = TrendingDown;
      label = 'Warning';
      break;
    default:
      backgroundColor = 'rgba(125, 29, 63, 0.1)';
      textColor = Colors.primary;
      Icon = Package;
      label = 'Low';
  }

  return (
    <View style={[styles.urgencyBadge, { backgroundColor }]}>
      <Icon size={14} color={textColor} />
      <Text style={[styles.urgencyText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 16,
  },
  selectedSummary: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  selectAllButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  restockButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  restockButtonDisabled: {
    backgroundColor: Colors.lightText,
    opacity: 0.5,
  },
  restockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  itemSupplier: {
    fontSize: 13,
    color: Colors.lightText,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.lightText,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  metricValueDanger: {
    color: Colors.danger,
  },
  metricValueWarning: {
    color: Colors.warning,
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 8,
  },
  quantitySection: {
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quantitySuffix: {
    fontSize: 14,
    color: Colors.lightText,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
  },
});
