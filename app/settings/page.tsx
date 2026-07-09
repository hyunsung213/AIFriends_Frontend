'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { ChevronRight, LogOut, User, Bell, Shield, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const sections = [
    {
      title: '개인정보 설정',
      items: [
        { icon: User, label: '내 호칭 변경', value: user?.preferredCall || '선생님' },
        { icon: Bell, label: 'AI 말투 변경', value: user?.speechStyle || '다정하게' },
      ]
    },
    {
      title: '데이터 관리',
      items: [
        { icon: Shield, label: '대화 기록 저장 설정', value: user?.memorySaveConsent ? '켜짐' : '꺼짐' },
        { icon: Trash2, label: '대화 기록 전체 삭제', value: '', danger: true },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-background pb-24">
      <header className="mb-6 mt-4">
        <h1 className="text-[26px] font-bold text-gray-800 leading-snug">
          설정
        </h1>
      </header>

      <main className="flex-1 space-y-8 overflow-y-auto scroll-hidden">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-[15px] font-bold text-gray-500 mb-3 ml-2">{section.title}</h2>
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={iIdx}
                    className={`w-full flex items-center justify-between p-5 text-left active:bg-gray-50 transition-colors ${
                      iIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${item.danger ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}`}>
                        <Icon size={22} />
                      </div>
                      <span className={`text-[17px] font-medium ${item.danger ? 'text-red-500' : 'text-gray-800'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.value && <span className="text-[15px] text-gray-400 font-medium">{item.value}</span>}
                      <ChevronRight size={20} className="text-gray-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-5 bg-white border border-gray-200 rounded-[24px] text-[17px] font-bold text-gray-600 active:scale-[0.98] transition-transform shadow-sm hover:bg-gray-50"
          >
            <LogOut size={22} />
            <span>로그아웃</span>
          </button>
        </div>
      </main>
    </div>
  );
}
