'use client';

import React from 'react';
import { VoiceStatus } from '@/types';
import PrimaryButton from '@/components/common/PrimaryButton';
import { StopCircle, Mic } from 'lucide-react';

interface RecordingControlsProps {
  status: VoiceStatus;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEndConversation: () => void;
}

export default function RecordingControls({ 
  status, 
  onStartRecording, 
  onStopRecording,
  onEndConversation 
}: RecordingControlsProps) {
  
  if (status === 'summary') return null;

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 space-y-4 pb-6 mt-auto">
      {status === 'idle' && (
        <PrimaryButton onClick={onStartRecording} className="w-full h-16 rounded-full text-xl flex items-center justify-center">
          <Mic className="mr-2" /> 말하기 시작
        </PrimaryButton>
      )}

      {status === 'listening' && (
        <button 
          onClick={onStopRecording}
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg active:scale-95"
        >
          <StopCircle size={40} />
        </button>
      )}

      {(status === 'idle' || status === 'speaking' || status === 'error') && (
        <button 
          onClick={onEndConversation}
          className="text-gray-500 hover:text-gray-700 py-3 font-medium transition-colors"
        >
          대화 종료하고 요약보기
        </button>
      )}
    </div>
  );
}
