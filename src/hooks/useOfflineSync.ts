import { useEffect, useRef } from 'react';
import { useAppStore } from '../state/appStore';
import { InventoryService } from '../api/service';
import Toast from 'react-native-toast-message';

export function useOfflineSync() {
  const isOnline = useAppStore((state) => state.isOnline);
  const offlineQueue = useAppStore((state) => state.offlineQueue);
  const clearOfflineQueue = useAppStore((state) => state.clearOfflineQueue);
  const setItems = useAppStore((state) => state.setItems);
  
  const isSyncing = useRef(false);

  useEffect(() => {
    const syncItems = async () => {
      if (isOnline && offlineQueue.length > 0 && !isSyncing.current) {
        isSyncing.current = true;
        console.log(`🔄 Syncing ${offlineQueue.length} offline items...`);
        
        try {
          // Process queue one by one
          for (const item of offlineQueue) {
            await InventoryService.addItem(item);
          }
          
          // Clear queue after successful sync
          clearOfflineQueue();
          
          // Refresh list from server to get real IDs and avoid duplicates
          const freshItems = await InventoryService.getAllItems();
          setItems(freshItems);

          Toast.show({
            type: 'success',
            text1: 'Sync Complete',
            text2: `Successfully synced ${offlineQueue.length} items.`,
          });
        } catch (error) {
          console.error('❌ Sync failed:', error);
          Toast.show({
            type: 'error',
            text1: 'Sync Error',
            text2: 'Failed to sync some offline items. Will retry later.',
          });
        } finally {
          isSyncing.current = false;
        }
      }
    };

    syncItems();
  }, [isOnline, offlineQueue.length]); // Re-run when online status or queue changes
}
