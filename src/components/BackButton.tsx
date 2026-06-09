import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, radius } from '../theme';

interface Props {
  onPress?: () => void;
}

export function BackButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [pressed && styles.pressed]}>
      <GlassCard borderRadius={radius.pill} style={styles.card}>
        <Text style={styles.chevron} accessibilityLabel="Back">‹</Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 30,
    marginTop: -2,
    fontWeight: '300',
  },
  pressed: {
    opacity: 0.6,
  },
});
