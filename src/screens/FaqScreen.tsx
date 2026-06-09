import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { BackButton } from '../components/BackButton';
import { faqs } from '../data/faqs';
import { colors, radius, spacing, typography } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  onBack?: () => void;
  bottomInset?: number;
}

export function FaqScreen({ onBack, bottomInset = 96 }: Props) {
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex((current) => (current === i ? null : i));
  };

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
          <Text style={styles.title}>FAQ</Text>
          <Text style={styles.subtitle}>Quick answers about your taste profile.</Text>
        </View>

        <View style={styles.list}>
          {faqs.map((item, i) => {
            const open = i === openIndex;
            return (
              <Pressable key={item.question} onPress={() => toggle(i)} accessibilityRole="button">
                <GlassCard style={styles.item} borderRadius={radius.xl}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </View>
                  {open && (
                    <View style={styles.answerWrap}>
                      <View style={styles.divider} />
                      <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                  )}
                </GlassCard>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  header: {
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
  list: {
    gap: spacing.sm,
  },
  item: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  question: {
    ...typography.subheading,
    color: colors.textPrimary,
    flex: 1,
  },
  answerWrap: {
    gap: spacing.sm,
  },
  divider: {
    marginTop: spacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  answer: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
