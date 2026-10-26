import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' | 'cyan' | 'blue' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors select-none';

  const variants = {
    default: 'bg-zinc-850 text-zinc-300 border-zinc-750',
    blue: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    success: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    warning: 'bg-blue-950/50 text-blue-300 border-blue-800/60',
    info: 'bg-sky-950/50 text-sky-300 border-sky-800/60',
    purple: 'bg-blue-950/50 text-blue-300 border-blue-800/60',
    cyan: 'bg-[#00ADD8]/15 text-[#38bdf8] border-[#00ADD8]/40',
    outline: 'bg-transparent text-zinc-400 border-zinc-800',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2 py-0.5 leading-none',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
