import React from 'react';
import {
  FileCode,
  Terminal,
  BookOpen,
  HelpCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useGolang, type MobileTab } from '../context/GolangContext';
import { cn } from '../lib/utils';

interface TabItem {
  id: MobileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'code', label: 'Code', icon: FileCode },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'theory', label: 'Theory', icon: BookOpen },
  { id: 'hint', label: 'Hint', icon: HelpCircle },
  { id: 'solution', label: 'Solution', icon: Sparkles },
];

export interface MobileTabBarProps {
  hidden?: boolean;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ hidden = false }) => {
  const { mobileTab, setMobileTab, isRunning, lastResult } = useGolang();

  return (
    <nav
      aria-label="Mobile Navigation"
      className={cn(
        'fixed bottom-0 inset-x-0 z-30 bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-800/80 md:hidden pb-[max(env(safe-area-inset-bottom),0.375rem)] pt-1 px-1.5 transition-all duration-200 ease-out',
        hidden && 'translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="grid grid-cols-5 gap-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = mobileTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-lg text-[10px] transition-all select-none',
                isActive
                  ? 'bg-blue-950/60 text-white font-semibold border border-blue-800/60 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 active:bg-zinc-900'
              )}
            >
              <div className="relative mb-0.5">
                <Icon className={cn('w-4 h-4', isActive ? 'text-blue-400' : 'text-zinc-400')} />

                {tab.id === 'terminal' && (
                  <>
                    {isRunning ? (
                      <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-400" />
                      </span>
                    ) : lastResult ? (
                      <span
                        className={cn(
                          'absolute -top-0.5 -right-1 w-2 h-2 rounded-full ring-2 ring-[#09090b]',
                          lastResult.success ? 'bg-blue-400' : 'bg-rose-500'
                        )}
                      />
                    ) : null}
                  </>
                )}
              </div>
              <span className="truncate leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
