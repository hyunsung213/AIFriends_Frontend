import React from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';
import { Mic, Keyboard } from 'lucide-react';

interface PermissionGuideProps {
  onRequestPermission: () => void;
  onFallbackToText: () => void;
}

export default function PermissionGuide({ onRequestPermission, onFallbackToText }: PermissionGuideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mb-8">
        <Mic className="text-primary w-12 h-12" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        편안하게 목소리로<br/>이야기해 보세요
      </h2>
      
      <p className="text-gray-500 text-lg mb-12">
        마이크 접근 권한을 허용하시면<br/>AI 친구와 음성으로 대화할 수 있습니다.
      </p>

      <div className="w-full flex flex-col space-y-4">
        <PrimaryButton onClick={onRequestPermission} className="w-full">
          마이크 사용 허용하기
        </PrimaryButton>
        
        <button 
          onClick={onFallbackToText}
          className="flex items-center justify-center py-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Keyboard className="w-5 h-5 mr-2" />
          글자로 대화하기
        </button>
      </div>
    </div>
  );
}
