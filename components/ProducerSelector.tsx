import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { X, Search, Building2, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { WineTemplate } from '@/types/wineDatabase';

interface ProducerSelectorProps {
  visible: boolean;
  wine: WineTemplate | null;
  onClose: () => void;
  onSelectProducer: (producer: string) => void;
}

export default function ProducerSelector({
  visible,
  wine,
  onClose,
  onSelectProducer,
}: ProducerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customProducer, setCustomProducer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!wine) return null;

  const filteredProducers = wine.producers.filter(producer =>
    producer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProducer = (producer: string) => {
    onSelectProducer(producer);
    setSearchQuery('');
    setCustomProducer('');
    setShowCustomInput(false);
    onClose();
  };

  const handleCustomProducer = () => {
    if (customProducer.trim()) {
      handleSelectProducer(customProducer.trim());
    }
  };

  const renderProducerItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.producerItem}
      onPress={() => handleSelectProducer(item)}
    >
      <View style={styles.producerIconContainer}>
        <Building2 size={20} color={Colors.primary} />
      </View>
      <Text style={styles.producerName}>{item}</Text>
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
          <View style={styles.headerContent}>
            <Text style={styles.title}>Select Producer</Text>
            <Text style={styles.subtitle}>{wine.name}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.lightText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search producers..."
            placeholderTextColor={Colors.lightText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Custom Producer Option */}
        {!showCustomInput ? (
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowCustomInput(true)}
          >
            <Plus size={20} color={Colors.primary} />
            <Text style={styles.customButtonText}>Enter Custom Producer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder="Enter producer name..."
              placeholderTextColor={Colors.lightText}
              value={customProducer}
              onChangeText={setCustomProducer}
              autoFocus
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={[
                styles.customSubmitButton,
                !customProducer.trim() && styles.customSubmitButtonDisabled,
              ]}
              onPress={handleCustomProducer}
              disabled={!customProducer.trim()}
            >
              <Text style={styles.customSubmitButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customCancelButton}
              onPress={() => {
                setShowCustomInput(false);
                setCustomProducer('');
              }}
            >
              <X size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </View>
        )}

        {/* Producers List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {filteredProducers.length} producer{filteredProducers.length !== 1 ? 's' : ''}
          </Text>
          <FlatList
            data={filteredProducers}
            renderItem={renderProducerItem}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Building2 size={48} color={Colors.lightText} />
                <Text style={styles.emptyText}>No producers found</Text>
                <Text style={styles.emptySubtext}>
                  Try a different search or add a custom producer
                </Text>
              </View>
            }
          />
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
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
    marginTop: 4,
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
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  customSubmitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  customSubmitButtonDisabled: {
    opacity: 0.5,
  },
  customSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  customCancelButton: {
    padding: 12,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lightText,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  producerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  producerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  producerName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
