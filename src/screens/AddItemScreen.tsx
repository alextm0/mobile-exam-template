import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { InventoryService } from '../api';
import { useAppStore } from '../state/appStore';
import { ActionButton } from '../components/ActionButton';
import Toast from 'react-native-toast-message';

export const AddItemScreen = () => {
  const navigation = useNavigation();
  const { isOnline, setIsLoading, addItem } = useAppStore();
  
  const [form, setForm] = useState({
    name: '',
    status: 'available',
    quantity: '',
    category: '',
    supplier: '',
    weight: '',
  });

  const handleSave = async () => {
    const { name, status, quantity, category, supplier, weight } = form;
    
    if (!name || !quantity || !category || !supplier || !weight) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all details',
      });
      return;
    }

    const itemData = {
      name,
      status,
      quantity: parseInt(quantity),
      category,
      supplier,
      weight: parseFloat(weight),
    };

    setIsLoading(true);
    try {
      if (!isOnline) {
        // Requirement: Available online and offline.
        // If offline, we queue it for later sync.
        useAppStore.getState().addToOfflineQueue(itemData);
        
        // Optimistically add to local items so it shows up
        // We give it a temporary negative ID or similar
        addItem({ ...itemData, id: Date.now() * -1 });

        Toast.show({
          type: 'info',
          text1: 'Offline Mode',
          text2: 'Item saved locally and will sync when online.',
        });
        navigation.goBack();
        return;
      }
      
      const newItem = await InventoryService.addItem(itemData);
      addItem(newItem);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Item recorded successfully',
      });
      navigation.goBack();
    } catch (error: any) {
      console.error('Add item error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to record item',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Item</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Laptop"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Electronics"
            value={form.category}
            onChangeText={(text) => setForm({ ...form, category: text })}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={form.quantity}
              onChangeText={(text) => setForm({ ...form, quantity: text })}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.0"
              keyboardType="numeric"
              value={form.weight}
              onChangeText={(text) => setForm({ ...form, weight: text })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Supplier</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Tech Corp"
            value={form.supplier}
            onChangeText={(text) => setForm({ ...form, supplier: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. available"
            value={form.status}
            onChangeText={(text) => setForm({ ...form, status: text })}
          />
        </View>

        <ActionButton 
          title="Save Item" 
          onPress={handleSave}
          style={{ marginTop: 20 }}
          variant="primary"
        />
        
        <ActionButton 
          title="Cancel" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12 }}
          variant="secondary"
        />
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212529',
  },
  row: {
    flexDirection: 'row',
  }
});
