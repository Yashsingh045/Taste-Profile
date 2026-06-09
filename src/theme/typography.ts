import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const fontFamilyBold = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  display: {
    fontFamily: fontFamilyBold,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -0.5,
  } as TextStyle,
  title: {
    fontFamily: fontFamilyBold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  } as TextStyle,
  heading: {
    fontFamily: fontFamilyBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  } as TextStyle,
  subheading: {
    fontFamily: fontFamilyBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,
  bodyLg: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,
  tabLabel: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  } as TextStyle,
  button: {
    fontFamily: fontFamilyBold,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
