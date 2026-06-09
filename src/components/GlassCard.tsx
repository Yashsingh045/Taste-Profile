import React from 'react';
import { Platform, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../theme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'dark' | 'light';
  borderRadius?: number;
  children?: React.ReactNode;
}

/**
 * Frosted-glass card.
 * iOS: native blur via BlurView.
 * Android: solid translucent fill — RN's Android blur is unreliable, so we degrade gracefully
 * to a semi-opaque dark surface that preserves the visual hierarchy without looking broken.
 */
export function GlassCard({
  children,
  style,
  intensity = 28,
  tint = 'dark',
  borderRadius = radius.xxl,
  ...rest
}: GlassCardProps) {
  const baseStyle: ViewStyle = { borderRadius };

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[styles.shared, baseStyle, style]}
        {...rest}
      >
        <View style={[StyleSheet.absoluteFill, styles.iosTint]} pointerEvents="none" />
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.shared, baseStyle, styles.androidFallback, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shared: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  iosTint: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  androidFallback: {
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
  },
});
