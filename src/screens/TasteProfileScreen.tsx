import React, { useCallback, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { SectionCard } from '../components/SectionCard';
import { HighlightsCarousel } from '../components/HighlightsCarousel';
import { ResultListItem } from '../components/ResultListItem';
import { PageDots } from '../components/PageDots';
import { BackButton } from '../components/BackButton';
import { useTasteProfile } from '../context/TasteProfileContext';
import { defaultLifestyleGoals } from '../data/lifestyle';
import { colors, spacing, typography } from '../theme';

interface Props {
  onBack?: () => void;
  bottomInset?: number;
}

const FOODS_PER_PAGE = 9;

export function TasteProfileScreen({ onBack, bottomInset = 96 }: Props) {
  const insets = useSafeAreaInsets();
  const { profile } = useTasteProfile();
  const { width } = useWindowDimensions();
  const pageWidth = width - spacing.lg * 2;
  const [lovedActive, setLovedActive] = useState(0);

  const lovedFoods = [...profile.liked, ...profile.superLiked];
  const lovedPages: typeof lovedFoods[] = [];
  for (let i = 0; i < lovedFoods.length; i += FOODS_PER_PAGE) {
    lovedPages.push(lovedFoods.slice(i, i + FOODS_PER_PAGE));
  }

  const onLovedScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / pageWidth);
      if (idx !== lovedActive) setLovedActive(idx);
    },
    [lovedActive, pageWidth],
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.xs, paddingBottom: bottomInset + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Your Taste Profile</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Tailored to your unique needs. We'll use this for recommendations and meals plans
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Key Highlights:</Text>
          <HighlightsCarousel highlights={profile.highlights} />
        </View>

        <View style={styles.section}>
          <SectionCard
            emoji="💪"
            title="Lifestyle & Goals"
            subtitle="We'll use this to tailor our advice & meal plan"
          >
            {defaultLifestyleGoals.map((goal, i) => (
              <ResultListItem
                key={goal.label}
                label={goal.label}
                icon="check"
                iconBg={colors.actionLike}
                divider={i < defaultLifestyleGoals.length - 1}
              />
            ))}
          </SectionCard>
        </View>

        <View style={styles.section}>
          <SectionCard
            emoji="❤️"
            title="Foods You Love"
            subtitle="We'll Recommend These"
            footer={
              lovedPages.length > 1 ? <PageDots total={lovedPages.length} active={lovedActive} /> : null
            }
          >
            {lovedFoods.length === 0 ? (
              <Text style={styles.empty}>Swipe right on some foods to start building this list.</Text>
            ) : (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onLovedScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
              >
                {lovedPages.map((page, pageIdx) => (
                  <View key={pageIdx} style={{ width: pageWidth - spacing.lg * 2 }}>
                    {page.map((food, i) => (
                      <ResultListItem
                        key={food.id}
                        label={food.name}
                        icon="heart"
                        iconBg={colors.actionSuper}
                        divider={i < page.length - 1}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '600',
    paddingLeft: spacing.xxs,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    paddingVertical: spacing.md,
    textAlign: 'center',
  },
});
