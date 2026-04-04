import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppStateSnapshot, ISODate, DayCompletionState, DayJournalEntry, VictoryLogEntry, MemorizationStatus, DaySessionPhase } from './types';
import { storageService } from './data/storageService';
import { format, startOfWeek, parseISO } from 'date-fns';
import { WEEK_CONFIG, MEMORIZATION_PLAN } from './config';

interface AppContextType {
  state: AppStateSnapshot;
  updateSettings: (settings: Partial<AppStateSnapshot['settings']>) => void;
  updateDayState: (date: ISODate, update: Partial<DayCompletionState>) => void;
  updateJournal: (date: ISODate, update: Partial<DayJournalEntry>) => void;
  updateVictoryLog: (weekId: string, update: Partial<VictoryLogEntry>) => void;
  toggleMemorized: (verseId: string) => void;
  resetApp: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppStateSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storageService.loadAppState().then(loaded => {
      // Initialize memorization if empty
      if (!loaded.memorization || loaded.memorization.length === 0) {
        loaded.memorization = MEMORIZATION_PLAN.map(v => ({
          verseId: v.verseId,
          reference: v.reference,
          weekIndex: v.weekIndex,
          memorized: false
        }));
      }
      setState(loaded);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (state) {
      storageService.saveAppState(state);
    }
  }, [state]);

  useEffect(() => {
    if (state) {
      const root = window.document.documentElement;
      const theme = state.settings.theme;
      
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state?.settings.theme]);

  const updateSettings = useCallback((settings: Partial<AppStateSnapshot['settings']>) => {
    setState(prev => prev ? ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }) : null);
  }, []);

  const updateDayState = useCallback((date: ISODate, update: Partial<DayCompletionState>) => {
    setState(prev => {
      if (!prev) return null;
      
      const [year, month, day] = date.split('-').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      const dayIndex = parsedDate.getDay() === 0 ? 6 : parsedDate.getDay() - 1;
      
      const isSaturday = dayIndex === 5;
      const initialPhases: DaySessionPhase[] = isSaturday 
        ? [
            { id: 'ritual', completed: false },
            { id: 'recite', completed: false },
            { id: 'pray', completed: false },
            { id: 'aloud', completed: false },
            { id: 'rest', completed: false },
          ]
        : [
            { id: 'read', completed: false },
            { id: 'reflect', completed: false },
            { id: 'pray', completed: false },
            { id: 'rest', completed: false },
          ];

      const existing = prev.days[date] || {
        dayKey: date,
        dayName: WEEK_CONFIG[dayIndex].name,
        theme: WEEK_CONFIG[dayIndex].theme,
        verseRef: WEEK_CONFIG[dayIndex].verseRef,
        morning: { phases: initialPhases, completed: false, currentStep: 0 },
        midday: { completed: false },
        evening: { completed: false },
      };

      const newDay = { ...existing, ...update };
      
      if (newDay.morning && newDay.morning.phases) {
        newDay.morning.completed = newDay.morning.phases.every((p) => p.completed);
      }

      return {
        ...prev,
        days: { ...prev.days, [date]: newDay }
      };
    });
  }, []);

  const updateJournal = useCallback((date: ISODate, update: Partial<DayJournalEntry>) => {
    setState(prev => {
      if (!prev) return null;
      const existing = prev.journals[date] || {
        dayKey: date,
        dayName: '',
        theme: '',
      };
      return {
        ...prev,
        journals: { ...prev.journals, [date]: { ...existing, ...update } }
      };
    });
  }, []);

  const updateVictoryLog = useCallback((weekId: string, update: Partial<VictoryLogEntry>) => {
    setState(prev => {
      if (!prev) return null;
      const existing = prev.victoryLogs[weekId] || {
        weekId,
        startDate: weekId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        victoryLogs: { ...prev.victoryLogs, [weekId]: { ...existing, ...update, updatedAt: new Date().toISOString() } }
      };
    });
  }, []);

  const toggleMemorized = useCallback((verseId: string) => {
    setState(prev => {
      if (!prev) return null;
      const existing = prev.memorization.find(m => m.verseId === verseId);
      if (existing) {
        return {
          ...prev,
          memorization: prev.memorization.map(m => m.verseId === verseId ? { ...m, memorized: !m.memorized, memorizedAt: !m.memorized ? new Date().toISOString() : undefined } : m)
        };
      } else {
        // This shouldn't happen if initialized correctly, but for safety:
        return {
          ...prev,
          memorization: [...prev.memorization, { verseId, reference: '', weekIndex: 0, memorized: true, memorizedAt: new Date().toISOString() }]
        };
      }
    });
  }, []);

  const resetApp = useCallback(async () => {
    await storageService.resetAppState();
    window.location.reload();
  }, []);

  if (!state && !isLoading) return null;

  return (
    <AppContext.Provider value={{ 
      state: state!, 
      updateSettings, 
      updateDayState, 
      updateJournal, 
      updateVictoryLog, 
      toggleMemorized, 
      resetApp,
      isLoading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
