/**
 * SINGLE SOURCE OF TRUTH
 * 
 * This file contains all the TypeScript interfaces and types for the application.
 * When starting a new project, update these interfaces to match your new data model.
 */

// 1. The main entity (e.g., Book, Movie, InventoryItem)
export interface InventoryItem {
  id: number;
  name: string;
  status: string;
  quantity: number;
  category: string;
  supplier: string;
  weight: number;
}

// 2. User/App related state types
export interface UserState {
  name: string;
  isOnline: boolean;
  lastNotification?: string;
}