import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { ResultCard } from '../components/ResultCard';
import { ResultListItem } from '../components/ResultListItem';
import { HorizontalPager } from '../components/HorizontalPager';
import { BackButton } from '../components/BackButton';
import { useTasteProfile } from '../context/TasteProfileContext';
import { foods } from '../data/foods';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  onSeeProfile: () => void;
  onBack?: () => void;
  bottomInset?: number;
}

export function ResultsScreen({ onSeeProfile, onBack, bottomInset = 96 }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, records, reset } = useTasteProfile();

  const totals = useMemo(
    () => ({
      liked: profile.liked.length,
      disliked: profile.disliked.length,
      superLiked: profile.superLiked.length,
      total: records.length,
    }),
    [profile, records.length],
  );

  const hatePage = (
    <ResultCard
      emoji="🙅"
      title="Foods You Hate"
      subtitle="These will never be on the menu"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {profile.dislikedFoods.length === 0 ? (
          <Text style={styles.empty}>No dislikes yet — you swiped right on everything!</Text>
        ) : (
          profile.dislikedFoods.map((food, i) => (
            <ResultListItem
              key={food.id}
              label={food.name}
              divider={i < profile.dislikedFoods.length - 1}
            />
          ))
        )}
      </ScrollView>
    </ResultCard>
  );

  const cuisinePage = (
    <ResultCard
      emoji="👨‍🍳"
      title="Your Favorite Cuisines"
      subtitle="Flavors you love, all in one place"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {profile.favoriteCuisines.length === 0 ? (
          <Text style={styles.empty}>Like a few foods to unlock cuisine matches.</Text>
        ) : (
          profile.favoriteCuisines.map((cuisine, i) => (
            <ResultListItem
              key={cuisine.id}
              label={cuisine.name}
              divider={i < profile.favoriteCuisines.length - 1}
            />
          ))
        )}
      </ScrollView>
    </ResultCard>
  );

  const handleReset = () => {
    reset();
    onBack?.();
  };

  return (
    <GradientBackground>
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + spacing.xs, paddingBottom: bottomInset },
        ]}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Your Results</Text>
          <Text style={styles.subtitle}>
            {totals.liked} liked · {totals.disliked} disliked · {totals.superLiked} super
            {totals.total < foods.length ? `  (${totals.total}/${foods.length} swiped)` : ''}
          </Text>
        </View>

        <View style={styles.carousel}>
          <HorizontalPager pages={[hatePage, cuisinePage]} />
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={onSeeProfile}
            accessibilityRole="button"
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>See Your Taste Profile</Text>
          </Pressable>
          <Pressable onPress={handleReset} accessibilityRole="button">
            <Text style={styles.resetText}>Swipe again</Text>
          </Pressable>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  carousel: {
    flex: 1,
    marginTop: spacing.md,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  cta: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    minWidth: 240,
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
  resetText: {
    ...typography.body,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
