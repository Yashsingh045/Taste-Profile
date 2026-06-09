import React, { forwardRef, useImperativeHandle } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from './GlassCard';
import { Food, SwipeAction } from '../types/food';
import { colors, radius, spacing, typography } from '../theme';

const SWIPE_X_THRESHOLD = 110;
const SWIPE_Y_THRESHOLD = 110;
const FLY_DURATION = 220;
const BADGE_FADE_IN = 80;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export interface SwipeCardHandle {
  swipe: (action: SwipeAction) => void;
}

interface Props {
  food: Food;
  onSwiped: (action: SwipeAction) => void;
  isTop: boolean;
  stackOffset?: number;
}

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { food, onSwiped, isTop, stackOffset = 0 },
  ref,
) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerSwiped = (action: SwipeAction) => {
    onSwiped(action);
  };

  const flyOff = (action: SwipeAction) => {
    'worklet';
    let targetX = 0;
    let targetY = 0;
    if (action === 'like') {
      targetX = screenWidth * 1.2;
    } else if (action === 'dislike') {
      targetX = -screenWidth * 1.2;
    } else if (action === 'super') {
      targetY = -screenHeight;
    } else if (action === 'skip') {
      targetY = screenHeight * 0.9;
    }
    translateX.value = withTiming(targetX, { duration: FLY_DURATION });
    translateY.value = withTiming(targetY, { duration: FLY_DURATION });
    opacity.value = withTiming(0, { duration: FLY_DURATION }, () => {
      runOnJS(triggerSwiped)(action);
    });
  };

  useImperativeHandle(ref, () => ({
    swipe: (action) => flyOff(action),
  }));

  const pan = Gesture.Pan()
    .enabled(isTop)
    .activeOffsetX([-8, 8])
    .activeOffsetY([-8, 8])
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd(() => {
      const x = translateX.value;
      const y = translateY.value;
      const verticalDominant = Math.abs(y) > Math.abs(x) * 0.8;

      if (verticalDominant && y < -SWIPE_Y_THRESHOLD) {
        flyOff('super');
        return;
      }
      if (verticalDominant && y > SWIPE_Y_THRESHOLD) {
        flyOff('skip');
        return;
      }
      if (x > SWIPE_X_THRESHOLD) {
        flyOff('like');
        return;
      }
      if (x < -SWIPE_X_THRESHOLD) {
        flyOff('dislike');
        return;
      }
      translateX.value = withSpring(0, { damping: 16, stiffness: 180 });
      translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP,
    );
    const scale = isTop ? 1 : 1 - stackOffset * 0.04;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + stackOffset * 12 },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity: opacity.value,
    };
  });

  const yesStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, BADGE_FADE_IN], [0, 1], Extrapolation.CLAMP),
  }));
  const noStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-BADGE_FADE_IN, 0], [1, 0], Extrapolation.CLAMP),
  }));
  const superStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-BADGE_FADE_IN, 0], [1, 0], Extrapolation.CLAMP),
  }));
  const unsureStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, BADGE_FADE_IN], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.absoluteFill, animatedStyle]} pointerEvents={isTop ? 'auto' : 'none'}>
        <GlassCard style={styles.card} borderRadius={radius.xxl}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.imageRing} pointerEvents="none" />
          </View>
          <Text style={styles.text}>I love eating {food.name.toLowerCase()}</Text>

          <Animated.View style={[styles.blob, styles.blobNo, noStyle]} pointerEvents="none">
            <Text style={styles.blobTextDark}>No</Text>
          </Animated.View>

          <Animated.View style={[styles.blob, styles.blobYes, yesStyle]} pointerEvents="none">
            <Text style={styles.blobTextDark}>Yes</Text>
          </Animated.View>

          <AnimatedLinearGradient
            colors={['#3B5BFF', '#9B5BD6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.superPill, superStyle]}
            pointerEvents="none"
          >
            <Text style={styles.superText}>Superlike </Text>
            <Text style={styles.superStar}>🌟</Text>
          </AnimatedLinearGradient>

          <Animated.View style={[styles.unsurePill, unsureStyle]} pointerEvents="none">
            <Text style={styles.unsureText}>Unsure</Text>
          </Animated.View>
        </GlassCard>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xxl,
  },
  imageWrap: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: colors.surfaceStrong,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  text: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  blob: {
    position: 'absolute',
    top: 36,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobNo: {
    left: 28,
    backgroundColor: '#F44C3D',
    transform: [{ rotate: '-14deg' }],
  },
  blobYes: {
    right: 28,
    backgroundColor: '#5BD688',
    transform: [{ rotate: '14deg' }],
  },
  blobTextDark: {
    ...typography.button,
    color: '#0A0A0A',
    fontSize: 24,
    lineHeight: 26,
  },
  superPill: {
    position: 'absolute',
    top: 36,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
  },
  superText: {
    ...typography.button,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
  },
  superStar: {
    fontSize: 20,
    lineHeight: 24,
  },
  unsurePill: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E5E5E5',
  },
  unsureText: {
    ...typography.button,
    color: '#1A1A1A',
    fontSize: 18,
    lineHeight: 22,
  },
});
