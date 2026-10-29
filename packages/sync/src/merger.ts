import type { LocalStorageSnapshot } from "./types";

export function mergeSnapshots(
  local: LocalStorageSnapshot | null,
  remote: Partial<LocalStorageSnapshot> | null
): LocalStorageSnapshot {
  const fallbackSettings = {
    vimMode: false,
    fontSize: 14,
    theme: "dark",
    autoRunOnLoad: false,
    keymapPlatform: "windows" as const,
  };

  if (!remote && !local) {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      completedIds: [],
      userCode: {},
      bookmarks: [],
      notes: {},
      settings: fallbackSettings,
    };
  }

  if (!remote) return local!;
  if (!local) {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      completedIds: Array.isArray(remote.completedIds) ? remote.completedIds : [],
      userCode: (remote.userCode && typeof remote.userCode === "object") ? remote.userCode : {},
      bookmarks: Array.isArray(remote.bookmarks) ? remote.bookmarks : [],
      notes: (remote.notes && typeof remote.notes === "object") ? remote.notes : {},
      settings: { ...fallbackSettings, ...(remote.settings || {}) },
      activityHistory: remote.activityHistory || {},
      currentExerciseId: remote.currentExerciseId,
    };
  }

  // Union of completed IDs
  const completedIds = Array.from(
    new Set([...(local.completedIds || []), ...(remote.completedIds || [])])
  );

  // Union of bookmarks
  const bookmarks = Array.from(
    new Set([...(local.bookmarks || []), ...(remote.bookmarks || [])])
  );

  // Merge userCode: remote first, then overwrite with local if non-empty
  const userCode: Record<string, string> = {
    ...(remote.userCode || {}),
    ...(local.userCode || {}),
  };

  // Merge notes
  const notes: Record<string, string> = {
    ...(remote.notes || {}),
    ...(local.notes || {}),
  };

  // Merge settings
  const settings = {
    ...fallbackSettings,
    ...(remote.settings || {}),
    ...(local.settings || {}),
  };

  // Merge activityHistory
  const activityHistory: Record<string, number> = {};
  const allDates = new Set([
    ...Object.keys(local.activityHistory || {}),
    ...Object.keys(remote.activityHistory || {}),
  ]);
  for (const date of allDates) {
    activityHistory[date] = Math.max(
      local.activityHistory?.[date] || 0,
      remote.activityHistory?.[date] || 0
    );
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedIds,
    userCode,
    bookmarks,
    notes,
    settings,
    activityHistory,
    currentExerciseId: local.currentExerciseId || remote.currentExerciseId,
  };
}
