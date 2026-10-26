import React, { useState, useMemo } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  ZoomIn,
  ZoomOut,
  Cpu,
} from 'lucide-react';
import { useGolang } from '../context/GolangContext';
import { parseAnsi } from '../lib/ansi';
import { formatTime, cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import {
  getStoredTerminalFontSize,
  setStoredTerminalFontSize,
} from '../lib/storage';

export interface TerminalOutputProps {
  height: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  height,
  collapsed,
  onToggleCollapse,
  isMobile = false,
}) => {
  const { isRunning, lastResult, clearLastResult, nextExercise, getShortcut } = useGolang();
  const [fontSize, setFontSize] = useState<number>(() => getStoredTerminalFontSize(12));

  const handleZoomIn = () => {
    setFontSize(prev => {
      const next = Math.min(prev + 1, 20);
      setStoredTerminalFontSize(next);
      return next;
    });
  };

  const handleZoomOut = () => {
    setFontSize(prev => {
      const next = Math.max(prev - 1, 10);
      setStoredTerminalFontSize(next);
      return next;
    });
  };

  const combinedOutput = useMemo(() => {
    if (!lastResult) return '';
    const parts: string[] = [];
    if (lastResult.stderr) parts.push(lastResult.stderr);
    if (lastResult.stdout) parts.push(lastResult.stdout);
    return parts.join('\n');
  }, [lastResult]);

  const ansiSpans = useMemo(() => {
    return parseAnsi(combinedOutput);
  }, [combinedOutput]);

  const showBody = isMobile || !collapsed;

  return (
    <div
      style={isMobile ? undefined : { height: collapsed ? 36 : height }}
      className={cn(
        'bg-[#09090b] flex flex-col select-none overflow-hidden',
        isMobile ? 'w-full h-full flex-1' : 'shrink-0'
      )}
    >
      {/* Terminal Header */}
      <div className="h-9 px-3 bg-[#0c0c0f] border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-300">Terminal</span>

          {/* Status Indicator */}
          {isRunning ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-800/40">
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
              Executing...
            </span>
          ) : lastResult ? (
            lastResult.success ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-800/40">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                Passed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-800/40">
                <XCircle className="w-3 h-3 text-rose-400" />
                Failed
              </span>
            )
          ) : (
            <span className="text-[11px] text-zinc-500">Idle</span>
          )}

          {lastResult?.executionTimeMs !== undefined && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
              <Clock className="w-3 h-3" />
              {formatTime(lastResult.executionTimeMs)}
            </span>
          )}

          {lastResult?.engine && (
            <span
              className={cn(
                'hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border',
                lastResult.engine === 'wasm'
                  ? 'bg-blue-950/50 text-blue-300 border-blue-800/40'
                  : 'bg-zinc-850 text-zinc-400 border-zinc-800'
              )}
            >
              <Cpu className="w-2.5 h-2.5 text-blue-400" />
              {lastResult.engine === 'wasm' ? 'WASM' : lastResult.engine === 'local' ? 'Local' : 'Serverless'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded px-1">
            <Tooltip content="Decrease Font Size">
              <button
                onClick={handleZoomOut}
                disabled={fontSize <= 10}
                className="p-1 hover:text-zinc-200 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-3 h-3 text-zinc-400" />
              </button>
            </Tooltip>
            <span className="text-[10px] font-mono px-1 text-zinc-400">{fontSize}px</span>
            <Tooltip content="Increase Font Size">
              <button
                onClick={handleZoomIn}
                disabled={fontSize >= 20}
                className="p-1 hover:text-zinc-200 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-3 h-3 text-zinc-400" />
              </button>
            </Tooltip>
          </div>

          {lastResult && (
            <Tooltip content="Clear Output">
              <button
                onClick={clearLastResult}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}

          {!isMobile && (
            <Tooltip content={collapsed ? 'Expand Terminal' : 'Collapse Terminal'} shortcut={getShortcut('⌘J', 'Ctrl+J')}>
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Terminal Output Body */}
      {showBody && (
        <div className="flex-1 overflow-auto p-3 font-mono text-zinc-300 select-text leading-relaxed bg-[#09090b]">
          {isRunning ? (
            <div className="flex items-center gap-2 text-blue-400/80 animate-pulse text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Running Go compiler / tests...</span>
            </div>
          ) : lastResult ? (
            <div className="space-y-2">
              {/* Output Spans */}
              <div style={{ fontSize: `${fontSize}px` }} className="whitespace-pre-wrap break-all">
                {ansiSpans.map((span, idx) => (
                  <span
                    key={idx}
                    style={{
                      color: span.color,
                      backgroundColor: span.bgColor,
                      fontWeight: span.bold ? 'bold' : 'normal',
                      fontStyle: span.italic ? 'italic' : 'normal',
                      textDecoration: span.underline ? 'underline' : 'none',
                      opacity: span.dim ? 0.6 : 1,
                    }}
                  >
                    {span.text}
                  </span>
                ))}
              </div>

              {/* Success celebration card */}
              {lastResult.success && (
                <div className="mt-3 p-3 rounded-lg border border-blue-900/40 bg-blue-950/20 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-blue-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Exercise completed successfully! Great work!</span>
                  </div>
                  <Button
                    variant="blue"
                    size="sm"
                    onClick={nextExercise}
                    className="gap-1.5 font-semibold text-xs"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-zinc-600 text-xs">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">{getShortcut('⌘↵', 'Ctrl+↵')}</kbd> or click Run to compile and test your Go code.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
