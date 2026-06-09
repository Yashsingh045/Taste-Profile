import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

interface Props {
  onPress?: () => void;
}

/**
 * Subtle circular chevron — matches the Figma's barely-there back button.
 * No drop shadow, hairline outline, very low-opacity surface.
 */
export function BackButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [pressed && styles.pressed]}>
      <View style={styles.circle}>
        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  pressed: {
    opacity: 0.55,
  },
});
