import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Mail, Sparkles, User, AlertCircle } from 'lucide-react';
import { authClient } from '@learnit/sync';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (user: { name?: string | null; email: string; username?: string | null }) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  onOpenChange,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [identifier, setIdentifier] = useState(''); // username or email
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const isEmail = identifier.includes('@');
        let res;

        if (isEmail) {
          res = await authClient.signIn.email({
            email: identifier.trim(),
            password,
          });
        } else {
          res = await authClient.signIn.username({
            username: identifier.trim(),
            password,
          });
        }

        if (res.error) {
          setError(res.error.message || 'Invalid username or password');
          setIsLoading(false);
          return;
        }

        if (res.data?.user) {
          onLoginSuccess(res.data.user as any);
          onOpenChange(false);
        }
      } else {
        // Sign Up
        if (!email.includes('@')) {
          setError('Please provide a valid email address');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const res = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || username.trim() || 'Learner',
          username: username.trim() || undefined,
        } as any);

        if (res.error) {
          setError(res.error.message || 'Failed to create account');
          setIsLoading(false);
          return;
        }

        if (res.data?.user) {
          onLoginSuccess(res.data.user as any);
          onOpenChange(false);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // First attempt to sign in as demo user
      const signInRes = await authClient.signIn.email({
        email: 'learner@learnit.dev',
        password: 'Password123!',
      });

      if (signInRes.data?.user) {
        onLoginSuccess(signInRes.data.user as any);
        onOpenChange(false);
        return;
      }

      // If not yet registered, create demo user
      const signUpRes = await authClient.signUp.email({
        email: 'learner@learnit.dev',
        password: 'Password123!',
        name: 'Demo Learner',
        username: 'learner',
      } as any);

      if (signUpRes.data?.user) {
        onLoginSuccess(signUpRes.data.user as any);
        onOpenChange(false);
      } else {
        setError(signUpRes.error?.message || 'Could not log in as demo learner');
      }
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-[#121215] border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center mb-1 text-zinc-100">
            <KeyRound className="w-5 h-5 text-zinc-300" />
          </div>
          <DialogTitle className="text-xl">
            {mode === 'signin' ? 'Log in to Learnit' : 'Create Learnit Account'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {mode === 'signin'
              ? 'Access your unified progress across Rustal, Golanger, and Scripter.'
              : 'Sign up to enable instant cloud synchronization across all curriculums.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex border border-zinc-800 rounded-lg p-1 bg-zinc-900/80 mb-2">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-md bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1">
          {mode === 'signin' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Username or Email
              </label>
              <Input
                type="text"
                placeholder="learner or learner@example.com"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                autoFocus
                required
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600"
              />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="e.g. jdoe"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600"
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Password</label>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium"
            >
              {isLoading
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In with Password'
                : 'Create Account'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full gap-2 border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick One-Click Demo Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
