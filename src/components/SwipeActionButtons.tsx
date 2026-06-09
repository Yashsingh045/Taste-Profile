import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
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
  glow: string;
  icon: React.ReactNode;
}

export function SwipeActionButtons({ onPress, disabled }: Props) {
  const actions: ActionConfig[] = [
    {
      key: 'dislike',
      label: 'Swipe Left',
      bg: colors.actionDislike,
      glow: colors.actionDislikeGlow,
      icon: <Ionicons name="close" size={28} color="#fff" />,
    },
    {
      key: 'skip',
      label: 'Not Sure',
      bg: 'rgba(110, 110, 110, 0.85)',
      glow: 'rgba(255,255,255,0.10)',
      icon: <Ionicons name="help" size={26} color="#fff" />,
    },
    {
      key: 'super',
      label: 'Super Like',
      bg: colors.actionSuper,
      glow: colors.actionSuperGlow,
      icon: <Ionicons name="star" size={24} color="#fff" />,
    },
    {
      key: 'like',
      label: 'Swipe Right',
      bg: colors.actionLike,
      glow: colors.actionLikeGlow,
      icon: <Ionicons name="heart" size={26} color="#fff" />,
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
              { backgroundColor: a.bg, shadowColor: a.bg },
              circleGlowStyle(a.glow),
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

function circleGlowStyle(_glow: string): ViewStyle {
  return {
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  };
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
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.16)',
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
