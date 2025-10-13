import React from 'react';
import Toast from './Toast';
import { useToastStore } from '@/store/toastStore';

export default function GlobalToast() {
  const { message, type, visible, hideToast } = useToastStore();
  
  return (
    <Toast
      message={message}
      type={type}
      visible={visible}
      onClose={hideToast}
      duration={3000}
    />
  );
}
