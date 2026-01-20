import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { InventoryItem } from '../types/types';

interface ItemCardProps {
  item: InventoryItem;
  onPress?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return { bg: '#E3F9E5', text: '#1D753C' };
      case 'reserved': return { bg: '#FFF4E6', text: '#D9480F' };
      case 'out of stock': return { bg: '#FFEBE9', text: '#D14343' };
      default: return { bg: '#F1F3F5', text: '#495057' };
    }
  };

  const colors = getStatusColor(item.status);

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.content,
          pressed && styles.pressed
        ]}
        onPress={onPress}
      >
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.id}>#{item.id}</Text>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.weight}>{item.weight} kg</Text>
          </View>
          
          <Text style={styles.category}>{item.category} • {item.supplier}</Text>
          
          <View style={styles.footer}>
            <View style={[styles.badge, { backgroundColor: colors.bg }]}>
              <Text style={[styles.badgeText, { color: colors.text }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.quantity}>Qty: {item.quantity}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: '#F8F9FA',
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  id: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4C6EF5',
    marginRight: 6,
    backgroundColor: '#EDF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
    marginRight: 8,
  },
  weight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ADB5BD',
  },
  category: {
    fontSize: 14,
    color: '#868E96',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
});
