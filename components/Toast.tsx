import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  visible: boolean;
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  visible 
}: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);
  
  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };
  
  if (!visible) return null;
  
  let backgroundColor;
  
  switch (type) {
    case 'success':
      backgroundColor = 'rgba(67, 160, 71, 0.9)';
      break;
    case 'error':
      backgroundColor = 'rgba(229, 57, 53, 0.9)';
      break;
    case 'warning':
      backgroundColor = 'rgba(255, 160, 0, 0.9)';
      break;
    case 'info':
      backgroundColor = 'rgba(33, 150, 243, 0.9)';
      break;
    default:
      backgroundColor = 'rgba(67, 160, 71, 0.9)';
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor, opacity: fadeAnim },
        Platform.OS === 'web' ? styles.webContainer : {}
      ]}
    >
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <X size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  webContainer: {
    maxWidth: 400,
    alignSelf: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
});