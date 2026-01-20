import { create } from 'zustand';
import { loadJSON, saveJSON } from '../lib/storage';
import { InventoryItem } from '../types/types';

interface AppState {
  // Connectivity
  isOnline: boolean;
  setOnlineStatus: (online: boolean) => void;

  // Inventory Data
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (id: number) => void;

  // Supplier / Settings
  supplierName: string;
  setSupplierName: (name: string) => void;

  // Notifications
  lastNotification: string | null;
  setLastNotification: (msg: string | null) => void;

  // Offline Operations
  offlineQueue: Omit<InventoryItem, 'id'>[];
  addToOfflineQueue: (item: Omit<InventoryItem, 'id'>) => void;
  clearOfflineQueue: () => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const STORAGE_KEYS = {
  SUPPLIER_NAME: 'exam_supplier_name',
  ITEMS: 'exam_items_cache',
  OFFLINE_QUEUE: 'exam_offline_queue',
};

export const useAppStore = create<AppState>((set) => ({
  isOnline: true,
  setOnlineStatus: (online) => set({ isOnline: online }),

  items: [],
  setItems: (items) => {
    set({ items });
    saveJSON(STORAGE_KEYS.ITEMS, items).catch(err => console.error('Failed to cache items', err));
  },
  addItem: (item) => set((state) => {
    const newItems = [...state.items, item];
    saveJSON(STORAGE_KEYS.ITEMS, newItems).catch(err => console.error('Failed to cache items', err));
    return { items: newItems };
  }),
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter(i => i.id !== id);
    saveJSON(STORAGE_KEYS.ITEMS, newItems).catch(err => console.error('Failed to cache items', err));
    return { items: newItems };
  }),

  supplierName: '',
  setSupplierName: (name) => {
    set({ supplierName: name });
    saveJSON(STORAGE_KEYS.SUPPLIER_NAME, name).catch(err => console.error('Failed to save supplier name', err));
  },

  lastNotification: null,
  setLastNotification: (msg) => set({ lastNotification: msg }),

  offlineQueue: [],
  addToOfflineQueue: (item) => set((state) => {
    const newQueue = [...state.offlineQueue, item];
    saveJSON(STORAGE_KEYS.OFFLINE_QUEUE, newQueue).catch(err => console.error('Failed to save offline queue', err));
    return { offlineQueue: newQueue };
  }),
  clearOfflineQueue: () => set(() => {
    saveJSON(STORAGE_KEYS.OFFLINE_QUEUE, []).catch(err => console.error('Failed to clear offline queue', err));
    return { offlineQueue: [] };
  }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
}));

/**
 * Hydrate the store from persistent storage
 */
export async function hydrateAppStore() {
  const [savedSupplierName, savedItems, savedQueue] = await Promise.all([
    loadJSON<string>(STORAGE_KEYS.SUPPLIER_NAME),
    loadJSON<InventoryItem[]>(STORAGE_KEYS.ITEMS),
    loadJSON<Omit<InventoryItem, 'id'>[]>(STORAGE_KEYS.OFFLINE_QUEUE),
  ]);

  if (savedSupplierName) {
    useAppStore.getState().setSupplierName(savedSupplierName);
  }
  if (savedItems) {
    useAppStore.getState().setItems(savedItems);
  }
  if (savedQueue) {
    useAppStore.setState({ offlineQueue: savedQueue });
  }
}
