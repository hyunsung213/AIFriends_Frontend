'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VoiceStatus } from '@/types';
import { Mic, StopCircle } from 'lucide-react';

interface VoiceCircleProps {
  status: VoiceStatus;
  onMicClick?: () => void;
  onStopClick?: () => void;
}

export default function VoiceCircle({ status, onMicClick, onStopClick }: VoiceCircleProps) {
  const isDisabled = status === 'processing' || status === 'stt_processing' || status === 'speaking';

  const handleClick = () => {
    if (isDisabled) return;
    if (status === 'listening') {
      onStopClick?.();
    } else {
      onMicClick?.();
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'idle': return '눌러서 이야기하기';
      case 'listening': return '듣고 있어요...';
      case 'stt_processing': return '말씀을 정리하고 있어요...';
      case 'processing': return '답변을 생각하고 있어요...';
      case 'speaking': return '이야기하는 중이에요';
      case 'summary': return '대화가 마무리되었습니다';
      case 'error': return '오류가 발생했습니다';
      default: return '';
    }
  };

  // Generate radial wave rings for the speaking state
  const speakingWaveRings = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* ── Speaking state: Glowing colorful aura ── */}
      {status === 'speaking' && (
        <>
          <motion.div
            className="absolute rounded-full opacity-80"
            style={{ 
              width: 220, 
              height: 220,
              background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6)',
              filter: 'blur(20px)'
            }}
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
          <motion.div
            className="absolute rounded-full opacity-60"
            style={{ 
              width: 260, 
              height: 260,
              background: 'conic-gradient(from 180deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
              filter: 'blur(30px)'
            }}
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
        </>
      )}

      {/* ── Listening state: gentle ripple ── */}
      {status === 'listening' && (
        <>
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-primary-light"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-primary-light"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </>
      )}

      {/* ── Main Circle Button ── */}
      <motion.button
        onClick={handleClick}
        disabled={isDisabled}
        className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center shadow-lg text-white transition-colors ${
          status === 'listening'
            ? 'bg-red-500'
            : isDisabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary active:scale-95'
        }`}
        animate={
          status === 'listening'
            ? { scale: [1, 1.08, 1] }
            : status === 'speaking'
              ? { scale: [1, 1.05, 1] }
              : { scale: 1 }
        }
        transition={
          status === 'listening'
            ? { duration: 1.5, repeat: Infinity }
            : status === 'speaking'
              ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 }
        }
      >
        {/* idle */}
        {status === 'idle' && <Mic size={48} />}

        {/* listening → stop icon */}
        {status === 'listening' && <StopCircle size={48} />}

        {/* processing / stt_processing → three dots */}
        {(status === 'processing' || status === 'stt_processing') && (
          <div className="flex space-x-2">
            <motion.div className="w-3 h-3 bg-white rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
            <motion.div className="w-3 h-3 bg-white rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
            <motion.div className="w-3 h-3 bg-white rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
          </div>
        )}

        {/* speaking → animated bars (sound visualizer) */}
        {status === 'speaking' && (
          <div className="flex items-end space-x-1.5 h-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`bar-${i}`}
                className="w-2 bg-white rounded-full"
                animate={{ height: [12, 28 + Math.random() * 12, 12] }}
                transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </motion.button>

    </div>
  );
}
