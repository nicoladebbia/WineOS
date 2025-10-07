import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Wine, PlusCircle, Settings, ShoppingCart } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.lightText,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.divider,
        },
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTitleStyle: {
          color: Colors.text,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translations.inventory,
          tabBarLabel: translations.inventory,
          tabBarIcon: ({ color, size }) => (
            <Wine size={size} color={color} />
          ),
          headerTitleAlign: 'center',
        }}
      />
      
      <Tabs.Screen
        name="sales"
        options={{
          title: translations.dailySales,
          tabBarLabel: translations.dailySales,
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart size={size} color={color} />
          ),
          headerTitleAlign: 'center',
        }}
      />
      
      <Tabs.Screen
        name="add"
        options={{
          title: translations.add,
          tabBarLabel: translations.add,
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
          headerTitleAlign: 'center',
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: translations.settings,
          tabBarLabel: translations.settings,
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}