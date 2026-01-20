import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export interface StatusModalProps {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  actionText,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return { name: 'checkmark-circle', color: '#40C057' };
      case 'error': return { name: 'alert-circle', color: '#FA5252' };
      case 'info': return { name: 'information-circle', color: '#4C6EF5' };
    }
  };

  const icon = getIcon();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
            <Ionicons name={icon.name} size={48} color={icon.color} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.footer}>
            {actionText && (
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton, { backgroundColor: icon.color }]} 
                onPress={onAction || onClose}
              >
                <Text style={styles.buttonText}>{actionText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: Math.min(width - 40, 400),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  footer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#ADB5BD',
    fontSize: 14,
    fontWeight: '600',
  },
});
