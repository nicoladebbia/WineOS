import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { X, Search, Wine as WineIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { searchWines, getPopularWines } from '@/services/wineSearchService';
import { WineTemplate } from '@/types/wineDatabase';

interface WineSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectWine: (wine: WineTemplate) => void;
}

export default function WineSearchModal({
  visible,
  onClose,
  onSelectWine,
}: WineSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WineTemplate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPopular, setShowPopular] = useState(true);

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setSearchQuery('');
      setSearchResults([]);
      setShowPopular(true);
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      setShowPopular(false);
      
      // Debounce search
      const timer = setTimeout(() => {
        const results = searchWines(searchQuery);
        setSearchResults(results.map(r => r.wine));
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowPopular(true);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const popularWines = getPopularWines();

  const handleSelectWine = (wine: WineTemplate) => {
    onSelectWine(wine);
    onClose();
  };

  const renderWineItem = ({ item }: { item: WineTemplate }) => (
    <TouchableOpacity
      style={styles.wineItem}
      onPress={() => handleSelectWine(item)}
    >
      <View style={styles.wineIconContainer}>
        <WineIcon size={24} color={Colors.primary} />
      </View>
      <View style={styles.wineInfo}>
        <Text style={styles.wineName}>{item.name}</Text>
        <Text style={styles.wineDetails}>
          {item.region}, {item.country} • {item.type}
        </Text>
        <Text style={styles.wineProducers}>
          {item.producers.length} producer{item.producers.length !== 1 ? 's' : ''} available
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search Wine</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.lightText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, region, or producer..."
            placeholderTextColor={Colors.lightText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : showPopular ? (
            <>
              <Text style={styles.sectionTitle}>Popular Italian Wines</Text>
              <FlatList
                data={popularWines}
                renderItem={renderWineItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
              />
            </>
          ) : searchResults.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </Text>
              <FlatList
                data={searchResults}
                renderItem={renderWineItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <WineIcon size={48} color={Colors.lightText} />
              <Text style={styles.emptyText}>No wines found</Text>
              <Text style={styles.emptySubtext}>
                Try searching for "Brunello", "Barolo", or "Chianti"
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lightText,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  wineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  wineInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  wineDetails: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 2,
  },
  wineProducers: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.lightText,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 8,
    textAlign: 'center',
  },
});
