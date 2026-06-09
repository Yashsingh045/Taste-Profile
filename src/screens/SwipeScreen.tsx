import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar } from '../components/ProgressBar';
import { SwipeActionButtons } from '../components/SwipeActionButtons';
import { SwipeCard, SwipeCardHandle } from '../components/SwipeCard';
import { GradientBackground } from '../components/GradientBackground';
import { useTasteProfile } from '../context/TasteProfileContext';
import { foods } from '../data/foods';
import { SwipeAction } from '../types/food';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  onComplete: () => void;
}

export function SwipeScreen({ onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const { recordSwipe, undo } = useTasteProfile();
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

  const handleUndo = useCallback(() => {
    if (index === 0) return;
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    undo();
    setIndex((i) => Math.max(0, i - 1));
  }, [index, undo]);

  const progress = useMemo(() => index / foods.length, [index]);

  const visibleCards = foods.slice(index, index + 3).reverse();

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + spacing.xs, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.progressRow}>
          <View style={styles.progressFlex}>
            <ProgressBar value={progress} />
          </View>
          <Pressable
            onPress={handleUndo}
            disabled={index === 0}
            accessibilityRole="button"
            accessibilityLabel="Undo last swipe"
            style={({ pressed }) => [
              styles.undoButton,
              index === 0 && styles.undoDisabled,
              pressed && styles.undoPressed,
            ]}
          >
            <Ionicons
              name="arrow-undo"
              size={16}
              color={index === 0 ? colors.textDim : colors.textSecondary}
            />
            <Text style={[styles.undoLabel, index === 0 && styles.undoLabelDisabled]}>Undo</Text>
          </Pressable>
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
  progressRow: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressFlex: {
    flex: 1,
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  undoDisabled: {
    opacity: 0.4,
  },
  undoPressed: {
    opacity: 0.7,
  },
  undoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  undoLabelDisabled: {
    color: colors.textDim,
  },
  deck: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  actions: {
    paddingBottom: spacing.md,
  },
});
