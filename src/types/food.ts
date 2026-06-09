export type FoodCategory = 'protein' | 'carb' | 'vegetable' | 'other';

export interface Food {
  id: number;
  name: string;
  image: string;
  category: FoodCategory;
  tags: string[];
}

export interface Cuisine {
  id: number;
  name: string;
  emoji: string;
  description: string;
}

export type SwipeAction = 'like' | 'dislike' | 'super' | 'skip';

export interface SwipeRecord {
  foodId: number;
  action: SwipeAction;
}

export interface TasteProfile {
  liked: Food[];
  disliked: Food[];
  superLiked: Food[];
  skipped: Food[];
  favoriteCuisines: Cuisine[];
  dislikedFoods: Food[];
  highlights: TasteHighlight[];
}

export interface TasteHighlight {
  label: string;
  emoji: string;
}
