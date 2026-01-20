import Toast from 'react-native-toast-message';
import { useModalStore } from '../state/modalStore';

/**
 * Reusable UI notification utilities
 */
export const ui = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'bottom',
    });
  },

  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'bottom',
    });
  },

  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'bottom',
    });
  },

  /**
   * Helper for standard server error toast
   */
  serverError: (message: string = 'Check your internet connection') => {
    ui.error('Server Unreachable', message);
  },

  /**
   * Modal triggers
   */
  modal: {
    show: (params: {
      type: 'success' | 'error' | 'info';
      title: string;
      message: string;
      actionText?: string;
      onAction?: () => void;
    }) => {
      useModalStore.getState().showModal(params);
    },
    
    success: (title: string, message: string, onAction?: () => void, actionText?: string) => {
      useModalStore.getState().showModal({
        type: 'success',
        title,
        message,
        onAction,
        actionText
      });
    },

    error: (title: string, message: string, onAction?: () => void, actionText?: string) => {
      useModalStore.getState().showModal({
        type: 'error',
        title,
        message,
        onAction,
        actionText
      });
    },

    info: (title: string, message: string, onAction?: () => void, actionText?: string) => {
      useModalStore.getState().showModal({
        type: 'info',
        title,
        message,
        onAction,
        actionText
      });
    }
  }
};
