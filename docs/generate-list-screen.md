Generate InventoryListScreen.tsx that:
- Uses InventoryService.getAllItems()
- Integrates useAppStore (items, setItems, isOnline, isLoading)
- Caches to AsyncStorage via setItems()
- Shows offline banner when !isOnline
- Uses FlatList with RefreshControl
- Shows ActivityIndicator when loading
- Includes delete button per item (calls InventoryService.deleteItem)
- File: src/screens/InventoryListScreen.tsx