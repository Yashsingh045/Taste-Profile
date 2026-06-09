import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from './GlassCard';
import { colors, radius, spacing, typography } from '../theme';

export type TabKey = 'start' | 'faq' | 'taste';

interface Props {
  active: TabKey;
  onSelect: (key: TabKey) => void;
  onSearch?: () => void;
}

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
}

export function BottomNav({ active, onSelect, onSearch }: Props) {
  const insets = useSafeAreaInsets();

  const tabs: TabConfig[] = [
    {
      key: 'start',
      label: 'Start',
      icon: <Ionicons name="home-outline" size={24} color={colors.textSecondary} />,
      iconActive: <Ionicons name="home" size={24} color={colors.accent} />,
    },
    {
      key: 'faq',
      label: 'FAQ',
      icon: <Ionicons name="help-circle-outline" size={24} color={colors.textSecondary} />,
      iconActive: <Ionicons name="help-circle" size={24} color={colors.accent} />,
    },
    {
      key: 'taste',
      label: 'Taste Profile',
      icon: <MaterialCommunityIcons name="carrot" size={24} color={colors.textSecondary} />,
      iconActive: <MaterialCommunityIcons name="carrot" size={24} color={colors.accent} />,
    },
  ];

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.sm) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.row} pointerEvents="box-none">
        <GlassCard borderRadius={radius.pill} style={styles.pill}>
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onSelect(tab.key)}
                style={({ pressed }) => [
                  styles.tab,
                  isActive && styles.tabActive,
                  pressed && styles.tabPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.label}
              >
                {isActive ? tab.iconActive : tab.icon}
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </GlassCard>

        <Pressable
          onPress={onSearch}
          accessibilityRole="button"
          accessibilityLabel="Search"
          style={({ pressed }) => [pressed && styles.searchPressed]}
        >
          <GlassCard borderRadius={radius.pill} style={styles.searchButton}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          </GlassCard>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.xxs,
    paddingVertical: spacing.xxs,
    alignItems: 'center',
    height: 60,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.pill,
    gap: 2,
  },
  tabActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  tabPressed: {
    opacity: 0.7,
  },
  tabLabel: {
    ...typography.tabLabel,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  searchButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPressed: {
    opacity: 0.7,
  },
});
