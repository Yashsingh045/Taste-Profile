import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { GlassCard } from '../components/GlassCard';
import { BackButton } from '../components/BackButton';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  onStart: () => void;
  onBack?: () => void;
  bottomInset?: number;
}

export function IntroScreen({ onStart, onBack, bottomInset = 96 }: Props) {
  return (
    <ScreenContainer withBottomInset={false} contentStyle={{ paddingBottom: bottomInset }}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.title}>Design Your{'\n'}Food Plan</Text>
      </View>

      <View style={styles.cardWrap}>
        <GlassCard style={styles.card} borderRadius={radius.xxl}>
          <Text style={styles.emoji}>😋</Text>
          <Text style={styles.heading}>Build Your Taste Profile</Text>
          <Text style={styles.body}>
            Swipe right on foods you love, left on{'\n'}foods you don't.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.bodySmall}>
            This helps us recommend meals you'll love eating.
          </Text>

          <Pressable
            onPress={onStart}
            accessibilityRole="button"
            accessibilityLabel="Start Swiping"
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>Start Swiping</Text>
          </Pressable>

          <Text style={styles.caption}>Takes about 2 minutes.</Text>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 64,
    lineHeight: 72,
    textAlign: 'center',
  },
  heading: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  body: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  divider: {
    height: spacing.lg,
  },
  bodySmall: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cta: {
    marginTop: spacing.xl,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    minWidth: 220,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    ...typography.button,
    color: colors.onAccent,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
