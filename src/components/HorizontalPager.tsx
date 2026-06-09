import React, { useCallback, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { PageDots } from './PageDots';
import { spacing } from '../theme';

interface Props {
  pages: React.ReactNode[];
  pageHorizontalPadding?: number;
  showDots?: boolean;
}

export function HorizontalPager({ pages, pageHorizontalPadding = spacing.lg, showDots = true }: Props) {
  const { width } = useWindowDimensions();
  const pageWidth = width;
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / pageWidth);
      if (idx !== active) setActive(idx);
    },
    [active, pageWidth],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {pages.map((page, i) => (
          <View key={i} style={[styles.page, { width: pageWidth, paddingHorizontal: pageHorizontalPadding }]}>
            {page}
          </View>
        ))}
      </ScrollView>
      {showDots && pages.length > 1 && (
        <View style={styles.dots}>
          <PageDots total={pages.length} active={active} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'stretch',
  },
  page: {
    paddingVertical: spacing.md,
  },
  dots: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
});
