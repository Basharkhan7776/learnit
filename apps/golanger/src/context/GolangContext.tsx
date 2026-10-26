import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import rawExercises from '../data/exercises.json';
import type { Exercise, CompileResult, AppSettings } from '../types/exercise';
import {
  getStoredCurrentExercise,
  setStoredCurrentExercise,
  getStoredUserCodes,
  saveStoredUserCode,
  removeStoredUserCode,
  getStoredCompletedIds,
  setStoredCompletedIds,
  getStoredBookmarks,
  setStoredBookmarks,
  getStoredSettings,
  saveStoredSettings,
  getActivityHistory,
  recordDailyActivity,
  clearAllLocalProgress,
} from '../lib/storage';
import { executeGoCode } from '../services/compiler';

const exercises: Exercise[] = rawExercises as Exercise[];

export type MobileTab = 'code' | 'terminal' | 'theory' | 'hint' | 'solution';

interface GolangContextValue {
  exercises: Exercise[];
  currentExercise: Exercise;
  currentCode: string;
  setCurrentExerciseId: (id: string) => void;
  nextExercise: () => void;
  prevExercise: () => void;
  updateCode: (code: string) => void;
  resetCurrentCode: () => void;
  applySolution: () => void;
  completedIds: Set<string>;
  toggleCompleted: (id: string) => void;
  bookmarkedIds: Set<string>;
  toggleBookmark: (id: string) => void;
  runCode: (codeOverride?: string) => Promise<void>;
  isRunning: boolean;
  lastResult: CompileResult | null;
  clearLastResult: () => void;
  completedCount: number;
  totalCount: number;
  activityHistory: Record<string, number>;
  filter: 'all' | 'pending' | 'completed' | 'bookmarked';
  setFilter: (f: 'all' | 'pending' | 'completed' | 'bookmarked') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  terminalCollapsed: boolean;
  setTerminalCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTerminal: () => void;
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileSidebar: () => void;
  getShortcut: (mac: string, win: string) => string;
  showCommandPalette: boolean;
  setShowCommandPalette: (b: boolean) => void;
  showSolutionModal: boolean;
  setShowSolutionModal: (b: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (b: boolean) => void;
  showResetModal: boolean;
  setShowResetModal: (b: boolean) => void;
  resetAllProgress: () => void;
  isEditorFocused: boolean;
  setIsEditorFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

const GolangContext = createContext<GolangContextValue | null>(null);

export function GolangProvider({ children }: { children: React.ReactNode }) {
  const [currentId, setCurrentId] = useState<string>(() => {
    return getStoredCurrentExercise(exercises[0]?.id || 'intro1');
  });

  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    return new Set(getStoredCompletedIds());
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    return new Set(getStoredBookmarks());
  });

  const [userCodes, setUserCodes] = useState<Record<string, string>>(() => {
    return getStoredUserCodes();
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    return getStoredSettings();
  });

