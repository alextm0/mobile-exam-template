import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from './logger';

const log = (message: string, detail?: any) => {
  logger.db(message, detail);
};

export async function saveJSON(key: string, value: unknown) {
  try {
    log(`Saving key: ${key}`);
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    log(`Error saving key: ${key}`, error);
    throw error;
  }
}

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    log(`Loading key: ${key}`);
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    log(`Error loading key: ${key}`, error);
    return null;
  }
}

export async function removeKey(key: string) {
  try {
    log(`Removing key: ${key}`);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    log(`Error removing key: ${key}`, error);
    throw error;
  }
}

export async function clearStorage() {
  try {
    log('Clearing all storage');
    await AsyncStorage.clear();
  } catch (error) {
    log('Error clearing storage', error);
  }
}
