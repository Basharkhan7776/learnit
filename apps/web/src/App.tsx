import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { LoginDialog } from '@/components/LoginDialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, CheckCircle2, ExternalLink, Sparkles, Cloud } from 'lucide-react';
import { authClient, API_BASE_URL } from '@learnit/sync';

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string | null; username?: string | null } | null>(null);
  const [syncSummary, setSyncSummary] = useState<Record<string, { completedCount: number; bookmarksCount: number; updatedAt: string }> | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sync/summary`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.summary) {
          setSyncSummary(data.summary);
        } else {
          setSyncSummary(null);
        }
      }
    } catch {
      // API may be warming up
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const sessionResult = await authClient.getSession();
      if (sessionResult.data?.user) {
        const u = sessionResult.data.user as any;
        setCurrentUser({
          id: u.id,
          email: u.email,
          name: u.name,
          username: u.username || null,
        });
        fetchSummary();
      } else {
        setCurrentUser(null);
        setSyncSummary(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [fetchSummary]);

  useEffect(() => {
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => {
      window.removeEventListener('focus', checkAuth);
    };
  }, [checkAuth]);

  const handleLogout = async () => {
    await authClient.signOut();
    setCurrentUser(null);
    setSyncSummary(null);
  };

  const curriculums = [
    {
      id: 'rustal',
      title: 'Rustal',
      language: 'Rust',
      badgeVariant: 'rust' as const,
      color: '#f97316',
      port: 5173,
      url: 'http://localhost:5173',
      icon: '🦀',
      tagline: 'Interactive Rustlings Curriculum in your browser',
      features: ['27+ Core Modules', 'Local Native Runner', 'Axum & Concurrency', 'Zero-setup Monaco Sandbox'],
    },
    {
      id: 'golanger',
      title: 'Golanger',
      language: 'Go',
      badgeVariant: 'golang' as const,
      color: '#00ADD8',
      port: 5174,
      url: 'http://localhost:5174',
      icon: '🐹',
      tagline: 'Interactive Go Curriculum with WebAssembly & Yaegi',
      features: ['Browser WASM Evaluation', 'Goroutines & Channels', 'CLI & Server exercises', 'Instant Error Diagnostics'],
    },
    {
      id: 'scripter',
      title: 'Scripter',
      language: 'JS & TS',
      badgeVariant: 'scripter' as const,
      color: '#f59e0b',
      port: 5175,
      url: 'http://localhost:5175',
      icon: '⚡',
      tagline: 'JavaScript, TypeScript, Express & ElysiaJS Curriculum',
      features: ['31 Hands-on Modules', 'Type Inferences & Generics', 'Express & PostgreSQL', 'ElysiaJS & Zod Mastery'],
    },
  ];

  const displayName = currentUser ? (currentUser.username || currentUser.name || currentUser.email) : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">
      <Header
        userEmail={displayName}
        onOpenLogin={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-xs text-zinc-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Unified Monorepo Architecture with Turborepo, Bun & Docker</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Master Systems & Web Programming.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Interactive, browser-based coding curriculums powered by Monaco Editor, WebAssembly, and native compilation.
          </p>

          {!currentUser ? (
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => setLoginOpen(true)}
                className="gap-2 font-semibold shadow-lg shadow-white/5 cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
              >
                Log in to Track Progress
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud Sync Active for <strong>{displayName}</strong>. All apps will auto-sync on visit.</span>
              </div>
            </div>
          )}
        </div>

        {/* Server Ports Dashboard Indicator */}
        <div className="mb-10 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Services & Dedicated Ports
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                web: <strong className="text-zinc-100">:3000</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                api: <strong className="text-zinc-100">:4000</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                postgres: <strong className="text-indigo-400">:5433</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                rustal: <strong className="text-orange-400">:5173</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                golanger: <strong className="text-sky-400">:5174</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                scripter: <strong className="text-amber-400">:5175</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Curriculum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {curriculums.map(item => {
            const stats = syncSummary?.[item.id];
            return (
              <Card
                key={item.id}
                className="flex flex-col border-zinc-800 bg-[#121215]/80 hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:shadow-black/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl">{item.icon}</div>
                    <Badge variant={item.badgeVariant}>{item.language}</Badge>
                  </div>
                  <CardTitle className="text-xl text-zinc-100 flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-xs font-mono text-zinc-500 font-normal">:{item.port}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 min-h-[32px] pt-1">
                    {item.tagline}
                  </CardDescription>

                  {/* Cloud Synced Progress Pill */}
                  {currentUser && (
                    <div className="mt-2 pt-2 border-t border-zinc-850 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-emerald-400" /> Cloud progress:
                      </span>
                      <span className="font-semibold text-zinc-200">
                        {stats ? `${stats.completedCount} completed` : '0 completed'}
                      </span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-2 border-t border-zinc-800/60">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between hover:bg-zinc-800/80 border-zinc-800 text-zinc-200 cursor-pointer"
                  >
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <span>Launch {item.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Backend API Service Highlight */}
        <div className="rounded-xl border border-zinc-800 bg-[#121215]/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-850 border border-zinc-750 flex items-center justify-center text-lg">
              🦊
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span>ElysiaJS Backend API Service</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Port 4000
                </Badge>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Better Auth with Username/Password, Prisma 6.18.0 PostgreSQL, and Bi-directional Cloud Sync.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs border-zinc-800 hover:bg-zinc-800 shrink-0"
          >
            <a href="http://localhost:4000" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
              <span>View API Root</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </Button>
        </div>
      </main>

      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500">
        <p>Learnit Monorepo • Built with Bun, Turborepo, React, TypeScript, and shadcn/ui</p>
      </footer>

      {/* Login Dialog */}
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLoginSuccess={user => {
          setCurrentUser({
            id: (user as any).id || 'user_1',
            email: user.email,
            name: user.name,
            username: user.username || null,
          });
          fetchSummary();
        }}
      />
    </div>
  );
}
