/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { Profile, Settings } from '../types/task';
import { usePersistentState } from '../utils/storage';

interface AppContextValue {
  profile: Profile;
  settings: Settings;
  loggedIn: boolean;
  updateProfile: (changes: Partial<Profile>) => void;
  updateSettings: (changes: Partial<Settings>) => void;
  login: (displayName: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_PROFILE: Profile = {
  displayName: 'Tyo Dzaky',
  fullName: 'Tyo Dzaky Kamaludin',
  nim: '251111009',
  email: '',
  campus: '',
};

const DEFAULT_SETTINGS: Settings = { motion: true, reminders: true };

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersistentState<Profile>(
    'tugasku:v2:profile',
    () => DEFAULT_PROFILE,
  );
  const [settings, setSettings] = usePersistentState<Settings>(
    'tugasku:v2:settings',
    () => DEFAULT_SETTINGS,
  );
  const [loggedIn, setLoggedIn] = usePersistentState<boolean>(
    'tugasku:v2:session',
    () => true,
  );

  // Animasi cahaya background dibaca oleh CSS lewat atribut ini.
  useEffect(() => {
    document.documentElement.dataset.motion = settings.motion ? 'on' : 'off';
  }, [settings.motion]);

  const value: AppContextValue = {
    profile,
    settings,
    loggedIn,
    updateProfile: (changes) => setProfile((prev) => ({ ...prev, ...changes })),
    updateSettings: (changes) => setSettings((prev) => ({ ...prev, ...changes })),
    login: (displayName) => {
      const name = displayName.trim();
      if (name) setProfile((prev) => ({ ...prev, displayName: name }));
      setLoggedIn(true);
    },
    logout: () => setLoggedIn(false),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp harus dipakai di dalam AppProvider');
  return context;
}
