import { AppStateSnapshot, ISODate, DayCompletionState, DayJournalEntry, VictoryLogEntry } from '../types';
import { format } from 'date-fns';

const STORAGE_KEY = 'vc_app_state_v1';

const INITIAL_STATE: AppStateSnapshot = {
  settings: {
    onboardingCompleted: false,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationsEnabled: false,
    theme: 'system',
  },
  days: {},
  journals: {},
  victoryLogs: {},
  memorization: [],
  lastOpenedAt: new Date().toISOString(),
  schemaVersion: 1,
};

export const storageService = {
  async loadAppState(): Promise<AppStateSnapshot> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_STATE;
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse app state', e);
      return INITIAL_STATE;
    }
  },

  async saveAppState(snapshot: AppStateSnapshot): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      console.error('Failed to save app state', e);
      // Optional: could dispatch a custom event or use a toast here if needed
    }
  },

  async resetAppState(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
};
