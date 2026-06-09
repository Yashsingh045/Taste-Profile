import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { SwipeAction } from '../types/food';

interface Props {
  onPress: (action: SwipeAction) => void;
  disabled?: boolean;
}

interface ActionConfig {
  key: SwipeAction;
  label: string;
  bg: string;
  shadow: string;
  icon: React.ReactNode;
}

/**
 * Solid-colour circular action buttons with subtle coloured glow.
 * Matches the swipe.png Figma reference: no aggressive gradients, no big halos.
 */
export function SwipeActionButtons({ onPress, disabled }: Props) {
  const actions: ActionConfig[] = [
    {
      key: 'dislike',
      label: 'Swipe Left',
      bg: '#F2453D',
      shadow: '#F2453D',
      icon: <Ionicons name="close" size={26} color="#FFFFFF" />,
    },
    {
      key: 'skip',
      label: 'Not Sure',
      bg: '#7E8693',
      shadow: '#7E8693',
      icon: <Ionicons name="help" size={24} color="#FFFFFF" />,
    },
    {
      key: 'super',
      label: 'Super Like',
      bg: '#4664F0',
      shadow: '#4664F0',
      icon: <Ionicons name="star" size={22} color="#FFFFFF" />,
    },
    {
      key: 'like',
      label: 'Swipe Right',
      bg: '#26C160',
      shadow: '#26C160',
      icon: <Ionicons name="heart" size={24} color="#FFFFFF" />,
    },
  ];

  return (
    <View style={styles.row}>
      {actions.map((a) => (
        <View key={a.key} style={styles.column}>
          <Pressable
            disabled={disabled}
            onPress={() => onPress(a.key)}
            accessibilityRole="button"
            accessibilityLabel={a.label}
            style={({ pressed }) => [
              styles.circle,
              { backgroundColor: a.bg, shadowColor: a.shadow },
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            {a.icon}
          </Pressable>
          <Text style={styles.label}>{a.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  column: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
