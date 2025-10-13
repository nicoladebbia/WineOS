import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { X, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { WineTemplate } from '@/types/wineDatabase';

interface YearInputProps {
  visible: boolean;
  wine: WineTemplate | null;
  producer: string;
  onClose: () => void;
  onSelectYear: (year: number) => void;
}

export default function YearInput({
  visible,
  wine,
  producer,
  onClose,
  onSelectYear,
}: YearInputProps) {
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  const handleSubmit = () => {
    const yearNum = parseInt(year);
    
    if (!year || isNaN(yearNum)) {
      setError('Please enter a valid year');
      return;
    }
    
    if (yearNum < 1900 || yearNum > currentYear + 1) {
      setError(`Year must be between 1900 and ${currentYear + 1}`);
      return;
    }
    
    if (wine && wine.minVintage && yearNum < wine.minVintage) {
      setError(`${wine.name} was first produced in ${wine.minVintage}`);
      return;
    }
    
    onSelectYear(yearNum);
    setYear('');
    setError('');
    onClose();
  };

  const quickYears = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 5,
  ];

  const handleQuickYear = (selectedYear: number) => {
    setYear(selectedYear.toString());
    setError('');
  };

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
            <Text style={styles.title}>Enter Vintage Year</Text>
            {wine && (
              <Text style={styles.subtitle}>
                {wine.name} - {producer}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Year Input */}
          <View style={styles.inputContainer}>
            <Calendar size={20} color={Colors.primary} style={styles.icon} />
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter year (e.g., 2015)"
              placeholderTextColor={Colors.lightText}
              value={year}
              onChangeText={(text) => {
                setYear(text);
                setError('');
              }}
              keyboardType="numeric"
              maxLength={4}
              autoFocus
              inputAccessoryViewID="yearInputAccessory"
            />
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Quick Select Years */}
          <View style={styles.quickSelectContainer}>
            <Text style={styles.quickSelectTitle}>Quick Select:</Text>
            <View style={styles.quickYearsRow}>
              {quickYears.map((quickYear) => (
                <TouchableOpacity
                  key={quickYear}
                  style={[
                    styles.quickYearButton,
                    year === quickYear.toString() && styles.quickYearButtonSelected,
                  ]}
                  onPress={() => handleQuickYear(quickYear)}
                >
                  <Text
                    style={[
                      styles.quickYearText,
                      year === quickYear.toString() && styles.quickYearTextSelected,
                    ]}
                  >
                    {quickYear}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info */}
          {wine && wine.minVintage && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                First vintage: {wine.minVintage}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              !year && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!year}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    paddingVertical: 16,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  quickSelectContainer: {
    marginTop: 32,
  },
  quickSelectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  quickYearsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickYearButton: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  quickYearButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickYearText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  quickYearTextSelected: {
    color: Colors.secondary,
  },
  infoContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
