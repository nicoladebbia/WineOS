import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wine } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  title = translations.emptyState.title,
  description = translations.emptyState.description
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Wine size={48} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    maxWidth: 300,
  },
});