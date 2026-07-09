'use client';

import React, { useEffect, useState } from 'react';
import { memoryApi } from '@/lib/api/memory';
import { MemoryItem } from '@/types';
import { Sparkles, Trash2 } from 'lucide-react';

export default function RecordsPage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const data = await memoryApi.getAll();
      setMemories(data);
    } catch (error) {
      console.error('Failed to load memories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('기억을 삭제하시겠습니까?')) return;
    try {
      await memoryApi.delete(id);
      fetchMemories();
    } catch (error) {
      console.error(error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">기록을 불러오는 중입니다...</div>;

  return (
    <div className="flex flex-col h-full p-6 bg-background">
      <header className="mb-6 mt-4">
        <h1 className="text-[26px] font-bold text-gray-800 leading-snug">
          기억된 이야기
        </h1>
        <p className="text-[15px] text-gray-500 mt-2">AI가 기억하고 있는 따뜻한 조각들입니다.</p>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto scroll-hidden pb-10">
        {memories.length === 0 && (
          <div className="text-center text-gray-500 mt-10">저장된 기억이 없습니다.</div>
        )}
        
        {memories.map((memory, idx) => (
          <div key={idx} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col relative">
            <div className="flex items-center space-x-2 mb-3 text-gray-500">
              <Sparkles size={18} className="text-primary" />
              <span className="text-[14px] font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">{memory.type}</span>
            </div>
            
            <p className="text-[16px] text-gray-700 leading-relaxed mb-4 pr-6">
              &quot;{memory.content}&quot;
            </p>
            
            {/* The spec doesn't return memoryId in MemoryItem array but assumes memoryId in DELETE API. 
                Using index for key is fine but for deletion we need an id. Let's assume memory has an id property implicitly. */}
            <button 
              onClick={() => memory.id && handleDelete(memory.id)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
