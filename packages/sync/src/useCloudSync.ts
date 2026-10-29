import { useEffect, useState, useRef, useCallback } from "react";
import { authClient, API_BASE_URL } from "./auth-client";
import { mergeSnapshots } from "./merger";
import type { LocalStorageSnapshot, SyncStatus, UserSession } from "./types";

interface UseCloudSyncOptions {
  appName: "rustal" | "golanger" | "scripter";
  getLocalSnapshot: () => LocalStorageSnapshot;
  onRemoteUpdate: (snapshot: LocalStorageSnapshot) => void;
  debounceMs?: number;
}

export function useCloudSync({
  appName,
  getLocalSnapshot,
  onRemoteUpdate,
  debounceMs = 1500,
}: UseCloudSyncOptions) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("checking");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialPullDoneRef = useRef(false);
  const isSyncingRef = useRef(false);

  // Push local snapshot to backend
  const pushSnapshot = useCallback(
    async (snapshotToPush?: LocalStorageSnapshot) => {
      if (!session) return;
      try {
        setSyncStatus("syncing");
        const currentSnapshot = snapshotToPush || getLocalSnapshot();
        const res = await fetch(`${API_BASE_URL}/api/sync/${appName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            snapshot: currentSnapshot,
            currentExerciseId: currentSnapshot.currentExerciseId,
          }),
        });

        if (res.ok) {
          setSyncStatus("synced");
          setLastSyncedAt(new Date());
        } else {
          setSyncStatus("error");
        }
      } catch (err) {
        console.error(`[${appName} CloudSync] Push error:`, err);
        setSyncStatus("error");
      }
    },
    [appName, getLocalSnapshot, session]
  );

  // Pull remote snapshot, merge with local, and update
  const pullAndMerge = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncStatus("syncing");

    try {
      const res = await fetch(`${API_BASE_URL}/api/sync/${appName}`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          setSession(null);
          setSyncStatus("unauthenticated");
        } else {
          setSyncStatus("error");
        }
        isSyncingRef.current = false;
        return;
      }

      const data = await res.json();
      const local = getLocalSnapshot();

      if (data.progress) {
        const merged = mergeSnapshots(local, data.progress);
        onRemoteUpdate(merged);

        // If local had un-synced items, push merged back to cloud
        const localCompletedCount = local?.completedIds?.length || 0;
        const remoteCompletedCount = data.progress.completedIds?.length || 0;
        if (localCompletedCount > remoteCompletedCount) {
          await pushSnapshot(merged);
        }
      } else if (local && local.completedIds && local.completedIds.length > 0) {
        // Cloud is empty but local has work, initialize cloud
        await pushSnapshot(local);
      }

      setSyncStatus("synced");
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error(`[${appName} CloudSync] Pull error:`, err);
      setSyncStatus("error");
    } finally {
      isSyncingRef.current = false;
    }
  }, [appName, getLocalSnapshot, onRemoteUpdate, pushSnapshot]);

  // Check active session via Better Auth
  const checkSession = useCallback(async () => {
    try {
      const sessionResult = await authClient.getSession();
      const user = sessionResult.data?.user;

      if (user) {
        const userObj: UserSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: (user as any).username || null,
          image: user.image,
        };

        setSession(prev => {
          if (!prev || prev.id !== userObj.id) {
            // New login detected! Trigger initial pull & merge
            isInitialPullDoneRef.current = false;
            setTimeout(() => {
              pullAndMerge();
            }, 50);
            return userObj;
          }
          return prev;
        });

        if (!isInitialPullDoneRef.current) {
          isInitialPullDoneRef.current = true;
          pullAndMerge();
        }
      } else {
        setSession(null);
        setSyncStatus("unauthenticated");
        isInitialPullDoneRef.current = false;
      }
    } catch (err) {
      console.warn(`[${appName} CloudSync] Session check error:`, err);
      setSyncStatus("unauthenticated");
    }
  }, [appName, pullAndMerge]);

  // Debounced trigger to queue push after local state changes
  const queuePush = useCallback(() => {
    if (!session) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSyncStatus("syncing");
    debounceTimerRef.current = setTimeout(() => {
      pushSnapshot();
    }, debounceMs);
  }, [debounceMs, pushSnapshot, session]);

  // Re-check session on mount, focus, and visibilitychange
  useEffect(() => {
    checkSession();

    const handleFocus = () => {
      checkSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = setInterval(checkSession, 30000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [checkSession]);

  const logout = useCallback(async () => {
    await authClient.signOut();
    setSession(null);
    setSyncStatus("unauthenticated");
  }, []);

  return {
    session,
    syncStatus,
    lastSyncedAt,
    queuePush,
    syncNow: pullAndMerge,
    logout,
    checkSession,
  };
}
