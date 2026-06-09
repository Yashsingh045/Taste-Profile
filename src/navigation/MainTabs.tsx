import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BottomNav, TabKey } from '../components/BottomNav';
import { IntroScreen } from '../screens/IntroScreen';
import { FaqScreen } from '../screens/FaqScreen';
import { TasteProfileScreen } from '../screens/TasteProfileScreen';
import { useUi } from '../context/UiContext';
import { RootStackParamList } from './types';

export function MainTabs() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { activeTab, setActiveTab } = useUi();

  const goToSwipe = () => navigation.navigate('Swipe');

  return (
    <View style={styles.root}>
      <View style={styles.screen}>
        {activeTab === 'start' && <IntroScreen onStart={goToSwipe} />}
        {activeTab === 'faq' && <FaqScreen />}
        {activeTab === 'taste' && <TasteProfileScreen />}
      </View>
      <BottomNav
        active={activeTab}
        onSelect={(key: TabKey) => setActiveTab(key)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
