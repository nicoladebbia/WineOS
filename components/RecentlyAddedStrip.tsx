import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Clock, Wine as WineIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useRecentlyAddedWines } from '@/hooks/useRecentlyAddedWines';
import { WineTemplate } from '@/types/wineDatabase';

interface RecentlyAddedStripProps {
  onWineSelect: (wineName: string) => void;
}

export default function RecentlyAddedStrip({ onWineSelect }: RecentlyAddedStripProps) {
  const recentWines = useRecentlyAddedWines(10);

  if (recentWines.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={16} color={Colors.primary} />
        <Text style={styles.title}>Recently Added</Text>
        <Text style={styles.subtitle}>Tap to search similar</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentWines.map((item) => {
          // Extract base wine name (remove producer and year info)
          const baseWineName = item.wine.name
            .replace(/\s-\s.*$/, '') // Remove everything after " - "
            .replace(/\s\d{4}$/, ''); // Remove year at end if present

          return (
            <TouchableOpacity
              key={item.wine.id}
              style={styles.wineCard}
              onPress={() => onWineSelect(baseWineName)}
            >
              <View style={styles.wineIconContainer}>
                <WineIcon size={20} color={Colors.primary} />
              </View>
              <View style={styles.wineInfo}>
                <Text style={styles.wineName} numberOfLines={2}>
                  {baseWineName}
                </Text>
                <Text style={styles.wineDetails}>
                  {item.wine.year} • {item.wine.region}
                </Text>
                <Text style={styles.wineTime}>
                  {item.daysAgo === 0
                    ? 'Today'
                    : item.daysAgo === 1
                    ? 'Yesterday'
                    : `${item.daysAgo} days ago`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 'auto',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  wineCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    width: 200,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  wineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  wineInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  wineDetails: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 2,
  },
  wineTime: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
});
