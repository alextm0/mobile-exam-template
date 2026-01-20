import { InventoryItem } from './types';

/**
 * Navigation Types
 * 
 * This file defines the parameters expected by each screen in the app.
 * Using TypeScript for navigation prevents bugs where we pass the wrong data
 * or mistype screen names.
 */

// 1. Define params for the "Stack" (The card-style navigation)
export type RootStackParamList = {
  InventoryList: undefined; // No parameters needed to go to list
  ItemDetail: { item: InventoryItem }; // We MUST pass an 'item' to go here
  AddItem: undefined;
};

// 2. Define params for the "Tab" (The bottom bar navigation)
export type RootTabParamList = {
  Inventory: undefined;
  Reports: undefined;
  Settings: undefined;
};

// Helper types for use in components
// Usage: const navigation = useNavigation<InventoryScreenNavigationProp>();
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type InventoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InventoryList'>;
export type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;
