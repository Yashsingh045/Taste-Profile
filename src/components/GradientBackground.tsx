import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface Props {
  children?: React.ReactNode;
}

/**
 * Dark base + soft corner glows that match the Figma's atmospheric background.
 * Layers (back → front):
 *   1. Solid black base.
 *   2. Top-left cool blue radial-ish glow (LinearGradient + scale trick).
 *   3. Bottom-right green accent glow.
 *   4. Top-to-bottom subtle darken to ground the composition.
 */
export function GradientBackground({ children }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.glowTopLeft} />
      <View style={styles.glowBottomRight} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)']}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowTopLeft: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: colors.gradientGlowLeft,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -160,
    right: -120,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.gradientGlowRight,
  },
});
