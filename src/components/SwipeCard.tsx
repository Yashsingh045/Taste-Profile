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
import { GlassCard } from './GlassCard';
import { Food, SwipeAction } from '../types/food';
import { colors, radius, spacing, typography } from '../theme';

const SWIPE_THRESHOLD = 110;
const SUPER_LIKE_Y_THRESHOLD = -90;
const FLY_DURATION = 220;

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
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerSwiped = (action: SwipeAction) => {
    onSwiped(action);
  };

  const flyOff = (action: SwipeAction) => {
    'worklet';
    const targetX =
      action === 'like' || action === 'super'
        ? screenWidth * 1.2
        : action === 'dislike'
          ? -screenWidth * 1.2
          : 0;
    const targetY = action === 'super' ? -screenWidth : action === 'skip' ? screenWidth * 0.8 : translateY.value;

    translateX.value = withTiming(targetX, { duration: FLY_DURATION });
    translateY.value = withTiming(targetY, { duration: FLY_DURATION });
    opacity.value = withTiming(0, { duration: FLY_DURATION }, () => {
      runOnJS(triggerSwiped)(action);
    });
  };

  useImperativeHandle(ref, () => ({
    swipe: (action) => {
      flyOff(action);
    },
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
      if (y < SUPER_LIKE_Y_THRESHOLD && Math.abs(x) < SWIPE_THRESHOLD) {
        flyOff('super');
        return;
      }
      if (x > SWIPE_THRESHOLD) {
        flyOff('like');
        return;
      }
      if (x < -SWIPE_THRESHOLD) {
        flyOff('dislike');
        return;
      }
      translateX.value = withSpring(0, { damping: 16, stiffness: 180 });
      translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-screenWidth / 2, 0, screenWidth / 2], [-12, 0, 12], Extrapolation.CLAMP);
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

  const likeBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 80], [0, 1], Extrapolation.CLAMP),
  }));
  const dislikeBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-80, 0], [1, 0], Extrapolation.CLAMP),
  }));
  const superBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-120, -40], [1, 0], Extrapolation.CLAMP),
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

          <Animated.View style={[styles.badge, styles.badgeLike, likeBadgeStyle]} pointerEvents="none">
            <Text style={styles.badgeText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.badge, styles.badgeDislike, dislikeBadgeStyle]} pointerEvents="none">
            <Text style={styles.badgeText}>NOPE</Text>
          </Animated.View>
          <Animated.View style={[styles.badgeSuper, superBadgeStyle]} pointerEvents="none">
            <Text style={styles.badgeText}>SUPER</Text>
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
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  text: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 3,
    transform: [{ rotate: '-12deg' }],
  },
  badgeLike: {
    right: 28,
    borderColor: colors.actionLike,
  },
  badgeDislike: {
    left: 28,
    borderColor: colors.actionDislike,
    transform: [{ rotate: '12deg' }],
  },
  badgeSuper: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.actionSuper,
  },
  badgeText: {
    ...typography.button,
    color: colors.textPrimary,
    fontSize: 22,
    letterSpacing: 2,
  },
});