  const [activityHistory, setActivityHistory] = useState<Record<string, number>>(() => {
    return getActivityHistory();
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<CompileResult | null>(null);

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(false);

  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [showSolutionModal, setShowSolutionModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [terminalCollapsed, setTerminalCollapsed] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('code');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalCollapsed(prev => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(prev => !prev);
  }, []);

  const getShortcut = useCallback(
    (mac: string, win: string) => {
      return settings.keymapPlatform === 'mac' ? mac : win;
    },
    [settings.keymapPlatform]
  );

  const currentExercise = exercises.find(e => e.id === currentId) || exercises[0];

  const currentCode = userCodes[currentExercise.id] !== undefined
    ? userCodes[currentExercise.id]
    : currentExercise.starterCode;

  const setCurrentExerciseId = useCallback((id: string) => {
    const target = exercises.find(e => e.id === id);
    if (target) {
      setCurrentId(id);
      setStoredCurrentExercise(id);
      setLastResult(null);
      setMobileSidebarOpen(false);
    }
  }, []);

  const nextExercise = useCallback(() => {
    const curIdx = exercises.findIndex(e => e.id === currentExercise.id);
    if (curIdx < exercises.length - 1) {
      setCurrentExerciseId(exercises[curIdx + 1].id);
    }
  }, [currentExercise.id, setCurrentExerciseId]);

  const prevExercise = useCallback(() => {
    const curIdx = exercises.findIndex(e => e.id === currentExercise.id);
    if (curIdx > 0) {
      setCurrentExerciseId(exercises[curIdx - 1].id);
    }
  }, [currentExercise.id, setCurrentExerciseId]);

  const updateCode = useCallback((code: string) => {
    setUserCodes(prev => ({
      ...prev,
      [currentExercise.id]: code,
    }));
    saveStoredUserCode(currentExercise.id, code);
  }, [currentExercise.id]);

  const resetCurrentCode = useCallback(() => {
    setUserCodes(prev => {
      const next = { ...prev };
      delete next[currentExercise.id];
      return next;
    });
    removeStoredUserCode(currentExercise.id);
    setLastResult(null);
  }, [currentExercise.id]);

  const applySolution = useCallback(() => {
    if (currentExercise.solutionCode) {
      updateCode(currentExercise.solutionCode);
    }
  }, [currentExercise.solutionCode, updateCode]);

  const toggleCompleted = useCallback((id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const updatedActivity = recordDailyActivity();
        setActivityHistory({ ...updatedActivity });
      }
      setStoredCompletedIds(Array.from(next));
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setStoredBookmarks(Array.from(next));
      return next;
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  const runCode = useCallback(async (codeOverride?: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setLastResult(null);

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileTab('terminal');
    }

    const codeToRun = codeOverride !== undefined ? codeOverride : currentCode;
    if (codeOverride !== undefined && codeOverride !== currentCode) {
      updateCode(codeOverride);
    }

    try {
      const result = await executeGoCode(codeToRun, currentExercise.mode);
      setLastResult(result);

      if (result.success) {
        setCompletedIds(prev => {
          if (!prev.has(currentExercise.id)) {
            const next = new Set(prev);
            next.add(currentExercise.id);
            setStoredCompletedIds(Array.from(next));
            const updated = recordDailyActivity();
            setActivityHistory({ ...updated });
            return next;
          }
          return prev;
        });

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00ADD8', '#00D4FF', '#ffffff', '#22c55e'],
        });
      }
    } catch (e: any) {
      setLastResult({
        success: false,
        stdout: '',
        stderr: e?.message || 'Execution error',
        exitDetail: 'Failed',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [currentCode, currentExercise.id, currentExercise.mode, isRunning, updateCode]);

  const resetAllProgress = useCallback(() => {
    clearAllLocalProgress();
    setCompletedIds(new Set());
    setBookmarkedIds(new Set());
    setUserCodes({});
    setActivityHistory({});
    setCurrentId(exercises[0]?.id || 'intro1');
    setLastResult(null);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      const isAnyModalOpen =
        showCommandPalette || showSettingsModal || showSolutionModal || showResetModal || mobileSidebarOpen;

      if (e.key === 'Escape') {
        if (mobileSidebarOpen) setMobileSidebarOpen(false);
        if (showCommandPalette) setShowCommandPalette(false);
        if (showSettingsModal) setShowSettingsModal(false);
        if (showSolutionModal) setShowSolutionModal(false);
        if (showResetModal) setShowResetModal(false);
        return;
      }

      if (isAnyModalOpen) {
        return;
      }

      // Sidebar Toggle: Ctrl+B or Cmd+B
      if (isCmdOrCtrl && (key === 'b' || e.key === '\\')) {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Terminal Toggle: Ctrl+J or Cmd+J
      if (isCmdOrCtrl && key === 'j') {
        e.preventDefault();
        toggleTerminal();
        return;
      }

      // Run code: Cmd+Enter or Ctrl+Enter
      if (isCmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        return;
      }

      // Command Palette: Cmd+K or Ctrl+K
      if (isCmdOrCtrl && key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        return;
      }

      // Next / Previous navigation: Alt+Right / Alt+Left
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        nextExercise();
        return;
      }
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        prevExercise();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showCommandPalette,
    showSettingsModal,
    showSolutionModal,
    showResetModal,
    mobileSidebarOpen,
    toggleSidebar,
    toggleTerminal,
    runCode,
    nextExercise,
    prevExercise,
  ]);

  return (
    <GolangContext.Provider
      value={{
        exercises,
        currentExercise,
        currentCode,
        setCurrentExerciseId,
        nextExercise,
        prevExercise,
        updateCode,
        resetCurrentCode,
        applySolution,
        completedIds,
        toggleCompleted,
        bookmarkedIds,
        toggleBookmark,
        runCode,
        isRunning,
        lastResult,
        clearLastResult: () => setLastResult(null),
        completedCount: completedIds.size,
        totalCount: exercises.length,
        activityHistory,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        settings,
        updateSettings,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        terminalCollapsed,
        setTerminalCollapsed,
        toggleTerminal,
        mobileTab,
        setMobileTab,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        toggleMobileSidebar,
        getShortcut,
        showCommandPalette,
        setShowCommandPalette,
        showSolutionModal,
        setShowSolutionModal,
        showSettingsModal,
        setShowSettingsModal,
        showResetModal,
        setShowResetModal,
        resetAllProgress,
        isEditorFocused,
        setIsEditorFocused,
      }}
    >
      {children}
    </GolangContext.Provider>
  );
}

export function useGolang() {
  const ctx = useContext(GolangContext);
  if (!ctx) {
    throw new Error('useGolang must be used within a GolangProvider');
  }
  return ctx;
}
