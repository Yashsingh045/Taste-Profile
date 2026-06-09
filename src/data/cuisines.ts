import { Cuisine } from '../types/food';

export const cuisines: Cuisine[] = [
  {
    id: 1,
    name: 'Italian',
    emoji: '🇮🇹',
    description: 'Pasta, pizza, Mediterranean flavors',
  },
  {
    id: 2,
    name: 'Mexican',
    emoji: '🇲🇽',
    description: 'Spicy, cilantro, lime, beans',
  },
  {
    id: 3,
    name: 'Japanese',
    emoji: '🇯🇵',
    description: 'Umami, delicate, fish, rice',
  },
  {
    id: 4,
    name: 'Mediterranean',
    emoji: '🫒',
    description: 'Olive oil, fresh, grilled',
  },
  {
    id: 5,
    name: 'American',
    emoji: '🇺🇸',
    description: 'Comfort, grilled, hearty',
  },
];

const tagToCuisineId: Record<string, number> = {
  italian: 1,
  mexican: 2,
  japanese: 3,
  mediterranean: 4,
  american: 5,
};

export function cuisineForTag(tag: string): Cuisine | undefined {
  const id = tagToCuisineId[tag];
  return id ? cuisines.find((c) => c.id === id) : undefined;
}
