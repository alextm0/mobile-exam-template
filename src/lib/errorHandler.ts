import { logger, LogCategory } from './logger';
import Toast from 'react-native-toast-message';
import { ui } from './ui';

export interface AppError extends Error {
  code?: string;
  category?: LogCategory;
  isFatal?: boolean;
}

export const ErrorHandler = {
  /**
   * Handle errors from API calls
   */
  handleApiError: (error: any, customMessage?: string) => {
    const message = customMessage || error.response?.data?.message || error.message || 'An unexpected server error occurred';
    
    logger.error(`API Error: ${message}`, error, LogCategory.SERVER);
    
    Toast.show({
      type: 'error',
      text1: 'Server Connection Error',
      text2: message,
      position: 'bottom',
    });

    return message;
  },

  /**
   * Handle errors from local storage/db
   */
  handleDbError: (error: any, operation: string) => {
    const message = `Failed to ${operation}: ${error.message}`;
    
    logger.error(message, error, LogCategory.DB);
    
    return message;
  },

  /**
   * General error handler
   */
  handleError: (error: any, category: LogCategory = LogCategory.APP) => {
    const message = error.message || 'An unknown error occurred';
    logger.error(message, error, category);
    
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
  },

  /**
   * Handle critical errors that require user attention
   */
  handleCriticalError: (title: string, error: any, onAction?: () => void) => {
    const message = error.message || 'A critical error occurred.';
    logger.error(`CRITICAL: ${message}`, error, LogCategory.APP);
    
    ui.modal.error(
      title,
      message,
      onAction,
      'Retry'
    );
  },

  /**
   * Capture non-error exceptions or warnings
   */
  warn: (message: string, category: LogCategory = LogCategory.APP) => {
    logger.warn(message, null, category);
  }
};
