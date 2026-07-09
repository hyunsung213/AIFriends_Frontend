'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, AlertTriangle, X, ChevronDown, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import VoiceCircle from '@/components/talk/VoiceCircle';
import { VoiceStatus, ChatMessage } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const { currentMood, messages, startConversation, sendMessage, sendAudio, endConversation, conversationId } = useChatStore();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [inputText, setInputText] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);

  // Track whether user is viewing messages panel
  const [isMessagesVisible, setIsMessagesVisible] = useState(false);

  // Scroll snap observer: detect which section is in view
  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      // If scrolled more than 40% into the messages section, consider it visible
      setIsMessagesVisible(scrollTop > sectionHeight * 0.4);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll messages to bottom when new message arrives
  useEffect(() => {
    if (messagesEndRef.current && isMessagesVisible) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMessagesVisible]);

  useEffect(() => {
    if (currentMood && !conversationId) {
      startConversation(currentMood.id).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMood, conversationId]);

  // ── Text-to-Speech (TTS) helper using ResponsiveVoice with Fallback ──
  const speakText = (text: string) => {
    return new Promise<void>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rv = (window as any).responsiveVoice;
      
      if (rv && rv.voiceSupport()) {
        rv.speak(text, 'Korean Female', {
          rate: 0.95, // Slightly slower for natural/senior-friendly pacing
          pitch: 1.0,
          onend: () => resolve(),
          onerror: () => {
            console.error('ResponsiveVoice error');
            fallbackTTS(text, resolve);
          }
        });
      } else {
        console.warn('ResponsiveVoice not loaded or supported, falling back');
        fallbackTTS(text, resolve);
      }
    });
  };

  const fallbackTTS = (text: string, resolve: () => void) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.95;
      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.error('Native TTS error', e);
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  };

  // ── Scroll to mic (first section) ──
  const scrollToMic = useCallback(() => {
    if (snapContainerRef.current) {
      snapContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // ── Scroll to messages (second section) ──
  const scrollToMessages = useCallback(() => {
    if (snapContainerRef.current) {
      snapContainerRef.current.scrollTo({
        top: snapContainerRef.current.clientHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // ── Mic handlers ──
  const handleMicStart = async () => {
    if (status !== 'idle') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        const durationMs = Date.now() - startedAtRef.current;

        setStatus('stt_processing');
        try {
          const replyText = await sendAudio(audioBlob, durationMs);
          if (replyText) {
            setStatus('speaking');
            await speakText(replyText);
          }
        } catch (err) {
          console.error('Audio upload failed', err);
        } finally {
          setStatus('idle');
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      startedAtRef.current = Date.now();
      setStatus('listening');
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const handleMicStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // ── Text send ──
  const handleSendText = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    setInputText('');
    setStatus('processing');
    // Scroll to mic view to show speaking animation
    scrollToMic();
    try {
      const replyText = await sendMessage(textToSend);
      if (replyText) {
        setStatus('speaking');
        await speakText(replyText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatus('idle');
    }
  };

  // ── Exit with confirmation ──
  const handleExitConfirm = () => {
    setShowExitModal(false);
    router.back();
  };

  // ── Save with confirmation ──
  const handleSaveConfirm = async () => {
    setShowSaveModal(false);
    setStatus('processing');
    try {
      await endConversation();
      router.push('/summary');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* ── Top: back button (left) + save button (right) ── */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <button
          onClick={() => setShowExitModal(true)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <Save size={28} />
        </button>
      </div>

      {/* ── Exit Confirmation Modal ── */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-[340px] p-7 relative"
            >
              <button
                onClick={() => setShowExitModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
              <h3 className="text-[20px] font-bold text-gray-800 mb-3 leading-snug pr-6">
                대화를 나가시겠어요?
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed mb-6">
                지금 나가시면 지금까지 하신 내용들은 전부 지워집니다. 그래도 나가시겠습니까?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3.5 rounded-[16px] border-2 border-gray-200 text-gray-600 font-bold text-[17px] active:scale-[0.97] transition-transform"
                >
                  취소
                </button>
                <button
                  onClick={handleExitConfirm}
                  className="flex-1 py-3.5 rounded-[16px] bg-red-500 text-white font-bold text-[17px] active:scale-[0.97] transition-transform shadow-sm"
                >
                  나가기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Save Confirmation Modal ── */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-[340px] p-7 relative"
            >
              <button
                onClick={() => setShowSaveModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
              <h3 className="text-[20px] font-bold text-gray-800 mb-3 leading-snug pr-6">
                대화를 저장할까요?
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed mb-6">
                이 대화를 저장하겠습니다. 저장 후 대화 요약 화면으로 이동합니다.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3.5 rounded-[16px] border-2 border-gray-200 text-gray-600 font-bold text-[17px] active:scale-[0.97] transition-transform"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveConfirm}
                  className="flex-1 py-3.5 rounded-[16px] bg-primary text-white font-bold text-[17px] active:scale-[0.97] transition-transform shadow-sm"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll-snap container (two sections) ── */}
      <div
        ref={snapContainerRef}
        className="flex-1 overflow-y-auto scroll-hidden"
        style={{
          scrollSnapType: 'y mandatory',
        }}
      >
        {/* ══ Section 1: Voice Circle (fills viewport, centered) ══ */}
        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            minHeight: '100%',
            scrollSnapAlign: 'start',
          }}
        >
          <VoiceCircle
            status={status}
            onMicClick={handleMicStart}
            onStopClick={handleMicStop}
          />

          {/* Hint to scroll down if there are messages */}
          {messages.length > 0 && !isMessagesVisible && (
            <motion.button
              onClick={scrollToMessages}
              className="absolute bottom-6 flex flex-col items-center text-gray-400"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-[14px] mb-1">대화 보기</span>
              <ChevronDown size={20} />
            </motion.button>
          )}
        </div>

        {/* ══ Section 2: Chat Messages ══ */}
        <div
          className="relative flex flex-col"
          style={{
            minHeight: '100%',
            scrollSnapAlign: 'start',
          }}
        >
          {/* Top fade gradient for smooth visual transition */}
          <div className="sticky top-0 z-10 h-12 bg-gradient-to-b from-background to-transparent pointer-events-none" />

          {/* Scroll-back-to-mic button */}
          <div className="sticky top-3 z-10 flex justify-center">
            <motion.button
              onClick={scrollToMic}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 text-gray-500 text-[14px]"
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={16} className="rotate-90" />
              <span>마이크로 돌아가기</span>
            </motion.button>
          </div>

          <div className="flex-1 p-6 space-y-5 pb-4 flex flex-col">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-12 text-[16px] m-auto">
                아직 대화가 없습니다.<br />마이크 버튼을 눌러 이야기해보세요.
              </div>
            )}

            {messages.map((msg: ChatMessage) => {
              const isHighRisk = msg.role === 'ai' && (msg.riskLevel === 'high' || msg.riskLevel === 'critical');
              return (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-[24px] p-5 text-[17px] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : isHighRisk
                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}>
                    {isHighRisk && (
                      <div className="flex items-center space-x-2 text-red-600 mb-2 font-bold text-[15px]">
                        <AlertTriangle size={18} />
                        <span>안전 안내</span>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Processing indicator */}
            {(status === 'processing' || status === 'stt_processing') && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-[24px] rounded-tl-sm p-5 text-gray-400 flex space-x-1.5">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}>●</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}>●</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}>●</motion.span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Bottom: chat input ── */}
          <div className="sticky bottom-0 bg-white/60 backdrop-blur-sm border-t border-gray-100 p-4 pb-safe">
            <div className="flex items-center space-x-3 opacity-50 focus-within:opacity-100 transition-opacity">
              <div className="flex-1 bg-gray-50 rounded-[24px] border border-gray-200 flex items-center overflow-hidden">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="여기에 편하게 적어주세요"
                  className="flex-1 bg-transparent border-none px-5 py-4 text-[17px] outline-none placeholder:text-gray-400"
                />
                <button onClick={() => handleSendText()} className="p-4 text-primary shrink-0">
                  <Send size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
