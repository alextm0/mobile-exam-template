import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import { 
  InventoryScreen, 
  ReportsScreen, 
  SettingsScreen, 
  ItemDetailScreen, 
  AddItemScreen 
} from './src/screens';

// Components
import { OfflineBanner } from './src/components/OfflineBanner';
import { LoadingOverlay } from './src/components/LoadingOverlay';
import { GlobalStatusModal } from './src/components/GlobalStatusModal';

// State & Logic
import { hydrateAppStore, useAppStore } from './src/state/appStore';
import { useWebSocket } from './src/hooks/useWebSocket';
import { useOfflineSync } from './src/hooks/useOfflineSync';
import { RootStackParamList, RootTabParamList } from './src/types/navigation';

/**
 * React Navigation Setup
 * 
 * - TabNavigator: The bottom bar (Inventory, Reports, Settings).
 * - StackNavigator: The "card" transitions (List -> Detail).
 * 
 * We nest the Stack (InventoryStack) INSIDE the Tab (Inventory tab).
 */
const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// The "Inventory" tab is actually a Stack of screens
function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryList" component={InventoryScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  // Select specific state to prevent unnecessary re-renders
  const isLoading = useAppStore((state) => state.isLoading);
  const isOnline = useAppStore((state) => state.isOnline);

  // Hydrate state (load from AsyncStorage) on app launch
  useEffect(() => {
    hydrateAppStore();
  }, []);

  // WebSocket Notification Handler
  const onMessage = useCallback((data: any) => {
    // Requirements say: Display toast notification for new items
    if (data?.id && data?.name) {
      const { items, addItem } = useAppStore.getState();
      
      // Prevent duplicates if the item was added by this device and already exists in list
      const exists = items.some(i => i.id === data.id);
      
      if (!exists) {
        addItem(data);
        Toast.show({
          type: 'info',
          text1: 'New Item Added!',
          text2: `${data.name} (${data.category}) - ${data.status}`,
          position: 'bottom',
        });
      }
    }
  }, []);

  // Initialize WebSocket connection
  useWebSocket(onMessage);

  // Initialize Offline Sync
  useOfflineSync();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
      {/* StatusBar controls the top system bar (battery, time) */}
      <StatusBar style="dark" />
      
      {/* Global Offline Banner (visible when isOnline = false) */}
      <OfflineBanner />
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // We use custom headers in screens or just SafeAreaView
          tabBarActiveTintColor: '#4C6EF5',
          tabBarInactiveTintColor: '#ADB5BD',
          // Customizing the Tab Bar style
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#F1F3F5',
            backgroundColor: '#FFFFFF',
            height: 85,
            paddingBottom: 25,
            paddingTop: 10,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
            marginTop: 4,
          },
          // Dynamic Icon Rendering based on route name
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: string = '';
            
            if (route.name === 'Inventory') {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (route.name === 'Reports') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Inventory" 
          component={InventoryStack} 
          options={{ tabBarLabel: 'Inventory' }}
        />
        <Tab.Screen 
          name="Reports" 
          component={ReportsScreen} 
          options={{ tabBarLabel: 'Reports' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ tabBarLabel: 'Settings' }}
        />
      </Tab.Navigator>
      
      {/* Global Overlays */}
      <LoadingOverlay visible={isLoading} />
      <GlobalStatusModal />
      <Toast topOffset={isOnline ? 50 : 110} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}