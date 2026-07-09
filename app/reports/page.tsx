'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BarChart2, Star, Sparkles } from 'lucide-react';
import { reportApi } from '@/lib/api/report';
import { WeeklyReport } from '@/types';

export default function ReportsPage() {
  const router = useRouter();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportApi.getWeekly()
      .then(setReport)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await reportApi.generateWeekly();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert('리포트 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">리포트를 불러오는 중입니다...</div>;

  return (
    <div className="flex flex-col h-full p-6 bg-background relative pb-24">
      <header className="flex items-center mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={32} />
        </button>
      </header>

      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-gray-800 leading-snug mb-2">
          이번 주 마음 리포트
        </h1>
        {report?.period && (
          <p className="text-[15px] text-gray-500 font-medium">
            {report.period.start} ~ {report.period.end}
          </p>
        )}
      </div>

      <main className="flex-1 space-y-4 overflow-y-auto scroll-hidden">
        {!report || report.message ? (
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-[17px] text-gray-600 leading-relaxed">
              {report?.message || '아직 생성된 리포트가 없습니다.'}
            </p>
            {report?.requiredConversations && (
              <p className="text-[15px] text-gray-400">
                필요한 대화: {report.currentConversations} / {report.requiredConversations}
              </p>
            )}
            <button 
              onClick={handleGenerate}
              className="bg-primary text-white font-bold py-3 px-6 rounded-[20px] shadow-soft mt-2"
            >
              리포트 생성 시도하기
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
              <h2 className="text-[18px] font-bold text-gray-800 mb-3">이번 주 한 줄 요약</h2>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                {report.summary}
              </p>
            </div>

            {report.emotions && report.emotions.length > 0 && (
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart2 className="text-primary" size={24} />
                  <h2 className="text-[18px] font-bold text-gray-800">자주 나온 마음</h2>
                </div>
                <div className="space-y-3">
                  {report.emotions.map((item, idx) => {
                    const colors = ['bg-blue-400', 'bg-indigo-400', 'bg-orange-400', 'bg-green-400'];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-[15px]">
                          <span className="font-medium text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {report.positiveSignals && report.positiveSignals.length > 0 && (
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  <h2 className="text-[18px] font-bold text-gray-800">좋았던 순간</h2>
                </div>
                <ul className="space-y-2">
                  {report.positiveSignals.map((signal, idx) => (
                    <li key={idx} className="text-[16px] text-gray-600 leading-relaxed">&quot;{signal}&quot;</li>
                  ))}
                </ul>
              </div>
            )}

            {report.suggestions && report.suggestions.length > 0 && (
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="text-primary" size={24} />
                  <h2 className="text-[18px] font-bold text-gray-800">다음 주 작은 제안</h2>
                </div>
                <ul className="space-y-3 text-[16px] text-gray-600">
                  {report.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
