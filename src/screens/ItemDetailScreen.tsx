import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InventoryItem } from '../types/types';
import { ActionButton } from '../components/ActionButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { InventoryService } from '../api';
import { useAppStore } from '../state/appStore';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  ItemDetail: { item: InventoryItem };
};

export const ItemDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemDetail'>>();
  const { isOnline, setIsLoading, removeItem } = useAppStore();
  const [item, setItem] = useState<InventoryItem>(route.params.item);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Requirement C: Fetch data from server each time
  useEffect(() => {
    const fetchFreshData = async () => {
      if (!isOnline) return;
      
      setFetching(true);
      try {
        const freshItem = await InventoryService.getItemById(item.id);
        setItem(freshItem);
      } catch (error) {
        console.error('Failed to fetch fresh item details:', error);
        // Requirement: display error message
        Toast.show({
          type: 'error',
          text1: 'Sync Error',
          text2: 'Could not fetch latest details from server.',
        });
      } finally {
        setFetching(false);
      }
    };

    fetchFreshData();
  }, [item.id, isOnline]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return { bg: '#E3F9E5', text: '#1D753C' };
      case 'reserved': return { bg: '#FFF4E6', text: '#D9480F' };
      case 'out of stock': return { bg: '#FFEBE9', text: '#D14343' };
      default: return { bg: '#F1F3F5', text: '#495057' };
    }
  };

  const handleDelete = () => {
    if (!isOnline) {
      Toast.show({ type: 'error', text1: 'Offline', text2: 'Cannot delete items while offline.' });
      return;
    }

    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setIsLoading(true);
            try {
              await InventoryService.deleteItem(item.id);
              removeItem(item.id);
              Toast.show({ type: 'success', text1: 'Item deleted successfully' });
              navigation.goBack();
            } catch (error: any) {
              Toast.show({ type: 'error', text1: 'Delete failed', text2: error.message });
            } finally {
              setLoading(false);
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const colors = getStatusColor(item.status);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4C6EF5" />
        </Pressable>
        <Text style={styles.headerTitle}>Item Details</Text>
        {fetching && <ActivityIndicator size="small" color="#4C6EF5" style={{ marginLeft: 10 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Inventory Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value}>#{item.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>{item.quantity} units</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>{item.weight} kg</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Supplier</Text>
            <Text style={styles.value}>{item.supplier}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Danger Zone</Text>
          <ActionButton 
            title="Delete Item" 
            variant="danger" 
            onPress={handleDelete} 
            loading={loading}
            style={styles.actionBtn} 
          />
        </View>
      </ScrollView>

      {!isOnline && (
        <View style={styles.offlineWarning}>
          <Text style={styles.offlineText}>Viewing cached data. Connect to internet for latest updates.</Text>
          <TouchableOpacity 
            onPress={() => useAppStore.getState().setOnlineStatus(true)}
            style={styles.retryInlineBtn}
          >
            <Text style={styles.retryInlineText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  content: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
    marginTop: 12,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: '#868E96',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ADB5BD',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  label: {
    fontSize: 16,
    color: '#495057',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  actionBtn: {
    marginTop: 8,
  },
  offlineWarning: {
    backgroundColor: '#FFF4E6',
    padding: 12,
    alignItems: 'center',
  },
  offlineText: {
    color: '#D9480F',
    fontSize: 12,
    fontWeight: '600',
  },
  retryInlineBtn: {
    marginLeft: 10,
    backgroundColor: '#D9480F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryInlineText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  }
});
