'use client';

import React, { useRef, useEffect, useState } from 'react';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';
import GlobalLoader from '../common/GlobalLoader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  
  // 탭바가 보이는 화면 (홈, 기록, 설정)
  const showNav = pathname === '/home' || pathname === '/records' || pathname === '/settings'; 

  const scrollRef = useRef<HTMLDivElement>(null);

  // 라우트 변경시 로딩 화면 표시 및 스크롤 최상단 이동
  useEffect(() => {
    setIsLoading(true);
    
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <main className="min-h-[100dvh] h-[100dvh] overflow-hidden bg-background flex items-center justify-center md:py-4 relative">
      <div className="w-full h-[100dvh] md:w-[410px] md:h-[860px] md:max-h-[95dvh] md:rounded-[36px] md:shadow-2xl md:border-[10px] md:border-gray-100 md:overflow-hidden bg-surface relative flex flex-col">
        <GlobalLoader isLoading={isLoading} />
        <div ref={scrollRef} className={`flex-1 overflow-y-auto scroll-hidden ${showNav ? 'pb-20' : ''}`}>
          {children}
        </div>
        {showNav && <BottomNav />}
      </div>
    </main>
  );
}
