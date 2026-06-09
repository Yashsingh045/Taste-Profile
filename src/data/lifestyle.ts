export interface LifestyleGoal {
  label: string;
  active: boolean;
}

export const defaultLifestyleGoals: LifestyleGoal[] = [
  { label: 'Active', active: true },
  { label: 'Gym-Goer', active: true },
  { label: 'Walks a lot', active: true },
  { label: 'PCOS & GI Diet', active: true },
];
