'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chatStore';
import { CheckSquare, Square } from 'lucide-react';
import { memoryApi } from '@/lib/api/memory';

export default function MemoriesPage() {
  const router = useRouter();
  const { memories, toggleMemory, conversationId } = useChatStore();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!conversationId) {
      router.push('/home');
      return;
    }

    const selectedItems = memories.filter(m => m.selected);
    if (selectedItems.length > 0) {
      setLoading(true);
      try {
        await memoryApi.approve(conversationId, selectedItems);
      } catch (err) {
        console.error('기억 저장 실패', err);
      } finally {
        setLoading(false);
      }
    }
    router.push('/home');
  };

  const handleSkip = () => {
    router.push('/home');
  };

  return (
    <div className="flex flex-col h-full p-6 bg-background">
      <header className="mb-6 mt-4">
        <h1 className="text-[26px] font-bold text-gray-800 leading-snug mb-3">
          다음 대화에서<br />기억해도 될까요?
        </h1>
        <p className="text-[17px] text-gray-500 leading-relaxed">
          아래 내용은 다음에 더 자연스럽게 대화하기 위해 참고됩니다. 원하지 않는 내용은 저장하지 않아도 됩니다.
        </p>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto scroll-hidden pb-10">
        {memories.map((memory, idx) => (
          <button
            key={idx}
            onClick={() => toggleMemory(idx)}
            className={`w-full text-left p-5 rounded-[24px] border-2 transition-all flex items-start space-x-4 ${
              memory.selected 
                ? 'bg-primary-light border-primary' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`mt-0.5 shrink-0 ${memory.selected ? 'text-primary' : 'text-gray-300'}`}>
              {memory.selected ? <CheckSquare size={28} /> : <Square size={28} />}
            </div>
            <span className={`text-[17px] leading-relaxed ${memory.selected ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              {memory.content}
            </span>
          </button>
        ))}
        {memories.length === 0 && (
          <div className="text-center text-gray-500 p-4">저장할 기억 항목이 없습니다.</div>
        )}
      </main>

      <footer className="space-y-3 pt-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white text-[19px] font-bold py-5 rounded-[24px] shadow-soft active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {loading ? '저장 중...' : '선택한 내용 저장하기'}
        </button>
        <button 
          onClick={handleSkip}
          disabled={loading}
          className="w-full bg-white text-gray-600 border-2 border-gray-100 text-[18px] font-bold py-4 rounded-[24px] active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          저장하지 않기
        </button>
      </footer>
    </div>
  );
}
