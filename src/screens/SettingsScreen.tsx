import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../state/appStore';
import { ActionButton } from '../components/ActionButton';
import { InventoryService } from '../api';
import { InventoryItem } from '../types/types';
import Toast from 'react-native-toast-message';

export const SettingsScreen = () => {
  const { 
    isOnline, 
    setOnlineStatus, 
    supplierName, 
    setSupplierName,
    setIsLoading 
  } = useAppStore();
  
  const [tempName, setTempName] = useState(supplierName);
  const [supplierItems, setSupplierItems] = useState<InventoryItem[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setTempName(supplierName);
  }, [supplierName]);

  const handleSaveName = async () => {
    setSupplierName(tempName);
    Toast.show({
      type: 'success',
      text1: 'Saved',
      text2: `Supplier name set to ${tempName}`,
    });
  };

  const fetchSupplierItems = async () => {
    if (!supplierName) {
      Toast.show({ type: 'info', text1: 'Missing Name', text2: 'Please record a supplier name first.' });
      return;
    }
    if (!isOnline) {
      Toast.show({ type: 'error', text1: 'Offline', text2: 'Viewing supplier items requires internet.' });
      return;
    }

    setFetching(true);
    setIsLoading(true);
    try {
      const items = await InventoryService.getSupplierItems(supplierName);
      setSupplierItems(items);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setFetching(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Supplier Section</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Record Supplier's Name</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Persisted Supplier</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={tempName}
                onChangeText={setTempName}
                placeholder="e.g. Tech Corp"
              />
              <ActionButton 
                title="Save"
                onPress={handleSaveName}
                disabled={tempName === supplierName || !tempName.trim()}
                style={styles.saveBtn}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>Supplier's Items</Text>
            <ActionButton 
              title="Refresh Items" 
              variant="outline" 
              onPress={fetchSupplierItems}
              loading={fetching}
              style={{ paddingVertical: 8, paddingHorizontal: 12 }}
            />
          </View>

          {supplierItems.length > 0 ? (
            <View style={styles.listCard}>
              {supplierItems.map((item, index) => (
                <View key={item.id} style={[styles.itemRow, index === supplierItems.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemStatus}>{item.status}</Text>
                  </View>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{item.quantity} units</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {fetching ? 'Fetching items...' : 'No items found for this supplier.'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App Settings</Text>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.itemTitle}>Online Mode Simulator</Text>
              <Switch 
                value={isOnline} 
                onValueChange={setOnlineStatus}
                trackColor={{ false: '#DEE2E6', true: '#4C6EF5' }}
              />
            </View>
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
  title: {
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ADB5BD',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
  },
  saveBtn: {
    marginLeft: 12,
    height: 48,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
  },
  itemStatus: {
    fontSize: 14,
    color: '#868E96',
    marginTop: 2,
  },
  quantityBadge: {
    backgroundColor: '#E7F5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#228BE6',
  },
  emptyCard: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  emptyText: {
    color: '#ADB5BD',
    fontSize: 14,
    fontWeight: '500',
  }
});
