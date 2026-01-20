import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppStore } from '../state/appStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OfflineBanner: React.FC = () => {
  const isOnline = useAppStore((state) => state.isOnline);
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
        <Text style={styles.text}>You are currently offline. Some features may be limited.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF4136',
    width: '100%',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
