'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Coffee, CloudRain, Sun, BookOpen, Moon } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

const moods = [
  {
    id: "casual",
    title: "그냥 이야기하고 싶어요",
    description: "편하게 하고 싶은 이야기를 나눠요.",
    icon: Coffee,
    color: "bg-orange-50 text-orange-500 border-orange-100"
  },
  {
    id: "lonely",
    title: "마음이 조금 허전해요",
    description: "위로와 공감이 필요해요.",
    icon: CloudRain,
    color: "bg-blue-50 text-blue-500 border-blue-100"
  },
  {
    id: "memory",
    title: "추억 이야기를 하고 싶어요",
    description: "옛날 이야기를 천천히 나눠요.",
    icon: Sun,
    color: "bg-yellow-50 text-yellow-500 border-yellow-100"
  },
  {
    id: "worry",
    title: "고민을 정리하고 싶어요",
    description: "복잡한 마음을 함께 정리해요.",
    icon: BookOpen,
    color: "bg-green-50 text-green-500 border-green-100"
  },
  {
    id: "sleep",
    title: "잠들기 전에 이야기하고 싶어요",
    description: "편안한 마음으로 하루를 마무리해요.",
    icon: Moon,
    color: "bg-indigo-50 text-indigo-500 border-indigo-100"
  }
];

export default function MoodPage() {
  const router = useRouter();
  const { setMood } = useChatStore();

  const handleSelectMood = (mood: { id: string; title: string; description: string; }) => {
    setMood({ id: mood.id, title: mood.title, description: mood.description });
    router.push('/chat');
  };

  return (
    <div className="flex flex-col h-full p-6 bg-background">
      <header className="flex items-center mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={32} />
        </button>
      </header>

      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-gray-800 leading-snug mb-2">
          오늘은 어떤 마음으로<br />이야기하고 싶으세요?
        </h1>
        <p className="text-[17px] text-gray-600">선택하신 마음에 맞춰 AI가 이야기를 시작할게요.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scroll-hidden pb-10">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.id}
              onClick={() => handleSelectMood(mood)}
              className="w-full bg-white p-5 rounded-[24px] border-2 border-transparent hover:border-gray-100 shadow-sm flex items-center space-x-4 active:scale-[0.98] transition-all"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${mood.color}`}>
                <Icon size={28} />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-[18px] font-bold text-gray-800 mb-1">{mood.title}</h3>
                <p className="text-[15px] text-gray-500">{mood.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
