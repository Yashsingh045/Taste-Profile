export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'How does the taste profile work?',
    answer:
      'Swipe through foods you love and dislike. We use those choices to recommend meals that match your taste — no boring food on your menu.',
  },
  {
    question: 'How long does it take?',
    answer: 'About 2 minutes. There are 30 foods to swipe through.',
  },
  {
    question: 'Can I change my preferences later?',
    answer: 'Yes — head to your Taste Profile and re-run the swipe flow any time. Your latest swipes always win.',
  },
  {
    question: 'What do the four buttons mean?',
    answer:
      '❤️ Swipe Right = I love it. ❌ Swipe Left = I dislike it. ❓ Not Sure = skip it. ⭐ Super Like = absolute favorite, count it twice.',
  },
  {
    question: 'Does the app work offline?',
    answer:
      'Yes — all food data is bundled in the app. Only the food photos load from the web, so a connection is recommended for the prettiest experience.',
  },
];
