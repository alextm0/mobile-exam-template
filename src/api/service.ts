import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { InventoryItem } from '../types/types';

export const InventoryService = {
  /**
   * Fetch all inventory items
   */
  getAllItems: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get<InventoryItem[]>(ENDPOINTS.ITEMS);
    return response.data;
  },

  /**
   * Fetch a single item by its ID
   */
  getItemById: async (id: number | string): Promise<InventoryItem> => {
    const response = await apiClient.get<InventoryItem>(ENDPOINTS.ITEM_DETAIL(id));
    return response.data;
  },

  /**
   * Add a new item to the inventory
   */
  addItem: async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
    const response = await apiClient.post<InventoryItem>(ENDPOINTS.ADD_ITEM, item);
    return response.data;
  },

  /**
   * Delete an item by its ID
   */
  deleteItem: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.DELETE_ITEM(id));
  },

  /**
   * Fetch items filter by category
   */
  getItemsByCategory: async (category: string): Promise<InventoryItem[]> => {
    const response = await apiClient.get<InventoryItem[]>(ENDPOINTS.BY_CATEGORY(category));
    return response.data;
  },

  /**
   * Fetch items for a specific supplier
   */
  getSupplierItems: async (supplier: string): Promise<InventoryItem[]> => {
    const response = await apiClient.get<InventoryItem[]>(ENDPOINTS.SUPPLIER_ITEMS(supplier));
    return response.data;
  },

  /**
   * Fetch all items (used for reports)
   */
  getAllItemsForReports: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get<InventoryItem[]>(ENDPOINTS.ALL_ITEMS);
    return response.data;
  },

  /**
   * Fetch all unique categories
   */
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>(ENDPOINTS.CATEGORIES);
    return response.data;
  },

  /**
   * Update an existing item
   */
  updateItem: async (id: number | string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await apiClient.put<InventoryItem>(ENDPOINTS.UPDATE_ITEM(id), item);
    return response.data;
  },
};
