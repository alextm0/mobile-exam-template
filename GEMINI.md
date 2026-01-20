# Gemini Agent Context & Rules

This document defines the context, conventions, and rules for the Gemini Agent when working on this React Native (Expo) project. It is designed to facilitate rapid development, strictly adhering to the structure expected in "Exam" style CRUD applications.

### Exam Context
- **Duration:** 2 hours
- **Sections:** 3-4 screens
- **Server:** Provided by professor (do NOT modify)
- **Requirements:** Follow exam statement EXACTLY (single source of truth)
- **Goal:** Working app, not production-ready code

## 1. Project Overview

*   **Type:** Mobile Application.
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

### A. Strict Project Restrictions
1.  **NO BACKEND MODS:** DO NOT modify the backend server code (`server/`) unless explicitly requested. Assume the server works as intended.
2.  **STRETCH GOALS ARE NO-GO:** Follow the statement requirements closely. This is the single source of truth for getting points. Don't add extra "crazy" features; keep it simple and functional.
3.  **STAY WITHIN STRUCTURE:** Follow the current folder structure and architecture. Identify where elements should go based on existing patterns without adding unnecessary overhead.
4.  **DO NOT ADD OFFLINE SUPPORT FOR ALL OPERATIONS, BUT ONLY FOR THOSE THAT MENTION OFFLINE SUPPORT** It will be described in the statement whether it should support offline or online only.

### B. Data & Typing
1.  **Strict Types:** All entities must be defined in `src/types/types.ts`.
2.  **No `any`:** Avoid `any` unless absolutely necessary (navigation props are a rare exception).

### C. State Management (Zustand)
1.  **Single Source of Truth:** Use `src/state/appStore.ts` for all shared data.
2.  **Offline Queue:** Use `offlineQueue` in the store for recording operations performed while offline.
3.  **Hydration:** `hydrateAppStore()` must be called on app launch to restore data from `AsyncStorage`.

### D. API & Networking
1.  **Service Pattern:** NEVER make `axios` calls directly in components. Use `InventoryService`.
2.  **Offline Handling:** 
    *   If offline during a "write" operation, add it to the `offlineQueue` for later sync.
    *   Use `src/hooks/useOfflineSync.ts` to automatically push the queue when the device becomes online.
3.  **Loading & Errors:** Use the global `setIsLoading` and `Toast.show()` for consistent feedback.

### E. UI & Components
1.  **Functional Components Only.**
2.  **Styling:** Use `StyleSheet.create`. No inline styles for complex objects.
3.  **Accessibility:** Ensure the "Offline Banner" doesn't overlap Toast messages (adjust `topOffset`).

### F. WebSockets
1.  **Real-time Integration:** Use `src/hooks/useWebSocket.ts`.
2.  **State Sync:** WS events MUST update the global state (`addItem`) immediately so the UI reflects changes from other clients (e.g., Postman) without refresh.

## 4. Key Workflows (How to Build)

### Adding a New Feature
1.  **Check Requirement:** Verify against the exam statement.
2.  **Define Type:** Add interface to `src/types/types.ts`.
3.  **Update API:** Add to `endpoints.ts` and `service.ts`.
4.  **Update Store:** Add data and actions to `useAppStore`.
5.  **Create Screens:** Use functional components following existing UI patterns.
6.  **Navigation:** Register in `App.tsx`.

## 5. Common Bottlenecks & Fixes

*   **Toast Overlap:** When the offline banner is visible, set `topOffset` to `110` in `Toast` to keep it visible.
*   **Stale Reports:** Use `useIsFocused` in report screens to trigger a data refresh when switching tabs.
*   **WS Sync:** Ensure the `onMessage` handler in `App.tsx` performs an `addItem` check (prevent duplicates) to keep the list updated.

## 6. Exam Specifics (Critical)
*   **FOLLOW REQUIREMENTS EXACTLY:** The statement is the only source of truth.
*   **Offline First:** The app MUST support recording items while offline via an offline queue.
*   **Persistence:** All items (including the offline queue) must survive app kills.
*   **Real-time:** Must reflect external changes via WebSocket instantly.
*   **Retry Options:** Provide "Retry" buttons/actions in offline states (List, Detail, Reports).
