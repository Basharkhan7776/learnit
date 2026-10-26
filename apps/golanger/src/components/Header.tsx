import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  CheckCircle2,
  Bookmark,
  Menu,
  MoreVertical,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useGolang } from '../context/GolangContext';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { GoLogo } from './ui/GoLogo';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/DropdownMenu';

export const Header: React.FC = () => {
  const {
    currentExercise,
    nextExercise,
    prevExercise,
    completedCount,
    totalCount,
    completedIds,
    toggleCompleted,
    bookmarkedIds,
    toggleBookmark,
    toggleMobileSidebar,
    getShortcut,
    setShowSettingsModal,
    setShowCommandPalette,
    runCode,
    isRunning,
    resetCurrentCode,
  } = useGolang();

  const isCompleted = completedIds.has(currentExercise.id);
  const isBookmarked = bookmarkedIds.has(currentExercise.id);
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <header className="h-12 border-b border-zinc-800/80 bg-[#09090b] px-3 flex items-center justify-between gap-2 select-none shrink-0 z-20">
      {/* ================= DESKTOP HEADER LEFT ================= */}
      <div className="hidden md:flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 shadow-xs">
            <GoLogo size="sm" variant="blue" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight leading-tight">
            Golanger
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-800/80 mx-1" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
          <span className="text-zinc-500">{currentExercise.categoryTitle}</span>
          <span className="text-zinc-600">/</span>
          <span className="font-medium text-blue-400 truncate">{currentExercise.title}</span>
        </div>
      </div>

      {/* ================= MOBILE HEADER LEFT ================= */}
      <div className="flex md:hidden items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSidebar}
          className="h-8 w-8 text-zinc-400 hover:text-white shrink-0"
          aria-label="Open Curriculum Modules"
        >
          <Menu className="w-4 h-4 text-zinc-400" />
        </Button>

        <div className="flex items-center gap-1.5 shrink-0">
          <GoLogo size="xs" variant="blue" />
          <span className="font-bold text-sm text-white tracking-tight leading-tight hidden xs:inline">
            Golanger
          </span>
        </div>

        <span className="font-mono text-[11px] text-zinc-200 bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800 truncate max-w-[120px]">
          {currentExercise.title}
        </span>
      </div>

      {/* ================= DESKTOP PROGRESS BAR ================= */}
      <div className="hidden md:flex items-center gap-3 max-w-xs w-full">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span className="text-zinc-400 font-medium">Progress</span>
            <span className="font-mono text-blue-400 font-semibold">
              {completedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-850 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-[#00ADD8] transition-all duration-300 ease-out rounded-full shadow-xs shadow-blue-500/20"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= DESKTOP CONTROLS ================= */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {/* Run button */}
        <Tooltip content={currentExercise.mode === 'test' ? 'Run Tests' : 'Run Program'} shortcut={getShortcut('⌘↵', 'Ctrl+↵')}>
          <Button
            variant="blue"
            size="sm"
            onClick={() => runCode()}
            disabled={isRunning}
            className="gap-1.5 px-3 font-semibold"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : currentExercise.mode === 'test' ? 'Test' : 'Run'}</span>
          </Button>
        </Tooltip>

        <div className="h-4 w-px bg-zinc-800/80 mx-1" />

        {/* Search button trigger */}
        <Tooltip content="Search exercises" shortcut={getShortcut('⌘K', 'Ctrl+K')}>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowCommandPalette(true)}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <Search className="w-4 h-4 text-zinc-400" />
          </Button>
        </Tooltip>

        {/* Prev / Next navigation */}
        <div className="flex items-center border border-zinc-800 rounded-lg p-0.5 bg-zinc-900/60">
          <Tooltip content="Previous exercise" shortcut={getShortcut('⌥←', 'Alt+←')}>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentExercise.order <= 1}
              onClick={prevExercise}
              className="h-7 w-7 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </Button>
          </Tooltip>
          <div className="w-px h-3.5 bg-zinc-800" />
          <Tooltip content="Next exercise" shortcut={getShortcut('⌥→', 'Alt+→')}>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentExercise.order >= totalCount}
              onClick={nextExercise}
              className="h-7 w-7 text-zinc-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </Button>
          </Tooltip>
        </div>

        {/* Reset button */}
        <Tooltip content="Reset code to starter">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetCurrentCode}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
          </Button>
        </Tooltip>

        {/* Bookmark button */}
        <Tooltip content={isBookmarked ? 'Remove bookmark' : 'Bookmark exercise'}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmark(currentExercise.id)}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-blue-400 text-blue-400' : 'text-zinc-400'}`}
            />
          </Button>
        </Tooltip>

        {/* Mark completed button */}
        <Tooltip content={isCompleted ? 'Mark incomplete' : 'Mark completed'}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleCompleted(currentExercise.id)}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <CheckCircle2
              className={`w-4 h-4 ${isCompleted ? 'text-blue-400 fill-blue-950/80' : 'text-zinc-400'}`}
            />
          </Button>
        </Tooltip>

        {/* Settings button */}
        <Tooltip content="Settings & Data">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettingsModal(true)}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
          </Button>
        </Tooltip>
      </div>

      {/* ================= MOBILE CONTROLS ================= */}
      <div className="flex md:hidden items-center gap-1.5 shrink-0">
        <Button
          variant="blue"
          size="sm"
          onClick={() => runCode()}
          disabled={isRunning}
          className="gap-1 px-2.5 h-7 text-xs font-semibold"
        >
          <Play className={`w-3 h-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? '...' : currentExercise.mode === 'test' ? 'Test' : 'Run'}</span>
        </Button>

        <div className="flex items-center border border-zinc-800 rounded-lg p-0.5 bg-zinc-900/60">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentExercise.order <= 1}
            onClick={prevExercise}
            className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-400" />
          </Button>
          <div className="w-px h-3.5 bg-zinc-800" />
          <Button
            variant="ghost"
            size="icon"
            disabled={currentExercise.order >= totalCount}
            onClick={nextExercise}
            className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
          >
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </Button>
        </div>

        <DropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
        >
          <DropdownMenuItem
            icon={<Search className="w-3.5 h-3.5" />}
            onClick={() => setShowCommandPalette(true)}
            shortcut={getShortcut('⌘K', 'Ctrl+K')}
          >
            Search exercises
          </DropdownMenuItem>

          <DropdownMenuItem
            icon={<Bookmark className="w-3.5 h-3.5" />}
            onClick={() => toggleBookmark(currentExercise.id)}
          >
            {isBookmarked ? 'Remove bookmark' : 'Bookmark exercise'}
          </DropdownMenuItem>

          <DropdownMenuItem
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            onClick={() => toggleCompleted(currentExercise.id)}
          >
            {isCompleted ? 'Mark incomplete' : 'Mark completed'}
          </DropdownMenuItem>

          <DropdownMenuItem
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={resetCurrentCode}
          >
            Reset starter code
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            icon={<Settings className="w-3.5 h-3.5" />}
            onClick={() => setShowSettingsModal(true)}
          >
            Settings & Data
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
};
