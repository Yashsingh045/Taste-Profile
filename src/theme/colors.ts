export const colors = {
  background: '#000000',
  backgroundElevated: '#0A0A0A',
  surface: 'rgba(255, 255, 255, 0.04)',
  surfaceStrong: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.72)',
  textMuted: 'rgba(255, 255, 255, 0.50)',
  textDim: 'rgba(255, 255, 255, 0.32)',

  accent: '#4ADE80',
  accentSoft: 'rgba(74, 222, 128, 0.16)',
  accentGlow: 'rgba(74, 222, 128, 0.32)',
  onAccent: '#062B14',

  actionLike: '#22C55E',
  actionLikeGlow: 'rgba(34, 197, 94, 0.45)',
  actionDislike: '#EF4444',
  actionDislikeGlow: 'rgba(239, 68, 68, 0.45)',
  actionSuper: '#3B82F6',
  actionSuperGlow: 'rgba(59, 130, 246, 0.45)',
  actionSkip: 'rgba(255, 255, 255, 0.18)',
  actionSkipGlow: 'rgba(255, 255, 255, 0.10)',

  progressTrack: 'rgba(255, 255, 255, 0.12)',
  progressFill: '#4ADE80',

  gradientTop: '#0B1A14',
  gradientMid: '#000000',
  gradientGlowLeft: 'rgba(56, 95, 142, 0.18)',
  gradientGlowRight: 'rgba(48, 196, 119, 0.22)',
} as const;

export type ColorToken = keyof typeof colors;
