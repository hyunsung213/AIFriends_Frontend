'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const { onboarding } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    preferredCall: '',
    speechStyle: '',
    allowMemory: true,
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else router.push('/');
  };

  const handleComplete = async () => {
    try {
      await onboarding({
        preferredCall: formData.preferredCall || '선생님',
        speechStyle: formData.speechStyle || '다정하게',
        memorySaveConsent: formData.allowMemory,
        reportConsent: true,
        guardianShareConsent: false,
        saveRawMessages: true
      });
      router.push('/home');
    } catch (err) {
      console.error(err);
      alert('설정 저장에 실패했습니다.');
    }
  };

  const calls = ['선생님', '어머님', '아버님', '직접 입력'];
  const styles = ['다정하게', '차분하게', '밝고 친근하게', '짧고 간단하게'];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center mb-8">
        <button onClick={prevStep} className="p-2 -ml-2 text-gray-500">
          <ChevronLeft size={32} />
        </button>
        <div className="flex-1 flex justify-center space-x-2 mr-6">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn("h-2.5 rounded-full transition-all", s === step ? "w-8 bg-primary" : "w-2.5 bg-gray-200")} 
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-[26px] font-bold text-gray-800 leading-snug">
              어떻게<br />불러드릴까요?
            </h2>
            <div className="space-y-3">
              {calls.map((call) => (
                <button
                  key={call}
                  onClick={() => {
                    setFormData({ ...formData, preferredCall: call });
                    setTimeout(nextStep, 200);
                  }}
                  className={cn(
                    "w-full text-left p-5 rounded-[20px] text-[18px] font-medium transition-colors",
                    formData.preferredCall === call 
                      ? "bg-primary-light border-2 border-primary text-primary" 
                      : "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {call}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-[26px] font-bold text-gray-800 leading-snug">
              어떤 말투가<br />편하신가요?
            </h2>
            <div className="space-y-3">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    setFormData({ ...formData, speechStyle: style });
                    setTimeout(nextStep, 200);
                  }}
                  className={cn(
                    "w-full text-left p-5 rounded-[20px] text-[18px] font-medium transition-colors",
                    formData.speechStyle === style 
                      ? "bg-primary-light border-2 border-primary text-primary" 
                      : "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-[26px] font-bold text-gray-800 leading-snug mb-3">
                대화 후 요약을<br />저장할까요?
              </h2>
              <p className="text-[17px] text-gray-500 leading-relaxed">
                저장된 내용은 다음 대화에서 더 따뜻하게 기억하기 위해 사용됩니다. 원하시면 언제든 삭제할 수 있습니다.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, allowMemory: true });
                  setTimeout(handleComplete, 200);
                }}
                className="w-full text-left p-5 rounded-[20px] text-[18px] font-medium bg-primary-light border-2 border-primary text-primary"
              >
                네, 요약만 저장하기
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, allowMemory: false });
                  setTimeout(handleComplete, 200);
                }}
                className="w-full text-left p-5 rounded-[20px] text-[18px] font-medium bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50"
              >
                아니오, 저장하지 않기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
