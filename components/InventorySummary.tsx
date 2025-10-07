import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { AlertTriangle, Package } from 'lucide-react-native';

interface InventorySummaryProps {
  winesNeedingReorder: number;
  totalBottles: number;
}

export default function InventorySummary({ 
  winesNeedingReorder, 
  totalBottles
}: InventorySummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryItem}>
        <View style={styles.iconContainer}>
          <Package size={16} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.value, totalBottles === 0 && styles.zeroValue]}>{totalBottles}</Text>
          <Text style={styles.label}>{translations.dashboard.totalBottles}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.summaryItem}>
        <View style={[
          styles.iconContainer, 
          winesNeedingReorder > 0 ? styles.warningIcon : {}
        ]}>
          <AlertTriangle size={16} color={winesNeedingReorder > 0 ? Colors.warning : Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.value,
            winesNeedingReorder === 0 ? styles.zeroValue : styles.warningText
          ]}>
            {winesNeedingReorder}
          </Text>
          <Text style={styles.label}>{translations.dashboard.lowStock}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.divider,
    alignSelf: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  warningIcon: {
    backgroundColor: 'rgba(255, 160, 0, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  zeroValue: {
    color: Colors.lightText,
    opacity: 0.7,
  },
  warningText: {
    color: Colors.warning,
  },
  label: {
    fontSize: 12,
    color: Colors.lightText,
  },
});