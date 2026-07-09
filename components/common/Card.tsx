import React from 'react';
import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-3xl p-6 shadow-soft border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
