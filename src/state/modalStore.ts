import { create } from 'zustand';

export interface ModalState {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  
  showModal: (params: {
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
  }) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  type: 'info',
  title: '',
  message: '',
  actionText: undefined,
  onAction: undefined,

  showModal: (params) => set({ 
    visible: true, 
    ...params 
  }),
  
  hideModal: () => set({ 
    visible: false 
  }),
}));
