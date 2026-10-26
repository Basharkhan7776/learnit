import React, { useState, useRef } from 'react';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  HardDrive,
  Keyboard,
  Command,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { useGolang } from '../../context/GolangContext';
import { exportProgressSnapshot, importProgressSnapshot } from '../../lib/storage';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ActivityHeatmap } from '../ActivityHeatmap';

export const SettingsModal: React.FC = () => {
  const {
    showSettingsModal,
    setShowSettingsModal,
    settings,
    updateSettings,
    resetAllProgress,
  } = useGolang();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const handleExport = () => {
    const jsonStr = exportProgressSnapshot();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `golanger-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      const ok = importProgressSnapshot(content);
      if (ok) {
        setImportStatus('Progress imported successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setImportStatus('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAllProgress();
    setConfirmReset(false);
    setShowSettingsModal(false);
  };

  return (
    <Modal
      isOpen={showSettingsModal}
      onClose={() => {
        setShowSettingsModal(false);
        setConfirmReset(false);
        setImportStatus(null);
      }}
      title={
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <span>Dashboard & Settings</span>
        </div>
      }
      description="Practice activity heatmap, editor preferences, and local storage management."
      maxWidth="3xl"
    >
      <div className="space-y-5 text-xs text-zinc-300 max-h-[80vh] overflow-y-auto pr-1">
        {/* Practice Activity Heatmap */}
        <ActivityHeatmap />

        {/* Editor Preferences */}
        <div className="space-y-2.5">
          <h4 className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400 flex items-center gap-1.5">
            <Keyboard className="w-3 h-3 text-blue-400" />
            Editor Preferences
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Font Size */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-medium text-zinc-200 block">Editor Font Size</span>
                <span className="text-[11px] text-zinc-400">Current: {settings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-1">
                {[12, 14, 16, 18].map(size => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Modifier Toggle */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-medium text-zinc-200 block">Keymap Platform</span>
                <span className="text-[11px] text-zinc-400">
                  {settings.keymapPlatform === 'mac' ? 'macOS (⌘)' : 'Windows / Linux (Ctrl)'}
                </span>
              </div>
              <div className="inline-flex bg-zinc-850 p-0.5 rounded-lg border border-zinc-750">
                <button
                  type="button"
                  onClick={() => updateSettings({ keymapPlatform: 'mac' })}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    settings.keymapPlatform === 'mac'
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  macOS
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ keymapPlatform: 'windows' })}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    settings.keymapPlatform === 'windows'
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Win/Linux
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts Reference Grid */}
        <div className="space-y-2.5">
          <h4 className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400 flex items-center gap-1.5">
            <Command className="w-3 h-3 text-blue-400" />
            Keyboard Shortcuts
          </h4>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-zinc-800/80">
                <span className="text-zinc-300 text-[11px]">Run Program / Tests</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-850 text-blue-300 border border-zinc-700/80 rounded">
                  {settings.keymapPlatform === 'mac' ? '⌘↵' : 'Ctrl+Enter'}
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-zinc-800/80">
                <span className="text-zinc-300 text-[11px]">Command Palette Search</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded">
                  {settings.keymapPlatform === 'mac' ? '⌘K' : 'Ctrl+K'}
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-zinc-800/80">
                <span className="text-zinc-300 text-[11px]">Toggle Sidebar</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded">
                  {settings.keymapPlatform === 'mac' ? '⌘B' : 'Ctrl+B'}
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-zinc-800/80">
                <span className="text-zinc-300 text-[11px]">Toggle Terminal</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded">
                  {settings.keymapPlatform === 'mac' ? '⌘J' : 'Ctrl+J'}
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-zinc-800/80">
                <span className="text-zinc-300 text-[11px]">Next Exercise</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded">
                  {settings.keymapPlatform === 'mac' ? '⌥→' : 'Alt+→'}
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-zinc-800/80">
                <span className="text-zinc-300 text-[11px]">Previous Exercise</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded">
                  {settings.keymapPlatform === 'mac' ? '⌥←' : 'Alt+←'}
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Local Storage & Backup */}
        <div className="space-y-2.5">
          <h4 className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400 flex items-center gap-1.5">
            <HardDrive className="w-3 h-3 text-blue-400" />
            Data & Backup Management
          </h4>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-medium text-zinc-200 block">Export & Import Snapshot</span>
                <span className="text-[11px] text-zinc-400">
                  Save all exercise code, completed marks, and streaks to a JSON file.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleExport} className="gap-1.5">
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Export</span>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Import</span>
                </Button>
              </div>
            </div>

            {importStatus && (
              <div className="p-2 rounded-lg bg-zinc-950 border border-blue-800/60 text-blue-300 text-xs font-mono">
                {importStatus}
              </div>
            )}

            <div className="pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-medium text-rose-300 block">Reset All Progress</span>
                <span className="text-[11px] text-zinc-400">
                  Deletes all locally saved code, completions, bookmarks, and activity history.
                </span>
              </div>

              {!confirmReset ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmReset(true)}
                  className="gap-1.5 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleReset}>
                    Confirm Wipe
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
