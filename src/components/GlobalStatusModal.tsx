import React from 'react';
import { useModalStore } from '../state/modalStore';
import { StatusModal } from './StatusModal';

export const GlobalStatusModal = () => {
  const { visible, type, title, message, actionText, onAction, hideModal } = useModalStore();

  return (
    <StatusModal
      visible={visible}
      type={type}
      title={title}
      message={message}
      actionText={actionText}
      onAction={() => {
        if (onAction) onAction();
        hideModal();
      }}
      onClose={hideModal}
    />
  );
};
