import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InventoryService } from '../api';
import { InventoryItem } from '../types/types';
import { useAppStore } from '../state/appStore';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export const ReportsScreen = () => {
  const isFocused = useIsFocused();
  const { isOnline, setIsLoading } = useAppStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryItems, setCategoryItems] = useState<InventoryItem[]>([]);
  const [heaviestItems, setHeaviestItems] = useState<InventoryItem[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    if (!isOnline) return;
    
    setLoading(true);
    // setIsLoading(true); // Don't block screen logic, just show subset loading
    try {
      // Fetch Categories
      const cats = await InventoryService.getCategories();
      setCategories(cats);

      // Fetch all items for reports C and D
      const allItems = await InventoryService.getAllItemsForReports();
      
      // Top 10 Heaviest
      const heaviest = [...allItems]
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 10);
      setHeaviestItems(heaviest);

      // Top 5 Suppliers
      const supplierCounts: Record<string, number> = {};
      allItems.forEach(item => {
        supplierCounts[item.supplier] = (supplierCounts[item.supplier] || 0) + 1;
      });
      const suppliers = Object.entries(supplierCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopSuppliers(suppliers);

      // Refresh selected category if one is active
      if (selectedCategory) {
        const items = await InventoryService.getItemsByCategory(selectedCategory);
        setCategoryItems(items);
      }

    } catch (error: any) {
      console.error('Report fetch error:', error);
      Toast.show({ type: 'error', text1: 'Report Error', text2: error.message });
    } finally {
      setLoading(false);
      // setIsLoading(false);
    }
  }, [isOnline, selectedCategory]);

  useEffect(() => {
    if (isFocused) {
      fetchReports();
    }
  }, [isFocused]);

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const items = await InventoryService.getItemsByCategory(category);
      setCategoryItems(items);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOnline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={64} color="#ADB5BD" />
          <Text style={styles.offlineTitle}>Reports Unavailable</Text>
          <Text style={styles.offlineText}>Reports are only available when online.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchReports}>
            <Text style={styles.retryBtnText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Section A & B: Categories & Items by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedCategory && (
            <View style={styles.categoryResults}>
              <Text style={styles.resultsTitle}>Items in {selectedCategory}</Text>
              {categoryItems.map(item => (
                <View key={item.id} style={styles.resultRow}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemStatus}>{item.status}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section C: Top 10 Heaviest */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 10 Heaviest Items</Text>
          <View style={styles.reportCard}>
            {heaviestItems.map((item, index) => (
              <View key={item.id} style={styles.reportRow}>
                <View style={styles.reportIndex}>
                  <Text style={styles.indexText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemSub}>{item.category} • {item.status}</Text>
                </View>
                <Text style={styles.weightValue}>{item.weight} kg</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section D: Top 5 Suppliers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 5 Suppliers</Text>
          <View style={styles.reportCard}>
            {topSuppliers.map((sup, index) => (
              <View key={sup.name} style={styles.reportRow}>
                <View style={[styles.reportIndex, { backgroundColor: '#F1F3F5' }]}>
                  <Text style={[styles.indexText, { color: '#495057' }]}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{sup.name}</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{sup.count} items</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 16,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  categoryBadgeActive: {
    backgroundColor: '#4C6EF5',
    borderColor: '#4C6EF5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  categoryResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ADB5BD',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  itemStatus: {
    fontSize: 14,
    color: '#868E96',
  },
  itemSub: {
    fontSize: 12,
    color: '#868E96',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  reportIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E7F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  indexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#228BE6',
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4C6EF5',
  },
  countBadge: {
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#495057',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
    marginTop: 20,
  },
  offlineText: {
    fontSize: 16,
    color: '#868E96',
    textAlign: 'center',
    marginTop: 10,
  },
  retryBtn: {
    marginTop: 30,
    backgroundColor: '#4C6EF5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  }
});
