import React, { useState } from "react";
import { Cloud, CloudOff, RefreshCw, Check, LogOut, User } from "lucide-react";
import type { SyncStatus, UserSession } from "./types";

interface CloudSyncBadgeProps {
  session: UserSession | null;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  onSyncNow: () => void;
  onLogout: () => void;
  onOpenLogin?: () => void;
  webLoginUrl?: string;
}

export const CloudSyncBadge: React.FC<CloudSyncBadgeProps> = ({
  session,
  syncStatus,
  lastSyncedAt,
  onSyncNow,
  onLogout,
  onOpenLogin,
  webLoginUrl = "http://localhost:3000",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) {
    const handleLoginClick = () => {
      if (onOpenLogin) {
        onOpenLogin();
      } else {
        window.open(webLoginUrl, "_blank");
      }
    };

    return (
      <button
        onClick={handleLoginClick}
        title="Log in on Learnit Web to enable cloud sync"
        className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <CloudOff className="w-3.5 h-3.5 text-zinc-500" />
        <span>Log in to Sync</span>
      </button>
    );
  }

  const displayName = session.username || session.name || session.email.split("@")[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80 transition-colors cursor-pointer"
      >
        {syncStatus === "syncing" ? (
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        ) : syncStatus === "synced" ? (
          <Cloud className="w-3.5 h-3.5 text-emerald-400" />
        ) : syncStatus === "error" ? (
          <CloudOff className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <Cloud className="w-3.5 h-3.5 text-zinc-400" />
        )}
        <span className="truncate max-w-[120px]">{displayName}</span>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-56 rounded-md border border-zinc-800 bg-[#121215] p-2 text-zinc-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1.5 border-b border-zinc-800/80 mb-1">
              <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>{displayName}</span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                {session.email}
              </div>
            </div>

            <div className="px-2 py-1 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Status:</span>
              <span className="font-medium text-zinc-300 capitalize flex items-center gap-1">
                {syncStatus === "synced" && <Check className="w-3 h-3 text-emerald-400" />}
                {syncStatus}
              </span>
            </div>

            {lastSyncedAt && (
              <div className="px-2 py-0.5 text-[10px] text-zinc-500">
                Synced {lastSyncedAt.toLocaleTimeString()}
              </div>
            )}

            <div className="border-t border-zinc-800/80 my-1.5" />

            <button
              onClick={() => {
                onSyncNow();
                setMenuOpen(false);
              }}
              disabled={syncStatus === "syncing"}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors text-left cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
              <span>Sync Now</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
