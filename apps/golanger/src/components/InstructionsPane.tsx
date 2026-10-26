import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useGolang } from '../context/GolangContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import {
  getStoredInstructionsFontSize,
  setStoredInstructionsFontSize,
} from '../lib/storage';

export interface InstructionsPaneProps {
  width: number;
  isMobile?: boolean;
  controlledTab?: 'theory' | 'hint' | 'solution';
}

export const InstructionsPane: React.FC<InstructionsPaneProps> = ({
  width,
  isMobile,
  controlledTab,
}) => {
  const { currentExercise, applySolution } = useGolang();
  const [activeTab, setActiveTab] = useState<'theory' | 'hint' | 'solution'>('theory');
  const [hintRevealed, setHintRevealed] = useState<boolean>(false);
  const [solutionRevealed, setSolutionRevealed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const effectiveTab = controlledTab ?? activeTab;
  const [fontSize, setFontSize] = useState<number>(() => getStoredInstructionsFontSize(12));

  const theoryMarkdown = useMemo(() => {
    let content = currentExercise.categoryReadme || '';
    if (currentExercise.references && currentExercise.references.length > 0) {
      if (!content.includes('## Further information')) {
        const links = currentExercise.references
          .map(ref => `- [${ref.title}](${ref.url})`)
          .join('\n');
        content = `${content.trim()}\n\n## Further information\n\n${links}`;
      }
    }
    return content;
  }, [currentExercise.categoryReadme, currentExercise.references]);

  const handleZoomIn = () => {
    setFontSize(prev => {
      const next = Math.min(prev + 1, 20);
      setStoredInstructionsFontSize(next);
      return next;
    });
  };

  const handleZoomOut = () => {
    setFontSize(prev => {
      const next = Math.max(prev - 1, 11);
      setStoredInstructionsFontSize(next);
      return next;
    });
  };

  const handleCopySolution = () => {
    if (currentExercise.solutionCode) {
      navigator.clipboard.writeText(currentExercise.solutionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={isMobile ? undefined : { width: `${width}px` }}
      className={cn(
        'flex flex-col bg-[#0c0c0f] select-none overflow-hidden',
        isMobile ? 'w-full h-full flex-1' : 'h-full shrink-0'
      )}
    >
      {/* Tab Switcher & Font Zoom Controls */}
      <div className="h-9 px-3 border-b border-zinc-800/80 bg-[#09090b] flex items-center justify-between shrink-0">
        {isMobile ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
            {effectiveTab === 'theory' && <BookOpen className="w-3.5 h-3.5 text-blue-400" />}
            {effectiveTab === 'hint' && <HelpCircle className="w-3.5 h-3.5 text-blue-400" />}
            {effectiveTab === 'solution' && <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
            <span className="capitalize">{effectiveTab === 'theory' ? 'Theory & Guide' : effectiveTab === 'hint' ? 'Hint' : 'Solution'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveTab('theory')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5',
                effectiveTab === 'theory'
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              <BookOpen className="w-3 h-3 text-blue-300" />
              Theory
            </button>
            <button
              onClick={() => setActiveTab('hint')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5',
                effectiveTab === 'hint'
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              <HelpCircle className="w-3 h-3 text-blue-300" />
              Hint
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5',
                effectiveTab === 'solution'
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              <Sparkles className="w-3 h-3 text-blue-300" />
              Solution
            </button>
          </div>
        )}

        {/* Right Controls: Font Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded px-1">
            <Tooltip content="Decrease Font Size">
              <button
                onClick={handleZoomOut}
                disabled={fontSize <= 11}
                className="p-1 hover:text-zinc-200 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
            </Tooltip>
            <span className="text-[10px] font-mono px-1 text-zinc-400">{fontSize}px</span>
            <Tooltip content="Increase Font Size">
              <button
                onClick={handleZoomIn}
                disabled={fontSize >= 20}
                className="p-1 hover:text-zinc-200 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </Tooltip>
          </div>

          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-850 px-1.5 py-0.2 rounded border border-zinc-800">
            #{currentExercise.order}
          </span>
        </div>
      </div>

      {/* Tab Content */}
      <div
        style={{ fontSize: `${fontSize}px` }}
        className="flex-1 overflow-y-auto p-3 text-zinc-300 leading-relaxed space-y-3"
      >
        {effectiveTab === 'theory' && (
          <div className="space-y-3">
            {/* Exercise Instructions */}
            <div className="border border-zinc-800/80 bg-zinc-900/40 rounded-xl p-3">
              <h2 className="font-semibold text-zinc-100 mb-1 flex items-center gap-2 text-[13px]">
                <span>{currentExercise.title}</span>
              </h2>
              {currentExercise.instructions ? (
                <div
                  style={{ fontSize: `${Math.max(10, fontSize - 1)}px` }}
                  className="text-zinc-300 whitespace-pre-line bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/60 font-mono"
                >
                  {currentExercise.instructions}
                </div>
              ) : (
                <p className="text-zinc-400">
                  Fix the compilation or test errors in this exercise to proceed.
                </p>
              )}
            </div>

            {/* Category Theory Markdown */}
            {theoryMarkdown && (
              <div className="border border-zinc-800/80 bg-zinc-900/20 rounded-xl p-3.5 space-y-2">
                <h3 className="font-semibold uppercase tracking-wider text-zinc-400 text-[11px]">
                  Topic Guide: {currentExercise.categoryTitle}
                </h3>
                <div
                  style={{ fontSize: `${fontSize}px` }}
                  className="prose prose-invert max-w-none text-zinc-300 [&_h1]:font-bold [&_h2]:font-semibold [&_h2]:mt-2.5 [&_h2]:mb-1 [&_p]:my-1.5 [&_ul]:my-1 [&_ul]:pl-4 [&_li]:my-0.5 [&_code]:bg-zinc-850 [&_code]:border [&_code]:border-zinc-800 [&_code]:px-1 [&_code]:py-0.2 [&_code]:rounded [&_code]:text-zinc-200 [&_a]:text-zinc-200 [&_a]:underline"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node: _node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-200 hover:text-white"
                        >
                          {props.children}
                          <ExternalLink className="w-2.5 h-2.5 inline text-zinc-400" />
                        </a>
                      ),
                    }}
                  >
                    {theoryMarkdown}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {effectiveTab === 'hint' && (
          <div className="space-y-3">
            <div className="border border-zinc-800/80 bg-zinc-900/40 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5 text-[12px]">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  Official Hint
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHintRevealed(!hintRevealed)}
                  className="h-6 text-[11px] text-zinc-400 hover:text-zinc-100"
                >
                  {hintRevealed ? (
                    <>
                      <EyeOff className="w-3 h-3 text-zinc-400" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-zinc-400" /> Reveal
                    </>
                  )}
                </Button>
              </div>

              {hintRevealed ? (
                <div className="p-3 bg-zinc-950/80 rounded-lg border border-blue-900/40 text-blue-200/90 text-xs font-mono whitespace-pre-line leading-relaxed">
                  {currentExercise.hint || 'No hint available for this exercise.'}
                </div>
              ) : (
                <div className="p-4 text-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs">
                  Hints are hidden by default to encourage trying on your own. Click &quot;Reveal&quot; when stuck!
                </div>
              )}
            </div>
          </div>
        )}

        {effectiveTab === 'solution' && (
          <div className="space-y-3">
            <div className="border border-zinc-800/80 bg-zinc-900/40 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5 text-[12px]">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Reference Solution
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSolutionRevealed(!solutionRevealed)}
                  className="h-6 text-[11px] text-zinc-400 hover:text-zinc-100"
                >
                  {solutionRevealed ? (
                    <>
                      <EyeOff className="w-3 h-3 text-zinc-400" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-zinc-400" /> Reveal
                    </>
                  )}
                </Button>
              </div>

              {solutionRevealed ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopySolution}
                      className="h-6 text-[10px] gap-1 px-2"
                    >
                      {copied ? <Check className="w-3 h-3 text-blue-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </Button>
                    <Button
                      variant="blue"
                      size="sm"
                      onClick={applySolution}
                      className="h-6 text-[10px] gap-1 px-2 font-semibold"
                    >
                      Apply to Editor
                    </Button>
                  </div>
                  <pre className="p-3 bg-zinc-950/90 rounded-lg border border-zinc-800/80 text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed">
                    {currentExercise.solutionCode}
                  </pre>
                </div>
              ) : (
                <div className="p-4 text-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs">
                  Solutions are hidden by default. Click &quot;Reveal&quot; to inspect the official solution.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
