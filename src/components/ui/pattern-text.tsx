import React from 'react';
import { cn } from '@/lib/utils';

export function PatternText({
  text = 'Text',
  className,
  ...props
}: Omit<React.ComponentProps<'p'>, 'children'> & { text: string }) {
  return (
    <p
      data-shadow={text}
      className={cn(
        'relative inline-block font-bold leading-none tracking-tighter select-none',
        'text-[clamp(48px,14vw,180px)]',
        'text-white',
        '[text-shadow:0.02em_0.02em_0_rgba(255,255,255,0.15)]',
        'after:absolute after:inset-0 after:content-[attr(data-shadow)]',
        'after:bg-clip-text after:text-transparent after:[text-shadow:none]',
        'after:bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.12)_45%,rgba(255,255,255,0.12)_55%,transparent_55%)]',
        'after:[background-size:0.05em_0.05em]',
        'after:animate-[shadanim_15s_linear_infinite]',
        className,
      )}
      {...props}
    >
      {text}
    </p>
  );
}