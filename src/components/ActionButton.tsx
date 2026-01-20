import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { container: styles.secondary, text: styles.secondaryText };
      case 'danger':
        return { container: styles.danger, text: styles.dangerText };
      case 'ghost':
        return { container: styles.ghost, text: styles.ghostText };
      case 'outline':
        return { container: styles.outline, text: styles.outlineText };
      default:
        return { container: styles.primary, text: styles.primaryText };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variantStyles.container,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#4C6EF5' : '#FFFFFF'} size="small" />
      ) : (
        <Text style={[styles.buttonText, variantStyles.text, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primary: {
    backgroundColor: '#4C6EF5',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#F1F3F5',
  },
  secondaryText: {
    color: '#495057',
  },
  danger: {
    backgroundColor: '#FFEBE9',
    borderWidth: 1,
    borderColor: '#FFA8A1',
  },
  dangerText: {
    color: '#D14343',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#4C6EF5',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4C6EF5',
  },
  outlineText: {
    color: '#4C6EF5',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
