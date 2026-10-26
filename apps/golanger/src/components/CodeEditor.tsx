import React, { useRef, useEffect, useCallback, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import {
  FileCode,
  Check,
  RotateCcw,
  Play,
  ZoomIn,
  ZoomOut,
  Keyboard,
  ChevronDown,
} from 'lucide-react';
import { useGolang } from '../context/GolangContext';
import { useKeyboardViewport } from '../hooks/useKeyboardViewport';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

const LEFT_GO_SYMBOLS = [
  '{', '}', '(', ')', '[', ']', ';', ':', ':=', '<-',
];

const RIGHT_GO_SYMBOLS = [
  '&', '*', '!', '=', '"', '`', '%', '.', ',', '<', '>', '_', 'Tab',
];

export const CodeEditor: React.FC = () => {
  const {
    currentExercise,
    currentCode,
    updateCode,
    resetCurrentCode,
    runCode,
    isRunning,
    settings,
    updateSettings,
    toggleSidebar,
    toggleTerminal,
    nextExercise,
    prevExercise,
    setShowCommandPalette,
    getShortcut,
    isEditorFocused,
    setIsEditorFocused,
    mobileTab,
  } = useGolang();

  const { isKeyboardOpen, viewportHeight, dismissKeyboard } = useKeyboardViewport();
  const editorRef = useRef<any>(null);

  const runCodeRef = useRef(runCode);
  runCodeRef.current = runCode;

  const nextExerciseRef = useRef(nextExercise);
  nextExerciseRef.current = nextExercise;

  const prevExerciseRef = useRef(prevExercise);
  prevExerciseRef.current = prevExercise;

  const toggleSidebarRef = useRef(toggleSidebar);
  toggleSidebarRef.current = toggleSidebar;

  const toggleTerminalRef = useRef(toggleTerminal);
  toggleTerminalRef.current = toggleTerminal;

  const setShowCommandPaletteRef = useRef(setShowCommandPalette);
  setShowCommandPaletteRef.current = setShowCommandPalette;

  const lastSymbolActionRef = useRef<number>(0);
  const isInteractingWithToolbarRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const handleDismissKeyboard = useCallback(() => {
    setIsEditorFocused(false);
    dismissKeyboard();
    if (editorRef.current) {
      const domNode = editorRef.current.getDomNode();
      const textarea = domNode?.querySelector('textarea');
      if (textarea) textarea.blur();
    }
  }, [dismissKeyboard, setIsEditorFocused]);

  useEffect(() => {
    if (mobileTab !== 'code') {
      setIsEditorFocused(false);
    }
  }, [mobileTab, setIsEditorFocused]);

  // Virtual Joystick navigation state & refs
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickIntervalRef = useRef<any>(null);
  const currentDirRef = useRef<'left' | 'right' | 'up' | 'down' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (joystickIntervalRef.current) clearInterval(joystickIntervalRef.current);
    };
  }, []);

  const moveCursor = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const pos = editor.getPosition();
    if (!pos) return;

    const model = editor.getModel();
    if (!model) return;

    let { lineNumber, column } = pos;

    if (direction === 'left') {
      if (column > 1) {
        column--;
      } else if (lineNumber > 1) {
        lineNumber--;
        column = model.getLineMaxColumn(lineNumber);
      }
    } else if (direction === 'right') {
      const maxCol = model.getLineMaxColumn(lineNumber);
      if (column < maxCol) {
        column++;
      } else if (lineNumber < model.getLineCount()) {
        lineNumber++;
        column = 1;
      }
    } else if (direction === 'up') {
      if (lineNumber > 1) {
        lineNumber--;
        column = Math.min(column, model.getLineMaxColumn(lineNumber));
      }
    } else if (direction === 'down') {
      if (lineNumber < model.getLineCount()) {
        lineNumber++;
        column = Math.min(column, model.getLineMaxColumn(lineNumber));
      }
    }

    editor.setPosition({ lineNumber, column });
    editor.revealPositionInCenterIfOutsideViewport({ lineNumber, column });
  }, []);

  const processJoystickMovement = useCallback((clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const maxRadius = 11;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setJoystickPos({ x: dx, y: dy });

    const deadzone = 3.5;
    let dir: 'left' | 'right' | 'up' | 'down' | null = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < -deadzone) dir = 'left';
      else if (dx > deadzone) dir = 'right';
    } else {
      if (dy < -deadzone) dir = 'up';
      else if (dy > deadzone) dir = 'down';
    }

    if (dir) {
      if (currentDirRef.current !== dir) {
        currentDirRef.current = dir;
        moveCursor(dir);

        if (joystickIntervalRef.current) {
          clearInterval(joystickIntervalRef.current);
        }
        joystickIntervalRef.current = setInterval(() => {
          if (currentDirRef.current) {
            moveCursor(currentDirRef.current);
          }
        }, 110);
      }
    } else {
      currentDirRef.current = null;
      if (joystickIntervalRef.current) {
        clearInterval(joystickIntervalRef.current);
        joystickIntervalRef.current = null;
      }
    }
  }, [moveCursor]);

  const handleJoystickPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    processJoystickMovement(e.clientX, e.clientY);
  }, [processJoystickMovement]);

  const handleJoystickPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    processJoystickMovement(e.clientX, e.clientY);
  }, [isDragging, processJoystickMovement]);

  const handleJoystickPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    currentDirRef.current = null;
    if (joystickIntervalRef.current) {
      clearInterval(joystickIntervalRef.current);
      joystickIntervalRef.current = null;
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
      const pos = editorRef.current.getPosition();
      if (pos) {
        editorRef.current.revealPositionInCenterIfOutsideViewport(pos);
      }
    }
  }, [viewportHeight]);

  const handleInsertSymbol = useCallback((symbol: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    let selection = editor.getSelection();
    if (!selection) {
      const position = editor.getPosition() || { lineNumber: 1, column: 1 };
      selection = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      };
    }

    const textToInsert = symbol === 'Tab' ? '\t' : symbol;

    editor.executeEdits('quick-symbol', [
      {
        range: selection,
        text: textToInsert,
        forceMoveMarkers: true,
      },
    ]);
    editor.pushUndoStop();
    editor.focus();

    const newPos = editor.getPosition();
    if (newPos) {
      editor.revealPositionInCenterIfOutsideViewport(newPos);
    }
  }, []);

  const triggerSymbol = useCallback((e: React.SyntheticEvent, sym: string) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSymbolActionRef.current < 120) return;
    lastSymbolActionRef.current = now;
    handleInsertSymbol(sym);
  }, [handleInsertSymbol]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidFocusEditorText(() => {
      setIsEditorFocused(true);
    });

    editor.onDidFocusEditorWidget(() => {
      setIsEditorFocused(true);
    });

    editor.onMouseDown(() => {
      setIsEditorFocused(true);
    });

    editor.onDidChangeCursorPosition(e => {
      setIsEditorFocused(true);
      if (window.innerWidth < 768) {
        editor.revealPositionInCenterIfOutsideViewport(e.position);
      }
    });

    editor.onDidBlurEditorText(() => {
      setTimeout(() => {
        if (isInteractingWithToolbarRef.current) return;
        if (!editor.hasTextFocus() && !editor.hasWidgetFocus()) {
          setIsEditorFocused(false);
        }
      }, 200);
    });

    editor.onDidBlurEditorWidget(() => {
      setTimeout(() => {
        if (isInteractingWithToolbarRef.current) return;
        if (!editor.hasTextFocus() && !editor.hasWidgetFocus()) {
          setIsEditorFocused(false);
        }
      }, 200);
    });

    // Custom coss.com dark theme with cyan accent
    monaco.editor.defineTheme('coss-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00ADD8', fontStyle: 'bold' },
        { token: 'string', foreground: 'a1a1aa' },
        { token: 'number', foreground: 'd4d4d8' },
        { token: 'type', foreground: '38bdf8' },
        { token: 'function', foreground: 'f4f4f5' },
      ],
      colors: {
        'editor.background': '#09090b',
        'editor.foreground': '#f4f4f5',
        'editorLineNumber.foreground': '#52525b',
        'editorLineNumber.activeForeground': '#00ADD8',
        'editor.selectionBackground': '#1e3a8a66',
        'editor.lineHighlightBackground': '#121215',
        'editorCursor.foreground': '#00ADD8',
        'editorIndentGuide.background': '#1f1f23',
        'editorIndentGuide.activeBackground': '#2e2e34',
      },
    });

    monaco.editor.setTheme('coss-dark');

    // Run code shortcut: Cmd+Enter / Ctrl+Enter (extracts live buffer directly)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const liveCode = editor.getValue();
      runCodeRef.current(liveCode);
    });

    // Sidebar toggle shortcut: Cmd+B / Ctrl+B
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      toggleSidebarRef.current();
    });

    // Terminal toggle shortcut: Cmd+J / Ctrl+J
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      toggleTerminalRef.current();
    });

    // Search shortcut: Cmd+K / Ctrl+K
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      setShowCommandPaletteRef.current(true);
    });

    // Next / Prev shortcuts
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.RightArrow, () => {
      nextExerciseRef.current();
    });
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.LeftArrow, () => {
      prevExerciseRef.current();
    });
  };

  const increaseFontSize = () => {
    updateSettings({ fontSize: Math.min(24, settings.fontSize + 1) });
  };

  const decreaseFontSize = () => {
    updateSettings({ fontSize: Math.max(10, settings.fontSize - 1) });
  };

  const showMobileControls = isMobile && (isKeyboardOpen || isEditorFocused);

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 h-full w-full bg-[#09090b] select-none overflow-hidden relative">
      {/* Editor Header Bar */}
      <div className="h-9 px-3 border-b border-zinc-800/80 bg-[#0c0c0e] flex items-center justify-between text-xs text-zinc-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-mono text-zinc-300 truncate">{currentExercise.filename}</span>
          <span className="text-[10px] text-zinc-400 bg-zinc-850 px-1.5 py-0.2 rounded border border-zinc-800 shrink-0">
            Go
          </span>
          {currentExercise.mode === 'test' && (
            <span className="text-[10px] text-blue-300 bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-800/60 shrink-0 font-medium">
              test
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Font size adjustments */}
          <div className="hidden sm:flex items-center border border-zinc-800 rounded-md p-0.5 bg-zinc-900/40">
            <Tooltip content="Decrease font size">
              <button
                onClick={decreaseFontSize}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
            </Tooltip>
            <span className="text-[10px] font-mono px-1.5 text-zinc-400">
              {settings.fontSize}px
            </span>
            <Tooltip content="Increase font size">
              <button
                onClick={increaseFontSize}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </Tooltip>
          </div>

          <Tooltip content="Reset code to starter">
            <button
              onClick={resetCurrentCode}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          {/* Run button */}
          <Tooltip content={currentExercise.mode === 'test' ? 'Run Tests' : 'Run Code'} shortcut={getShortcut('⌘↵', 'Ctrl+↵')}>
            <Button
              variant="blue"
              size="sm"
              onClick={() => runCode(editorRef.current?.getValue() ?? currentCode)}
              disabled={isRunning}
              className="gap-1.5 px-2.5 h-6 text-[11px] font-semibold"
            >
              <Play className={`w-3 h-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running' : currentExercise.mode === 'test' ? 'Test' : 'Run'}</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative overflow-hidden w-full h-full min-h-0 min-w-0">
        <Editor
          height="100%"
          width="100%"
          language="go"
          path={currentExercise.filename}
          value={currentCode}
          onChange={val => updateCode(val || '')}
          onMount={handleEditorDidMount}
          theme="coss-dark"
          options={{
            fontSize: settings.fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', monospace",
            fontLigatures: true,
            tabSize: 4,
            insertSpaces: false,
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 12, bottom: 20 },
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            overviewRulerBorder: false,
            folding: true,
          }}
        />
      </div>

      {/* Mobile Accessory Symbol Toolbar */}
      {showMobileControls && (
        <div
          onPointerDown={() => { isInteractingWithToolbarRef.current = true; }}
          onPointerUp={() => { isInteractingWithToolbarRef.current = false; }}
          className="border-t border-zinc-800/80 bg-[#121215] p-1 flex items-center justify-between gap-1 overflow-x-auto select-none z-30 shrink-0"
        >
          <div className="flex items-center gap-1 overflow-x-auto px-1">
            {LEFT_GO_SYMBOLS.map(sym => (
              <button
                key={sym}
                onPointerDown={e => triggerSymbol(e, sym)}
                className="px-2 py-1 bg-zinc-850 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded border border-zinc-750 shrink-0 active:scale-95 transition-all"
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Virtual Joystick */}
          <div
            ref={joystickBaseRef}
            onPointerDown={handleJoystickPointerDown}
            onPointerMove={handleJoystickPointerMove}
            onPointerUp={handleJoystickPointerUp}
            className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing relative"
          >
            <div
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              }}
              className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50 pointer-events-none transition-transform duration-75"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto px-1">
            {RIGHT_GO_SYMBOLS.map(sym => (
              <button
                key={sym}
                onPointerDown={e => triggerSymbol(e, sym)}
                className="px-2 py-1 bg-zinc-850 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded border border-zinc-750 shrink-0 active:scale-95 transition-all"
              >
                {sym}
              </button>
            ))}
          </div>

          <button
            onClick={handleDismissKeyboard}
            className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 shrink-0"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
