import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { foods } from '../data/foods';
import { cuisines, cuisineForTag } from '../data/cuisines';
import {
  CategoryBreakdown,
  Cuisine,
  Food,
  FoodCategory,
  SwipeAction,
  SwipeRecord,
  TasteHighlight,
  TasteProfile,
} from '../types/food';

interface TasteProfileContextValue {
  records: SwipeRecord[];
  isComplete: boolean;
  recordSwipe: (foodId: number, action: SwipeAction) => void;
  undo: () => void;
  reset: () => void;
  profile: TasteProfile;
}

const TasteProfileContext = createContext<TasteProfileContextValue | undefined>(undefined);

export function TasteProfileProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<SwipeRecord[]>([]);

  const recordSwipe = useCallback((foodId: number, action: SwipeAction) => {
    setRecords((prev) => {
      const withoutCurrent = prev.filter((r) => r.foodId !== foodId);
      return [...withoutCurrent, { foodId, action }];
    });
  }, []);

  const undo = useCallback(() => {
    setRecords((prev) => prev.slice(0, -1));
  }, []);

  const reset = useCallback(() => {
    setRecords([]);
  }, []);

  const profile = useMemo(() => deriveProfile(records), [records]);
  const isComplete = records.length >= foods.length;

  const value = useMemo(
    () => ({ records, recordSwipe, undo, reset, profile, isComplete }),
    [records, recordSwipe, undo, reset, profile, isComplete],
  );

  return <TasteProfileContext.Provider value={value}>{children}</TasteProfileContext.Provider>;
}

export function useTasteProfile(): TasteProfileContextValue {
  const ctx = useContext(TasteProfileContext);
  if (!ctx) throw new Error('useTasteProfile must be used within a TasteProfileProvider');
  return ctx;
}

function foodById(id: number): Food | undefined {
  return foods.find((f) => f.id === id);
}

function deriveProfile(records: SwipeRecord[]): TasteProfile {
  const bucket = (action: SwipeAction): Food[] =>
    records
      .filter((r) => r.action === action)
      .map((r) => foodById(r.foodId))
      .filter((f): f is Food => Boolean(f));

  const liked = bucket('like');
  const disliked = bucket('dislike');
  const superLiked = bucket('super');
  const skipped = bucket('skip');

  const positive = [...liked, ...superLiked, ...superLiked]; // super counted twice
  const lovedFoods = dedupeById([...superLiked, ...liked]);

  return {
    liked,
    disliked,
    superLiked,
    skipped,
    favoriteCuisines: deriveFavoriteCuisines(positive),
    dislikedFoods: disliked,
    lovedFoods,
    categoryBreakdown: deriveCategoryBreakdown(lovedFoods),
    highlights: deriveHighlights(positive),
  };
}

function dedupeById(items: Food[]): Food[] {
  const seen = new Set<number>();
  const result: Food[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

const CATEGORY_META: Record<FoodCategory, { label: string; emoji: string }> = {
  protein: { label: 'Protein', emoji: '🥩' },
  carb: { label: 'Carbs', emoji: '🍞' },
  vegetable: { label: 'Vegetables', emoji: '🥦' },
  other: { label: 'Other', emoji: '🍱' },
};

function deriveCategoryBreakdown(foods: Food[]): CategoryBreakdown[] {
  const total = foods.length;
  if (total === 0) return [];
  const counts = new Map<FoodCategory, number>();
  foods.forEach((f) => counts.set(f.category, (counts.get(f.category) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      label: CATEGORY_META[category].label,
      emoji: CATEGORY_META[category].emoji,
      count,
      percent: Math.round((count / total) * 100),
    }));
}

function deriveFavoriteCuisines(positive: Food[]): Cuisine[] {
  const scores = new Map<number, number>();
  positive.forEach((food) => {
    food.tags.forEach((tag) => {
      const cuisine = cuisineForTag(tag);
      if (cuisine) {
        scores.set(cuisine.id, (scores.get(cuisine.id) ?? 0) + 1);
      }
    });
  });
  if (scores.size === 0) return [];
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => cuisines.find((c) => c.id === id))
    .filter((c): c is Cuisine => Boolean(c));
}

function deriveHighlights(positive: Food[]): TasteHighlight[] {
  if (positive.length === 0) return [];

  const tagCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  positive.forEach((food) => {
    categoryCounts.set(food.category, (categoryCounts.get(food.category) ?? 0) + 1);
    food.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  const highlights: TasteHighlight[] = [];

  const topCategory = sortedTop(categoryCounts);
  if (topCategory === 'protein') highlights.push({ label: 'Carnivore', emoji: '🥩' });
  else if (topCategory === 'vegetable') highlights.push({ label: 'Veg-Forward', emoji: '🥗' });
  else if (topCategory === 'carb') highlights.push({ label: 'Comfort Eater', emoji: '🍞' });

  const italianish = (tagCounts.get('italian') ?? 0) + (tagCounts.get('comfort') ?? 0);
  if (italianish >= 2) highlights.push({ label: 'Italian Food', emoji: '🇮🇹' });

  const fruity = (tagCounts.get('fruit') ?? 0) + (tagCounts.get('sweet') ?? 0);
  if (fruity >= 1) highlights.push({ label: 'Fruit-Lover', emoji: '🍇' });

  if ((tagCounts.get('healthy') ?? 0) >= 3) {
    highlights.push({ label: 'Health-Conscious', emoji: '🥦' });
  }
  if ((tagCounts.get('japanese') ?? 0) >= 1) {
    highlights.push({ label: 'Japanese Cuisine', emoji: '🍱' });
  }
  if ((tagCounts.get('mexican') ?? 0) >= 1) {
    highlights.push({ label: 'Mexican Spice', emoji: '🌮' });
  }

  return highlights.slice(0, 6);
}

function sortedTop(counts: Map<string, number>): string | undefined {
  if (counts.size === 0) return undefined;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}
