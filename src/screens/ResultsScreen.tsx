import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { ResultCard } from '../components/ResultCard';
import { ResultListItem } from '../components/ResultListItem';
import { HorizontalPager } from '../components/HorizontalPager';
import { BackButton } from '../components/BackButton';
import { useTasteProfile } from '../context/TasteProfileContext';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  onSeeProfile: () => void;
  onBack?: () => void;
  bottomInset?: number;
}

export function ResultsScreen({ onSeeProfile, onBack, bottomInset = 96 }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, reset } = useTasteProfile();

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

  const lovePage = (
    <ResultCard
      emoji="❤️"
      title="Foods You Love"
      subtitle="These will headline your meal plan"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {profile.lovedFoods.length === 0 ? (
          <Text style={styles.empty}>Swipe right (or super-like) a few foods to populate this.</Text>
        ) : (
          profile.lovedFoods.map((food, i) => (
            <ResultListItem
              key={food.id}
              label={food.name}
              icon="heart"
              iconBg={colors.actionSuper}
              divider={i < profile.lovedFoods.length - 1}
            />
          ))
        )}
      </ScrollView>
    </ResultCard>
  );

  const categoriesPage = (
    <ResultCard
      emoji="🍽️"
      title="Categories You Crave"
      subtitle="The food groups that won your swipes"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {profile.categoryBreakdown.length === 0 ? (
          <Text style={styles.empty}>Like a few foods to see your category mix.</Text>
        ) : (
          profile.categoryBreakdown.map((row, i) => (
            <View key={row.category} style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryEmoji}>{row.emoji}</Text>
                <Text style={styles.categoryLabel}>{row.label}</Text>
              </View>
              <Text style={styles.categoryPercent}>
                {row.count} · {row.percent}%
              </Text>
              {i < profile.categoryBreakdown.length - 1 && <View style={styles.categoryDivider} />}
            </View>
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
        </View>

        <View style={styles.carousel}>
          <HorizontalPager pages={[hatePage, lovePage, cuisinePage, categoriesPage]} />
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
    paddingBottom: spacing.sm,
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
  categoryRow: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryLabel: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    flex: 1,
  },
  categoryPercent: {
    ...typography.body,
    color: colors.textSecondary,
    position: 'absolute',
    right: 0,
    top: spacing.sm + 2,
  },
  categoryDivider: {
    marginTop: spacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
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
