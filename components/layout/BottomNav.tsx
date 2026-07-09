'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: '홈', href: '/home', icon: Home },
    { name: '기록', href: '/records', icon: Clock },
    { name: '설정', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="absolute bottom-0 w-full h-20 bg-white border-t border-gray-100 flex items-center justify-around z-50 rounded-b-[inherit] pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-colors",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[12px] font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
