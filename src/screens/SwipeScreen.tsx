import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar } from '../components/ProgressBar';
import { SwipeActionButtons } from '../components/SwipeActionButtons';
import { SwipeCard, SwipeCardHandle } from '../components/SwipeCard';
import { GradientBackground } from '../components/GradientBackground';
import { useTasteProfile } from '../context/TasteProfileContext';
import { foods } from '../data/foods';
import { SwipeAction } from '../types/food';
import { spacing } from '../theme';

interface Props {
  onComplete: () => void;
}

export function SwipeScreen({ onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const { recordSwipe } = useTasteProfile();
  const [index, setIndex] = useState(0);
  const topCardRef = useRef<SwipeCardHandle>(null);

  const handleSwiped = useCallback(
    (action: SwipeAction) => {
      const food = foods[index];
      if (!food) return;
      recordSwipe(food.id, action);
      const next = index + 1;
      if (next >= foods.length) {
        setIndex(next);
        onComplete();
      } else {
        setIndex(next);
      }
    },
    [index, recordSwipe, onComplete],
  );

  const handleButton = useCallback((action: SwipeAction) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        action === 'super'
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
    }
    topCardRef.current?.swipe(action);
  }, []);

  const progress = useMemo(() => index / foods.length, [index]);

  const visibleCards = foods.slice(index, index + 3).reverse();

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + spacing.xs, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.progressWrap}>
          <ProgressBar value={progress} />
        </View>

        <View style={styles.deck}>
          {visibleCards.map((food, i) => {
            const isTop = i === visibleCards.length - 1;
            return (
              <SwipeCard
                key={food.id}
                ref={isTop ? topCardRef : undefined}
                food={food}
                isTop={isTop}
                stackOffset={visibleCards.length - 1 - i}
                onSwiped={handleSwiped}
              />
            );
          })}
        </View>

        <View style={styles.actions}>
          <SwipeActionButtons onPress={handleButton} disabled={index >= foods.length} />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  progressWrap: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  deck: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  actions: {
    paddingBottom: spacing.md,
  },
});
