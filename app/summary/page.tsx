'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chatStore';
import { CheckCircle2, ChevronRight, Heart } from 'lucide-react';

export default function SummaryPage() {
  const router = useRouter();
  const { summary } = useChatStore();

  const handleNext = () => {
    router.push('/memories');
  };

  const handleSkip = () => {
    router.push('/home');
  };

  if (!summary) return <div className="p-6">정리 중...</div>;

  return (
    <div className="flex flex-col h-full p-6 bg-background">
      <header className="mb-6 mt-4">
        <h1 className="text-[26px] font-bold text-gray-800 leading-snug">
          오늘 이야기를<br />이렇게 정리했어요.
        </h1>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto scroll-hidden pb-10">
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="text-danger" size={24} />
            <h2 className="text-[19px] font-bold text-gray-800">오늘의 마음</h2>
          </div>
          <p className="text-[17px] text-gray-600 leading-relaxed">
            {summary.todayMind}
          </p>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h2 className="text-[19px] font-bold text-gray-800 mb-4">오늘 많이 나온 이야기</h2>
          <ul className="space-y-3">
            {summary.topics.map((topic, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-[17px] text-gray-600">
                <CheckCircle2 className="text-primary mt-0.5 shrink-0" size={20} />
                <span className="leading-relaxed">{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 border-l-4 border-l-primary">
          <h2 className="text-[19px] font-bold text-gray-800 mb-3">내일 해볼 작은 행동</h2>
          <p className="text-[17px] text-gray-600 leading-relaxed">
            {summary.suggestedAction}
          </p>
        </div>
      </main>

      <footer className="space-y-3 pt-4">
        <button 
          onClick={handleNext}
          className="w-full bg-primary text-white text-[19px] font-bold py-5 rounded-[24px] shadow-soft flex items-center justify-center active:scale-[0.98] transition-transform"
        >
          저장하기 <ChevronRight className="ml-2" size={24} />
        </button>
        <button 
          onClick={handleSkip}
          className="w-full bg-white text-gray-600 border-2 border-gray-100 text-[18px] font-bold py-4 rounded-[24px] active:scale-[0.98] transition-transform"
        >
          저장하지 않기
        </button>
      </footer>
    </div>
  );
}
