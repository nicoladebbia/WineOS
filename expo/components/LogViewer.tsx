import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { logger } from '@/utils/logger';
import Colors from '@/constants/colors';
import { FileText, Download, Trash2, X, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface LogStats {
  total: number;
  byLevel: {
    debug: number;
    info: number;
    success: number;
    warn: number;
    error: number;
  };
  lastUpdated: string | null;
}

export default function LogViewer() {
  const [stats, setStats] = useState<LogStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const logStats = await logger.getLogStats();
      setStats(logStats);
    } catch (error) {
      logger.error('Failed to load log stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportLogs = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
        // Silently fail if haptics not available
      });
    }

    try {
      setIsExporting(true);
      const logsText = await logger.exportLogsAsText();

      if (!logsText || logsText.length === 0) {
        throw new Error('No logs to export');
      }

      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([logsText], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `wineos-logs-${new Date().toISOString().split('T')[0]}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // For mobile, use Share API
        const result = await Share.share({
          message: logsText,
          title: 'WineOS App Logs',
        });
        
        if (result.action === Share.sharedAction) {
          logger.info('Logs shared successfully');
        }
      }

      logger.info('Logs exported successfully');
    } catch (error) {
      logger.error('Failed to export logs', error);
      Alert.alert(
        'Export Failed',
        'Failed to export logs. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
        // Silently fail if haptics not available
      });
    }

    try {
      setIsExporting(true);
      const logsJson = await logger.exportLogsAsJson();

      if (!logsJson || logsJson.length === 0) {
        throw new Error('No logs to export');
      }

      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([logsJson], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `wineos-logs-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // For mobile, use Share API
        const result = await Share.share({
          message: logsJson,
          title: 'WineOS App Logs (JSON)',
        });
        
        if (result.action === Share.sharedAction) {
          logger.info('Logs shared as JSON successfully');
        }
      }

      logger.info('Logs exported as JSON successfully');
    } catch (error) {
      logger.error('Failed to export logs as JSON', error);
      Alert.alert(
        'Export Failed',
        'Failed to export logs. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
        // Silently fail if haptics not available
      });
    }

    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all logs? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await logger.clearLogs();
              await loadStats();
              Alert.alert('Success', 'Logs cleared successfully', [{ text: 'OK' }]);
            } catch (error) {
              logger.error('Failed to clear logs', error);
              Alert.alert(
                'Error',
                'Failed to clear logs. Please try again or restart the app.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const getLevelIcon = (level: string, count: number) => {
    const size = 16;
    const color = count > 0 ? getLevelColor(level) : Colors.lightText;

    switch (level) {
      case 'error':
        return <AlertCircle size={size} color={color} />;
      case 'warn':
        return <AlertTriangle size={size} color={color} />;
      case 'info':
        return <Info size={size} color={color} />;
      case 'success':
        return <CheckCircle size={size} color={color} />;
      default:
        return <FileText size={size} color={color} />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return Colors.danger;
      case 'warn':
        return Colors.warning;
      case 'success':
        return Colors.success;
      case 'info':
        return Colors.primary;
      default:
        return Colors.lightText;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText size={24} color={Colors.primary} />
        <Text style={styles.title}>App Logs</Text>
      </View>

      {stats && (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Logs:</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>

            {stats.lastUpdated && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Last Updated:</Text>
                <Text style={styles.statValueSmall}>
                  {new Date(stats.lastUpdated).toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.levelsContainer}>
            <Text style={styles.sectionTitle}>Logs by Level</Text>

            {Object.entries(stats.byLevel).map(([level, count]) => (
              <View key={level} style={styles.levelRow}>
                <View style={styles.levelLeft}>
                  {getLevelIcon(level, count)}
                  <Text style={[styles.levelName, { color: getLevelColor(level) }]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </View>
                <Text style={[styles.levelCount, count === 0 && styles.zeroCount]}>
                  {count}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExportLogs}
              disabled={isExporting || stats.total === 0}
            >
              <Download size={20} color={stats.total > 0 ? Colors.primary : Colors.lightText} />
              <Text
                style={[
                  styles.actionButtonText,
                  (isExporting || stats.total === 0) && styles.disabledText,
                ]}
              >
                Export as Text
              </Text>
              {isExporting && <ActivityIndicator size="small" color={Colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExportJson}
              disabled={isExporting || stats.total === 0}
            >
              <Download size={20} color={stats.total > 0 ? Colors.primary : Colors.lightText} />
              <Text
                style={[
                  styles.actionButtonText,
                  (isExporting || stats.total === 0) && styles.disabledText,
                ]}
              >
                Export as JSON
              </Text>
              {isExporting && <ActivityIndicator size="small" color={Colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleClearLogs}
              disabled={stats.total === 0}
            >
              <Trash2 size={20} color={stats.total > 0 ? Colors.danger : Colors.lightText} />
              <Text
                style={[
                  styles.actionButtonText,
                  styles.dangerText,
                  stats.total === 0 && styles.disabledText,
                ]}
              >
                Clear All Logs
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Info size={16} color={Colors.lightText} />
            <Text style={styles.infoText}>
              Logs are automatically saved and limited to the last 500 entries. Export logs to
              share with support if you experience issues.
            </Text>
          </View>
        </>
      )}
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
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.lightText,
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
  statsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  statValueSmall: {
    fontSize: 12,
    color: Colors.text,
  },
  levelsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 6,
    marginBottom: 6,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelName: {
    fontSize: 14,
    fontWeight: '500',
  },
  levelCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  zeroCount: {
    color: Colors.lightText,
    opacity: 0.7,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    marginBottom: 8,
    gap: 12,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  dangerText: {
    color: Colors.danger,
  },
  disabledText: {
    color: Colors.lightText,
    opacity: 0.5,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(125, 29, 63, 0.05)',
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.lightText,
    lineHeight: 18,
  },
});
