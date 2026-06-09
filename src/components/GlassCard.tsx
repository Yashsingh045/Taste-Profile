import React from 'react';
import { Platform, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { radius } from '../theme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'dark' | 'light';
  borderRadius?: number;
  shadowed?: boolean;
  children?: React.ReactNode;
}

/**
 * Frosted-glass card matching the CalorAI spec:
 *   - blur intensity 20–30 with a subtle white-10% overlay
 *   - 1px rgba(255,255,255,0.20) border
 *   - drop shadow for depth (cast from the outer wrapper)
 *
 * iOS: real BlurView. Android: solid semi-transparent fill — the visual
 * hierarchy (border + tint + shadow) carries the glass look so the UI never
 * looks broken on devices where native blur is flaky.
 */
export function GlassCard({
  children,
  style,
  intensity = 28,
  tint = 'dark',
  borderRadius = radius.xxl,
  shadowed = true,
  ...rest
}: GlassCardProps) {
  const shape: ViewStyle = {
    borderRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
  };

  return (
    <View style={[shadowed && styles.shadow, style, shape]} {...rest}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={intensity}
          tint={tint}
          style={[styles.fill, { borderRadius }, styles.clip, styles.iosOverlay]}
          pointerEvents="none"
        />
      ) : (
        <View
          style={[
            styles.fill,
            { borderRadius },
            styles.clip,
            styles.androidFallback,
          ]}
          pointerEvents="none"
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 14,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  clip: {
    overflow: 'hidden',
  },
  iosOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  androidFallback: {
    backgroundColor: 'rgba(20, 20, 20, 0.80)',
  },
});
