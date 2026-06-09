import React from 'react';
import { NavigationContainer, DefaultTheme, NavigationProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { SwipeScreen } from '../screens/SwipeScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { useUi } from '../context/UiContext';
import { RootStackParamList } from './types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    border: colors.border,
    primary: colors.accent,
    text: colors.textPrimary,
    notification: colors.accent,
  },
};

function SwipeScreenContainer() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return <SwipeScreen onComplete={() => navigation.replace('Results')} />;
}

function ResultsScreenContainer() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setActiveTab } = useUi();
  return (
    <ResultsScreen
      onSeeProfile={() => {
        setActiveTab('taste');
        navigation.popToTop();
      }}
      onBack={() => {
        setActiveTab('start');
        navigation.popToTop();
      }}
    />
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Swipe" component={SwipeScreenContainer} />
        <Stack.Screen name="Results" component={ResultsScreenContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
