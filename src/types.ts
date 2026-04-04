export type ISODate = string;
export type DayPart = 'morning' | 'midday' | 'evening';

export interface UserSettings {
  onboardingCompleted: boolean;
  startDate: ISODate;
  timezone: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface DaySessionPhase {
  id: 'read' | 'reflect' | 'pray' | 'rest' | 'ritual' | 'recite' | 'aloud';
  completed: boolean;
  completedAt?: string;
}

export interface DayCompletionState {
  dayKey: ISODate;
  dayName: string;
  theme: string;
  verseRef: string;
  dayRating?: number;
  morning: {
    phases: DaySessionPhase[];
    completed: boolean;
    currentStep?: number;
  };
  midday: {
    completed: boolean;
    response?: 'pressing' | 'mixed' | 'drifting';
    note?: string;
  };
  evening: {
    completed: boolean;
    reflectionNote?: string;
  };
}

export interface DayJournalEntry {
  dayKey: ISODate;
  dayName: string;
  theme: string;
  morningNotes?: string;
  middayNotes?: string;
  eveningNotes?: string;
  dayRating?: number;
}

export interface VictoryLogEntry {
  weekId: string;
  startDate: ISODate;
  surrender?: string;
  focus?: string;
  discipline?: string;
  alignment?: string;
  victory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemorizationStatus {
  verseId: string;
  reference: string;
  weekIndex: number;
  targetDate?: ISODate;
  memorized: boolean;
  memorizedAt?: string;
}

export interface AppStateSnapshot {
  settings: UserSettings;
  days: Record<ISODate, DayCompletionState>;
  journals: Record<ISODate, DayJournalEntry>;
  victoryLogs: Record<string, VictoryLogEntry>;
  memorization: MemorizationStatus[];
  lastOpenedAt: string;
  schemaVersion: number;
}

export interface DayConfig {
  dayOfWeek: number; // 1=Monday .. 7=Sunday
  name: string;
  theme: string;
  themeDescription: string;
  verseRef: string;
  verseText: string;
  keyPhrase: string;
  morningSession: {
    phase1: {
      instruction: string;
      question: string;
    };
    phase2: {
      prompts: string[];
    };
    phase3: {
      acts: {
        adoration: string;
        confession: string;
        thanksgiving: string;
        supplication: string;
      };
    };
    phase4: {
      instruction: string;
    };
  };
  middayCheckin: {
    question: string;
    prayer: string;
  };
  eveningReflection: {
    question: string;
    instruction: string;
  };
  declarations: {
    morning: string;
    evening: string;
  };
}
