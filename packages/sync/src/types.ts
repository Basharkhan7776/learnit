export interface AppSettings {
  vimMode: boolean;
  fontSize: number;
  theme: string;
  autoRunOnLoad: boolean;
  keymapPlatform: 'mac' | 'windows';
}

export interface LocalStorageSnapshot {
  version: 1;
  exportedAt: string;
  completedIds: string[];
  userCode: Record<string, string>;
  bookmarks: string[];
  notes: Record<string, string>;
  settings: AppSettings;
  activityHistory?: Record<string, number>;
  currentExerciseId?: string;
}

export type SyncStatus = 'idle' | 'checking' | 'syncing' | 'synced' | 'error' | 'unauthenticated';

export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}
