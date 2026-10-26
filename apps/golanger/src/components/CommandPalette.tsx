import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, CheckCircle2, Circle, CornerDownLeft } from 'lucide-react';
import { useGolang } from '../context/GolangContext';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';

export const CommandPalette: React.FC = () => {
  const {
    exercises,
    setCurrentExerciseId,
    completedIds,
    showCommandPalette,
    setShowCommandPalette,
  } = useGolang();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showCommandPalette) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showCommandPalette]);

  const filtered = useMemo(() => {
    if (!search.trim()) return exercises;
    const q = search.toLowerCase();
    return exercises.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.categoryTitle.toLowerCase().includes(q) ||
        e.path.toLowerCase().includes(q)
    );
  }, [exercises, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        setCurrentExerciseId(filtered[selectedIndex].id);
        setShowCommandPalette(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowCommandPalette(false);
    }
  };

  if (!showCommandPalette) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="fixed inset-0"
        onClick={() => setShowCommandPalette(false)}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-xl bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-zinc-800 flex items-center gap-2.5 bg-[#0e0e11]">
          <Search className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search exercises by name, topic, or path..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching exercises found for &quot;{search}&quot;
            </div>
          ) : (
            filtered.map((ex, idx) => {
              const isSelected = idx === selectedIndex;
              const isDone = completedIds.has(ex.id);

              return (
                <div
                  key={ex.id}
                  onClick={() => {
                    setCurrentExerciseId(ex.id);
                    setShowCommandPalette(false);
                  }}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-3 cursor-pointer select-none transition-all',
                    isSelected
                      ? 'bg-blue-950/40 text-white border border-blue-800/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className="font-medium text-zinc-200">{ex.title}</span>
                    <span className="text-[11px] text-zinc-500 truncate">
                      {ex.categoryTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={ex.mode === 'test' ? 'blue' : 'outline'} size="sm">
                      {ex.mode}
                    </Badge>
                    {isSelected && (
                      <CornerDownLeft className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-zinc-800/80 bg-zinc-950/60 text-[11px] text-zinc-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-zinc-400">
            {filtered.length} exercises
          </span>
        </div>
      </div>
    </div>
  );
};
