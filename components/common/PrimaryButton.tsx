import React from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'md' | 'lg' | 'xl';
}

export default function PrimaryButton({
  className,
  variant = 'primary',
  size = 'lg',
  children,
  ...props
}: PrimaryButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-soft",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-primary text-primary hover:bg-primary-light",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  
  const sizes = {
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg rounded-3xl", // 40~60대 타겟 큰 버튼
    xl: "h-16 px-10 text-xl rounded-full",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
