import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  label: string;
  icon?: 'check' | 'heart';
  iconColor?: string;
  iconBg?: string;
  divider?: boolean;
  style?: ViewStyle;
}

export function ResultListItem({
  label,
  icon = 'check',
  iconColor = '#fff',
  iconBg = colors.actionSuper,
  divider = true,
  style,
}: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Ionicons name={icon === 'heart' ? 'heart' : 'checkmark'} size={16} color={iconColor} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      {divider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    flex: 1,
  },
  divider: {
    marginTop: spacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
