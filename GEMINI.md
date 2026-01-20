# Gemini Agent Context & Rules

This document defines the context, conventions, and rules for the Gemini Agent when working on this React Native (Expo) project. It is designed to facilitate rapid development, strictly adhering to the structure expected in "Exam" style CRUD applications.

## 1. Project Overview

*   **Type:** Mobile Application (Warehouse/Inventory Management).
*   **Stack:**
    *   **Frontend:** React Native (Expo), TypeScript.
    *   **Backend:** Node.js (Koa), WebSocket (Socket.io).
    *   **State Management:** Zustand (`src/state/appStore.ts`).
    *   **Navigation:** React Navigation v7 (`@react-navigation/native`).
    *   **API:** Axios (Centralized in `src/api/service.ts`).
    *   **Persistence:** `AsyncStorage` (via `src/lib/storage.ts`).
    *   **UI Library:** Built-in React Native components + `react-native-vector-icons`.

## 2. Architecture & File Structure

Strictly adhere to this directory structure. Do not introduce new top-level directories without strong justification.

```text
src/
├── api/             # API interaction layer
│   ├── client.ts    # Axios instance configuration (timeouts, headers)
│   ├── endpoints.ts # API URL constants
│   ├── service.ts   # Business logic / Service methods (getAll, add, delete)
│   └── index.ts     # Exports
├── components/      # Reusable UI components (Presentational)
├── config/          # App-wide configuration (Constants, ENV)
├── hooks/           # Custom React hooks (e.g., useWebSocket)
├── lib/             # Utilities (Storage, WebSocket helper)
├── screens/         # Screen components (Container logic + UI)
├── state/           # Global State (Zustand stores)
└── types/           # TypeScript Interfaces & Types
```

## 3. Development Rules (Agentic Coding)

To ensure consistency and speed, follow these rules strictly:

### A. Data & Typing
1.  **Strict Types:** All entities must be defined in `src/types/types.ts`.
    *   *Example:* `interface InventoryItem { id: number; name: string; ... }`
2.  **No `any`:** Avoid `any` unless absolutely necessary (e.g., legacy navigation hacks).

### B. State Management (Zustand)
1.  **Single Source of Truth:** Use `src/state/appStore.ts` for all shared data (Items, Online Status, Notifications).
2.  **Persistence:** The store **must** handle persistence side-effects.
    *   *Pattern:* When `setItems` is called, simultaneously save to `AsyncStorage`.
    *   *Hydration:* `hydrateAppStore()` must be called on app launch.

### C. API & Networking
1.  **Service Pattern:** NEVER make `axios` calls directly in components.
    *   *Correct:* `await InventoryService.getAllItems()`
    *   *Incorrect:* `axios.get('/items')`
2.  **Offline Handling:**
    *   Check `isOnline` from the store before non-GET operations.
    *   GET operations should return cached data if offline (handled via Store or Service fallback).
3.  **Loading & Errors:**
    *   Set `isLoading` and `error` in the global store or local state during async ops.
    *   Display user-friendly errors using `Toast.show()`.

### D. UI & Components
1.  **Functional Components:** Use React Functional Components with Hooks.
2.  **Styling:** Use `StyleSheet.create` at the bottom of the file. Avoid inline styles for complex objects.
3.  **Feedback:** Always provide visual feedback (ActivityIndicator, Toast) for async actions.

### E. WebSockets
1.  **Integration:** Use `src/hooks/useWebSocket.ts` (or similar) to manage the connection.
2.  **Updates:** Socket events should trigger Store updates (e.g., `addItem` to store) and visual notifications (Toast/Snackbar).

## 4. Key Workflows (How to Build)

### Adding a New Feature (e.g., "Manage Orders")
1.  **Define Type:** Add `Order` interface to `src/types/types.ts`.
2.  **Update API:** Add endpoints to `src/api/endpoints.ts` and methods to `src/api/service.ts`.
3.  **Update Store:** Add `orders`, `setOrders` to `useAppStore`.
4.  **Create Screens:** Create `OrdersListScreen.tsx` and `OrderDetailScreen.tsx`.
5.  **Navigation:** Register screens in `App.tsx` (or main navigator).

## 5. Common Bottlenecks & Fixes

*   **Navigation Typing:** Currently using `useNavigation<any>`. *Goal:* Move to strongly typed navigation props.
*   **Hardcoded URLs:** Ensure `api/client.ts` uses dynamic configuration for the backend URL (localhost vs device IP).
*   **Data Consistency:** Ensure local cache is updated immediately after successful mutation (Optimistic UI) or re-fetch.

## 6. Exam Specifics (Critical)
*   **FOLLOW THE INSTRUCTIONS AND EXAM REQUIREMENTS EXACTLY AS WRITTEN**
*   **Offline First:** The app MUST work offline (read-only or queueing writes if required).
*   **Persistence:** Data must survive app kills.
*   **Real-time:** Must react to WebSocket events immediately.
