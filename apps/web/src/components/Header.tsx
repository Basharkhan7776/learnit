import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, LogIn, LogOut, User } from 'lucide-react';

interface HeaderProps {
  userEmail: string | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userEmail,
  onOpenLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-850 border border-zinc-750 text-white shadow-xs">
            <GraduationCap className="h-4 w-4 text-zinc-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-zinc-100 tracking-tight">
              Learnit
            </span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 text-zinc-400">
              Monorepo
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
          >
            <span className="text-xs">🦀</span> Rustal
          </a>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
          >
            <span className="text-xs">🐹</span> Golanger
          </a>
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <span className="text-xs">⚡</span> Scripter
          </a>
          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            <span className="text-xs">🦊</span> Elysia API
          </a>
        </nav>

        {/* Action: Single Login Button */}
        <div className="flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-850 border border-zinc-750 text-xs text-zinc-300">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span className="max-w-[120px] truncate">{userEmail}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="gap-1.5 text-xs text-zinc-400 hover:text-zinc-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onOpenLogin}
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
