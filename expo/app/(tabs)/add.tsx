import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AddModeSelector, { AddMode } from '@/components/AddModeSelector';
import QuickAddFormSimple from '@/components/QuickAddFormSimple';
import DatabaseSearchMode from '@/components/DatabaseSearchMode';
import ReorderAssistantMode from '@/components/ReorderAssistantMode';

function AddWineScreenContent() {
  const [selectedMode, setSelectedMode] = useState<AddMode>('quick');

  const renderMode = () => {
    switch (selectedMode) {
      case 'quick':
        return <QuickAddFormSimple />;
      case 'search':
        return <DatabaseSearchMode />;
      case 'reorder':
        return <ReorderAssistantMode />;
      default:
        return <QuickAddFormSimple />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeSelectorContainer}>
        <AddModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />
      </View>
      {renderMode()}
    </View>
  );
}

export default function AddWineScreen() {
  return (
    <ErrorBoundary>
      <AddWineScreenContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modeSelectorContainer: {
    padding: 16,
    paddingBottom: 0,
  },
});