import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

// Components & Logic
import { ItemCard } from '../components/ItemCard';
import { ActionButton } from '../components/ActionButton';
import { InventoryService } from '../api';
import { useAppStore } from '../state/appStore';
import { InventoryScreenNavigationProp } from '../types/navigation';

/**
 * InventoryScreen
 * 
 * Displays a list of all items.
 * 
 * Key React Native Concepts:
 * - SafeAreaView: Ensures content isn't hidden by notches or home bars.
 * - FlatList: Efficiently renders long lists (lazy loading).
 * - RefreshControl: "Pull to refresh" functionality.
 */
export const InventoryScreen = () => {
  // Typed Navigation
  const navigation = useNavigation<InventoryScreenNavigationProp>();
  const isFocused = useIsFocused();

  const { 
    items, 
    setItems, 
    isOnline, 
    setIsLoading, 
    setError, 
  } = useAppStore();
  
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches items from the server.
   * Logic:
   * 1. If we have data and aren't forcing a refresh -> Skip (Use Cache).
   * 2. If Offline -> Show error if forced, otherwise just show cache.
   * 3. Fetch -> Update Global Store.
   */
  const fetchItems = useCallback(async (force = false) => {
    // Optimization: Don't fetch if we already have items (unless forced)
    // This satisfies the requirement: "Upon successful retrieval, additional server calls should not be performed."
    if (!force && items.length > 0) {
      console.log('Using cached items.');
      return;
    }

    if (!isOnline && force) {
      Toast.show({
        type: 'error',
        text1: 'Offline',
        text2: 'Cannot refresh while offline.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await InventoryService.getAllItems();
      setItems(data);
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch items';
      console.error('Fetch error:', msg);
      setError(msg);
      
      Toast.show({
        type: 'error',
        text1: 'Fetch Error',
        text2: msg,
      });
    } finally {
      setIsLoading(false);
    }
  }, [items.length, isOnline, setItems, setIsLoading, setError]);

  // Auto-fetch when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchItems();
    }
  }, [isFocused]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems(true);
    setRefreshing(false);
  };

  // Render logic for empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {!isOnline && items.length === 0 ? (
        <>
          <Ionicons name="cloud-offline-outline" size={64} color="#ADB5BD" />
          <Text style={styles.emptyText}>You are offline and no data is cached.</Text>
          <ActionButton 
            title="Retry" 
            onPress={() => fetchItems(true)} 
            style={{ marginTop: 20 }}
            variant="primary"
          />
        </>
      ) : (
        <>
          <Ionicons name="cube-outline" size={64} color="#ADB5BD" />
          <Text style={styles.emptyText}>No items found in inventory.</Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Warehouse</Text>
          <Text style={styles.headerSubtitle}>Inventory Management</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard 
            item={item} 
            // Navigate to Detail Screen passing the item object
            onPress={() => navigation.navigate('ItemDetail', { item })} 
          />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#4C6EF5']} // Android loading color
            tintColor="#4C6EF5"  // iOS loading color
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800', // Extra Bold
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#868E96',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4C6EF5',
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height makes it a circle
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#4C6EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 4,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1, // Ensures empty state can center vertically
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#868E96',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
});