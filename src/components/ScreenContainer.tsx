import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from './GradientBackground';

interface Props {
  children: React.ReactNode;
  withTopInset?: boolean;
  withBottomInset?: boolean;
  contentStyle?: ViewStyle;
}

export function ScreenContainer({
  children,
  withTopInset = true,
  withBottomInset = true,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <GradientBackground>
      <View
        style={[
          styles.content,
          withTopInset && { paddingTop: insets.top },
          withBottomInset && { paddingBottom: insets.bottom },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
