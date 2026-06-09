import React, { useCallback, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { GlassCard } from './GlassCard';
import { PageDots } from './PageDots';
import { TasteHighlight } from '../types/food';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  highlights: TasteHighlight[];
  groupSize?: number;
}

export function HighlightsCarousel({ highlights, groupSize = 3 }: Props) {
  const { width } = useWindowDimensions();
  const pageWidth = width - spacing.lg * 2;
  const [active, setActive] = useState(0);

  const pages: TasteHighlight[][] = [];
  for (let i = 0; i < highlights.length; i += groupSize) {
    pages.push(highlights.slice(i, i + groupSize));
  }

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / pageWidth);
      if (idx !== active) setActive(idx);
    },
    [active, pageWidth],
  );

  if (highlights.length === 0) {
    return (
      <GlassCard style={styles.empty} borderRadius={radius.xl}>
        <Text style={styles.emptyText}>Swipe through foods to unlock your highlights.</Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={styles.card} borderRadius={radius.xl}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {pages.map((group, idx) => (
          <View key={idx} style={[styles.page, { width: pageWidth }]}>
            {group.map((h, i) => (
              <React.Fragment key={`${h.label}-${i}`}>
                <View style={styles.item}>
                  <Text style={styles.emoji}>{h.emoji}</Text>
                  <Text style={styles.label}>{h.label}</Text>
                </View>
                {i < group.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        ))}
      </ScrollView>
      {pages.length > 1 && (
        <View style={styles.dots}>
          <PageDots total={pages.length} active={active} />
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.lg,
  },
  empty: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  page: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  emoji: {
    fontSize: 36,
    lineHeight: 42,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 56,
    backgroundColor: colors.border,
  },
  dots: {
    paddingTop: spacing.md,
  },
});
