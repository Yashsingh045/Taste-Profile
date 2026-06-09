import React, { createContext, useContext, useMemo, useState } from 'react';
import { TabKey } from '../components/BottomNav';

interface UiContextValue {
  activeTab: TabKey;
  setActiveTab: (key: TabKey) => void;
}

const UiContext = createContext<UiContextValue | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabKey>('start');
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within a UiProvider');
  return ctx;
}
