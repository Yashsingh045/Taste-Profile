import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function SectionCard({ emoji, title, subtitle, children, footer }: Props) {
  return (
    <GlassCard style={styles.card} borderRadius={radius.xl}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.emoji}>{emoji} </Text>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <View style={styles.divider} />
      </View>
      <View style={styles.body}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  header: {
    gap: spacing.xxs,
  },
  emoji: {
    fontSize: 18,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  divider: {
    marginTop: spacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  body: {
    paddingTop: spacing.xs,
  },
  footer: {
    paddingTop: spacing.md,
    alignItems: 'center',
  },
});
