import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { AlertTriangle, TrendingDown, Package } from 'lucide-react-native';
import { getUrgencyColor } from '@/utils/analyticsHelpers';
import * as Haptics from 'expo-haptics';

export default function VelocityAlerts() {
  const router = useRouter();
  const getVelocityAlerts = useWineStore((state) => state.getVelocityAlerts);

  const alerts = useMemo(() => {
    return getVelocityAlerts();
  }, [getVelocityAlerts]);

  const handleAlertPress = (wineId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push(`/wine/${wineId}`);
  };

  // FIXED: Use utility function instead of duplicating logic
  const getUrgencyIcon = (urgency: 'critical' | 'warning' | 'watch') => {
    const color = getUrgencyColor(urgency);
    return urgency === 'critical' ? (
      <AlertTriangle size={18} color={color} />
    ) : (
      <TrendingDown size={18} color={color} />
    );
  };

  // FIXED: Use .map() instead of FlatList with scrollEnabled={false}
  const renderAlert = (item: typeof alerts[0], index: number) => {
    const urgencyColor = getUrgencyColor(item.urgency);

    return (
      <Pressable
        key={item.wine.id}
        style={({ pressed }) => [
          styles.alertItem,
          { borderLeftColor: urgencyColor },
          pressed && styles.alertItemPressed,
        ]}
        onPress={() => handleAlertPress(item.wine.id)}
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertIcon}>{getUrgencyIcon(item.urgency)}</View>
          <View style={styles.alertInfo}>
            <Text style={styles.wineName} numberOfLines={1}>
              {item.wine.name} {item.wine.year}
            </Text>
            <Text style={styles.wineRegion} numberOfLines={1}>
              {item.wine.region}, {item.wine.country}
            </Text>
          </View>
        </View>

        <View style={styles.alertDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{translations.analytics?.currentStock || 'Current Stock'}:</Text>
            <Text style={[styles.detailValue, { color: urgencyColor }]}>
              {item.currentStock} bottles
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{translations.analytics?.salesRate || 'Sales Rate'}:</Text>
            <Text style={styles.detailValue}>
              {item.weeklySalesRate.toFixed(1)} bottles/week
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{translations.analytics?.daysUntilStockout || 'Days Until Stockout'}:</Text>
            <Text style={[styles.detailValue, styles.daysValue, { color: urgencyColor }]}>
              ~{Math.floor(item.daysUntilStockout)} days
            </Text>
          </View>

          {item.suggestedReorder > 0 && (
            <View style={[styles.reorderSuggestion, { backgroundColor: `${urgencyColor}15` }]}>
              <Package size={14} color={urgencyColor} />
              <Text style={[styles.reorderText, { color: urgencyColor }]}>
                {translations.analytics?.suggestedReorder || 'Suggested reorder'}: {item.suggestedReorder} bottles
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  if (alerts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <AlertTriangle size={20} color={Colors.success} />
          <Text style={styles.title}>{translations.analytics?.velocityAlerts || 'Velocity Alerts'}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Package size={48} color={Colors.success} />
          <Text style={styles.emptyText}>
            {translations.analytics?.allStockHealthy || 'All stock levels are healthy! 🎉'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertTriangle size={20} color={Colors.danger} />
        <Text style={styles.title}>{translations.analytics?.velocityAlerts || 'Velocity Alerts'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{alerts.length}</Text>
        </View>
      </View>

      {/* FIXED: Use .map() instead of FlatList */}
      <View>
        {alerts.map((item, index) => renderAlert(item, index))}
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  alertItem: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  alertItemPressed: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  wineRegion: {
    fontSize: 12,
    color: Colors.lightText,
  },
  alertDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  daysValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  reorderSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  reorderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 12,
    textAlign: 'center',
  },
});
