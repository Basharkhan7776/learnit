import type { AppSettings } from '../types/exercise';

const STORAGE_KEYS = {
  CURRENT_EXERCISE: 'scripter_v1_current_exercise',
  USER_CODE: 'scripter_v1_user_code',
  COMPLETED: 'scripter_v1_completed_ids',
  BOOKMARKS: 'scripter_v1_bookmarks',
  NOTES: 'scripter_v1_notes',
  SETTINGS: 'scripter_v1_settings',
  ACTIVITY: 'scripter_v1_activity_history',
  INSTRUCTIONS_FONT_SIZE: 'scripter_v1_instructions_font_size',
  TERMINAL_FONT_SIZE: 'scripter_v1_terminal_font_size',
};

export function detectPlatform(): 'mac' | 'windows' {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const nav = navigator as any;
    const p = nav.userAgentData?.platform || nav.platform || nav.userAgent || '';
    if (/Mac|iPhone|iPad|iPod/i.test(p)) {
      return 'mac';
    }
  }
  return 'windows';
}

export const DEFAULT_SETTINGS: AppSettings = {
  vimMode: false,
  fontSize: 14,
  theme: 'dark',
  autoRunOnLoad: false,
  keymapPlatform: detectPlatform(),
};

export interface LocalStorageSnapshot {
  version: 1;
  exportedAt: string;
  completedIds: string[];
  userCode: Record<string, string>;
  bookmarks: string[];
  notes: Record<string, string>;
  settings: AppSettings;
  activityHistory?: Record<string, number>;
}

export function getStoredCurrentExercise(fallbackId: string): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_EXERCISE) || fallbackId;
  } catch {
    return fallbackId;
  }
}

export function setStoredCurrentExercise(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EXERCISE, id);
  } catch {}
}

export function getStoredUserCodes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_CODE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredUserCode(id: string, code: string): void {
  try {
    const all = getStoredUserCodes();
    all[id] = code;
    localStorage.setItem(STORAGE_KEYS.USER_CODE, JSON.stringify(all));
  } catch {}
}

export function removeStoredUserCode(id: string): void {
  try {
    const all = getStoredUserCodes();
    delete all[id];
    localStorage.setItem(STORAGE_KEYS.USER_CODE, JSON.stringify(all));
  } catch {}
}

export function getStoredCompletedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setStoredCompletedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(ids));
  } catch {}
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setStoredBookmarks(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(ids));
  } catch {}
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

export function getActivityHistory(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordDailyActivity(): Record<string, number> {
  try {
    const history = getActivityHistory();
    const today = new Date().toISOString().split('T')[0];
    history[today] = (history[today] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(history));
    return history;
  } catch {
    return {};
  }
}

export function getStoredInstructionsFontSize(defaultSize: number = 12): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSTRUCTIONS_FONT_SIZE);
    return raw ? parseInt(raw, 10) : defaultSize;
  } catch {
    return defaultSize;
  }
}

export function setStoredInstructionsFontSize(size: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTIONS_FONT_SIZE, size.toString());
  } catch {}
}

export function getStoredTerminalFontSize(defaultSize: number = 12): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TERMINAL_FONT_SIZE);
    return raw ? parseInt(raw, 10) : defaultSize;
  } catch {
    return defaultSize;
  }
}

export function setStoredTerminalFontSize(size: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TERMINAL_FONT_SIZE, size.toString());
  } catch {}
}

export function createProgressSnapshot(): LocalStorageSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedIds: getStoredCompletedIds(),
    userCode: getStoredUserCodes(),
    bookmarks: getStoredBookmarks(),
    notes: {},
    settings: getStoredSettings(),
    activityHistory: getActivityHistory(),
  };
}

export function restoreProgressSnapshot(snapshot: LocalStorageSnapshot): boolean {
  try {
    if (!snapshot || snapshot.version !== 1) return false;
    if (Array.isArray(snapshot.completedIds)) {
      setStoredCompletedIds(snapshot.completedIds);
    }
    if (snapshot.userCode && typeof snapshot.userCode === 'object') {
      localStorage.setItem(STORAGE_KEYS.USER_CODE, JSON.stringify(snapshot.userCode));
    }
    if (Array.isArray(snapshot.bookmarks)) {
      setStoredBookmarks(snapshot.bookmarks);
    }
    if (snapshot.settings) {
      saveStoredSettings(snapshot.settings);
    }
    if (snapshot.activityHistory) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(snapshot.activityHistory));
    }
    return true;
  } catch {
    return false;
  }
}

export function exportProgressSnapshot(): string {
  return JSON.stringify(createProgressSnapshot(), null, 2);
}

export function importProgressSnapshot(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    return restoreProgressSnapshot(parsed);
  } catch {
    return false;
  }
}

export function clearAllLocalProgress(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch {}
}
