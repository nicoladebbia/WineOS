import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Platform,
  ActivityIndicator
} from 'react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { CloudUpload, X, Key, Database } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { initializeSupabase } from '@/services/supabaseService';

interface SupabaseSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSetupComplete: () => void;
}

export default function SupabaseSetupModal({ 
  visible, 
  onClose,
  onSetupComplete
}: SupabaseSetupModalProps) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!supabaseUrl || !supabaseKey) {
      setError('Entrambi i campi sono obbligatori');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize Supabase with provided credentials
      const success = await initializeSupabase(supabaseUrl, supabaseKey);
      
      if (success) {
        onSetupComplete();
        onClose();
      } else {
        setError('Errore durante la configurazione di Supabase');
      }
    } catch (error) {
      console.error('Error setting up Supabase:', error);
      setError('Errore durante la configurazione di Supabase');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setSupabaseUrl('');
    setSupabaseKey('');
    setError(null);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configura Supabase</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>
            Inserisci le credenziali Supabase per abilitare la sincronizzazione cloud tra dispositivi.
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>URL Supabase</Text>
            <View style={styles.inputContainer}>
              <Database size={18} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={supabaseUrl}
                onChangeText={setSupabaseUrl}
                placeholder="https://your-project.supabase.co"
                placeholderTextColor={Colors.lightText}
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>API Key</Text>
            <View style={styles.inputContainer}>
              <Key size={18} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={supabaseKey}
                onChangeText={setSupabaseKey}
                placeholder="your-supabase-anon-key"
                placeholderTextColor={Colors.lightText}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.secondary} />
            ) : (
              <>
                <CloudUpload size={20} color={Colors.secondary} />
                <Text style={styles.submitButtonText}>Configura Supabase</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            Puoi trovare queste informazioni nella dashboard del tuo progetto Supabase, nella sezione "Settings" &gt; "API".
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    width: Platform.OS === 'web' ? 500 : '100%',
    maxWidth: 500,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: 16,
    textAlign: 'center',
  },
});