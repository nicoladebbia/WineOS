import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Platform,
  Share,
  ActivityIndicator,
  Switch
} from 'react-native';
import { useWineStore } from '@/store/wineStore';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { 
  Info, 
  Trash2, 
  AlertTriangle, 
  Wine, 
  Flag, 
  ShoppingCart,
  Download,
  HelpCircle,
  Upload,
  Save,
  CloudUpload
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SupabaseSetupModal from '@/components/SupabaseSetupModal';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';

export default function SettingsScreen() {
  const wines = useWineStore((state) => state.wines);
  const getWinesNeedingReorder = useWineStore((state) => state.getWinesNeedingReorder);
  const getOutOfStockWines = useWineStore((state) => state.getOutOfStockWines);
  const getWinesByCountry = useWineStore((state) => state.getWinesByCountry);
  const getTotalSalesInPeriod = useWineStore((state) => state.getTotalSalesInPeriod);
  const exportData = useWineStore((state) => state.exportData);
  const exportDataAsJson = useWineStore((state) => state.exportDataAsJson);
  const importDataFromJson = useWineStore((state) => state.importDataFromJson);
  const clearAllData = useWineStore((state) => state.clearAllData);
  const backupData = useWineStore((state) => state.backupData);
  const restoreData = useWineStore((state) => state.restoreData);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  
  // Use the Supabase sync hook
  const { 
    isConfigured, 
    isEnabled, 
    syncStatus, 
    lastSyncTime,
    toggleSync 
  } = useSupabaseSync();
  
  const italianWines = getWinesByCountry('Italy');
  const frenchWines = getWinesByCountry('France');
  const winesNeedingReorder = getWinesNeedingReorder();
  const outOfStockWines = getOutOfStockWines();
  
  // Calculate total bottles sold
  const totalBottlesSold = getTotalSalesInPeriod(365 * 10); // All time
  
  // Get last backup date
  useEffect(() => {
    const getLastBackupDate = async () => {
      try {
        const date = await AsyncStorage.getItem('wine-backup-date');
        setLastBackupDate(date);
      } catch (error) {
        console.error('Error getting last backup date:', error);
      }
    };
    
    getLastBackupDate();
  }, []);
  
  const confirmClearData = () => {
    Alert.alert(
      "Attenzione",
      "Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata.",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Elimina",
          onPress: handleClearAllData,
          style: "destructive"
        }
      ]
    );
  };
  
  const handleClearAllData = () => {
    clearAllData();
    setToastMessage("Tutti i dati sono stati eliminati");
    setToastType('info');
    setShowToast(true);
  };
  
  const handleExportData = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      const csvData = exportData();
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'patrizia_wine_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For mobile, use Share API
        await Share.share({
          message: csvData,
          title: 'Patrizia WineOS - Export Data'
        });
      }
      
      setToastMessage(translations.export.success);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage(translations.export.error);
      setToastType('error');
      setShowToast(true);
    }
  };
  
  const handleExportJson = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      const jsonData = exportDataAsJson();
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'patrizia_wine_data.json');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For mobile, use Share API
        await Share.share({
          message: jsonData,
          title: 'Patrizia WineOS - Export Data'
        });
      }
      
      setToastMessage(translations.export.success);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage(translations.export.error);
      setToastType('error');
      setShowToast(true);
    }
  };
  
  const handleImportJson = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      setIsLoading(true);
      
      if (Platform.OS === 'web') {
        // For web, create a file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';
        document.body.appendChild(input);
        
        input.onchange = async (e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) {
            setIsLoading(false);
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (event) => {
            const jsonData = event.target?.result as string;
            const success = importDataFromJson(jsonData);
            
            if (success) {
              setToastMessage('Dati importati con successo');
              setToastType('success');
            } else {
              setToastMessage('Errore durante l\'importazione dei dati');
              setToastType('error');
            }
            
            setShowToast(true);
            setIsLoading(false);
          };
          
          reader.readAsText(file);
          document.body.removeChild(input);
        };
        
        input.click();
      } else {
        // For mobile, use DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true
        });
        
        if (result.canceled) {
          setIsLoading(false);
          return;
        }
        
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const success = importDataFromJson(fileContent);
        
        if (success) {
          setToastMessage('Dati importati con successo');
          setToastType('success');
        } else {
          setToastMessage('Errore durante l\'importazione dei dati');
          setToastType('error');
        }
        
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      setToastMessage('Errore durante l\'importazione dei dati');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateBackup = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      setIsLoading(true);
      await backupData();
      const date = new Date().toISOString();
      setLastBackupDate(date);
      
      setToastMessage(translations.notifications.backupCreated);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error creating backup:', error);
      setToastMessage('Errore durante la creazione del backup');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestoreBackup = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      setIsLoading(true);
      const success = await restoreData();
      
      if (success) {
        setToastMessage(translations.notifications.backupRestored);
        setToastType('success');
      } else {
        setToastMessage('Nessun backup trovato');
        setToastType('warning');
      }
      
      setShowToast(true);
    } catch (error) {
      console.error('Error restoring backup:', error);
      setToastMessage('Errore durante il ripristino del backup');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSync = (value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (value && !isConfigured) {
      // If trying to enable sync but not configured, show setup modal
      setShowSupabaseModal(true);
    } else {
      // Otherwise just toggle sync state
      toggleSync(value);
    }
  };
  
  const handleSupabaseSetupComplete = () => {
    toggleSync(true);
    setToastMessage(translations.notifications.syncComplete);
    setToastType('success');
    setShowToast(true);
  };
  
  const showHelp = () => {
    Alert.alert(
      "Guida Rapida",
      "Patrizia WineOS ti aiuta a gestire il tuo inventario di vini.\n\n" +
      "• Inventario: Visualizza e filtra tutti i vini\n" +
      "• Vendite: Registra le vendite giornaliere\n" +
      "• Aggiungi: Inserisci nuovi vini nel sistema\n" +
      "• Impostazioni: Visualizza statistiche ed esporta dati\n\n" +
      "I colori indicano lo stato del riordino:\n" +
      "Verde = OK, Giallo = Attenzione, Rosso = Urgente\n\n" +
      "Puoi vendere o rifornire direttamente dalla scheda del vino.\n" +
      "Utilizza i filtri per trovare rapidamente i vini che necessitano di riordino.",
      [{ text: "Capito" }]
    );
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.statsContainer}>
        <StatCard
          title="Vini Totali"
          value={wines.length.toString()}
          icon={<Wine size={24} color={Colors.primary} />}
        />
        
        <StatCard
          title="Vini Italiani"
          value={italianWines.length.toString()}
          icon={<Flag size={24} color={Colors.primary} />}
        />
        
        <StatCard
          title="Vini Francesi"
          value={frenchWines.length.toString()}
          icon={<Flag size={24} color={Colors.primary} />}
        />
        
        <StatCard
          title="Da Riordinare"
          value={winesNeedingReorder.length.toString()}
          icon={<ShoppingCart size={24} color={Colors.primary} />}
          alert={winesNeedingReorder.length > 0}
        />
        
        <StatCard
          title="Esauriti"
          value={outOfStockWines.length.toString()}
          icon={<AlertTriangle size={24} color={Colors.primary} />}
          alert={outOfStockWines.length > 0}
        />
        
        <StatCard
          title="Bottiglie Vendute"
          value={totalBottlesSold.toString()}
          icon={<ShoppingCart size={24} color={Colors.primary} />}
          fullWidth
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sincronizzazione Cloud</Text>
        
        <View style={styles.settingItem}>
          <CloudUpload size={20} color={Colors.primary} />
          <View style={styles.syncInfo}>
            <Text style={styles.settingText}>
              {isEnabled ? translations.sync.disable : translations.sync.enable}
            </Text>
            <Text style={styles.syncStatus}>
              {translations.sync.status}: {translations.sync[syncStatus]}
              {lastSyncTime && syncStatus === 'synced' && (
                <Text>{" • "}{translations.sync.lastSync}: {new Date(lastSyncTime).toLocaleString()}</Text>
              )}
            </Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={handleToggleSync}
            trackColor={{ false: Colors.divider, true: 'rgba(125, 29, 63, 0.4)' }}
            thumbColor={isEnabled ? Colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Backup Locale</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleCreateBackup}
          disabled={isLoading}
        >
          <Save size={20} color={Colors.primary} />
          <View style={styles.syncInfo}>
            <Text style={styles.settingText}>
              {translations.actions.backup}
            </Text>
            {lastBackupDate && (
              <Text style={styles.syncStatus}>
                Ultimo backup: {new Date(lastBackupDate).toLocaleString()}
              </Text>
            )}
          </View>
          {isLoading && <ActivityIndicator size="small" color={Colors.primary} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleRestoreBackup}
          disabled={isLoading || !lastBackupDate}
        >
          <Upload size={20} color={lastBackupDate ? Colors.primary : Colors.lightText} />
          <Text style={[
            styles.settingText,
            !lastBackupDate && styles.disabledText
          ]}>
            {translations.actions.restore}
          </Text>
          {isLoading && <ActivityIndicator size="small" color={Colors.primary} />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Esportazione Dati</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleExportData}
        >
          <Download size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Esporta come CSV
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleExportJson}
        >
          <Download size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Esporta come JSON
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleImportJson}
          disabled={isLoading}
        >
          <Upload size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Importa da JSON
          </Text>
          {isLoading && <ActivityIndicator size="small" color={Colors.primary} />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestione Dati</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, styles.dangerItem]}
          onPress={confirmClearData}
        >
          <Trash2 size={20} color={Colors.danger} />
          <Text style={[styles.settingText, styles.dangerText]}>
            Elimina tutti i dati
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aiuto</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={showHelp}
        >
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Guida Rapida
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni</Text>
        
        <View style={styles.settingItem}>
          <Info size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Patrizia WineOS v1.0.0
          </Text>
        </View>
        
        <View style={styles.settingItem}>
          <AlertTriangle size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Sviluppato per Ristorante Patrizia
          </Text>
        </View>
        
        <View style={styles.settingItem}>
          <Info size={20} color={Colors.primary} />
          <Text style={styles.settingText}>
            Made and copyright by Nicola Debbia
          </Text>
        </View>
      </View>
      
      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <SupabaseSetupModal
        visible={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        onSetupComplete={handleSupabaseSetupComplete}
      />
    </ScrollView>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  alert?: boolean;
  fullWidth?: boolean;
}

function StatCard({ title, value, icon, alert = false, fullWidth = false }: StatCardProps) {
  return (
    <View style={[
      styles.statCard,
      alert && styles.alertStatCard,
      fullWidth && styles.fullWidthCard
    ]}>
      <View style={styles.statIconContainer}>
        {icon}
      </View>
      <Text style={[styles.statValue, parseInt(value) === 0 && styles.zeroStatValue]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  fullWidthCard: {
    width: '100%',
  },
  alertStatCard: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(125, 29, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  zeroStatValue: {
    color: Colors.lightText,
    opacity: 0.7,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 12,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  dangerText: {
    color: Colors.danger,
  },
  disabledText: {
    color: Colors.lightText,
  },
  syncInfo: {
    flex: 1,
  },
  syncStatus: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 2,
  },
});