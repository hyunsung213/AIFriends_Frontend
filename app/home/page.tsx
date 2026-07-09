'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { MessageCircle, Clock, BarChart2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useUserStore();

  const userName = user?.name || '방문자';
  const callTitle = user?.preferredCall || '선생님';

  return (
    <div className="flex flex-col h-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 mt-4">
        <h1 className="text-[28px] font-bold text-gray-800 leading-snug">
          <span className="text-primary">{userName} {callTitle},</span><br />
          오늘도 편안한<br />하루 되세요.
        </h1>
      </header>

      <main className="flex-1 space-y-5">
        <button
          onClick={() => router.push('/mood')}
          className="w-full bg-primary text-white p-7 rounded-[28px] shadow-soft flex flex-col items-start active:scale-[0.98] transition-transform"
        >
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <MessageCircle size={32} />
          </div>
          <span className="text-[24px] font-bold">이야기 시작하기</span>
          <span className="text-[16px] text-white/90 mt-2 font-medium">오늘의 마음을 편하게 나눠보세요</span>
        </button>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => router.push('/records')}
            className="w-full bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center space-x-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
              <Clock size={26} />
            </div>
            <div className="text-left">
              <h3 className="text-[19px] font-bold text-gray-800">지난 이야기 보기</h3>
              <p className="text-[15px] text-gray-500 mt-1">이전에 나눈 이야기를 확인해 보세요</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/reports')}
            className="w-full bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center space-x-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
              <BarChart2 size={26} />
            </div>
            <div className="text-left">
              <h3 className="text-[19px] font-bold text-gray-800">이번 주 마음 리포트</h3>
              <p className="text-[15px] text-gray-500 mt-1">이번 주 마음의 흐름을 확인해 보세요</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
