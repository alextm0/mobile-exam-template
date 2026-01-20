export const ENDPOINTS = {
  ITEMS: '/items',
  ALL_ITEMS: '/all',
  ITEM_DETAIL: (id: number | string) => `/item/${id}`,
  ADD_ITEM: '/item',
  CATEGORIES: '/categories',
  BY_CATEGORY: (category: string) => `/byCategory?category=${category}`,
  SUPPLIER_ITEMS: (supplier: string) => `/supplier-items?supplier=${supplier}`,
  DELETE_ITEM: (id: number | string) => `/item/${id}`,
  UPDATE_ITEM: (id: number | string) => `/item/${id}`,
};
