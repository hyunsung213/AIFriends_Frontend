"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useEffect, useState } from "react";

export default function GlobalLoader({ isLoading }: { isLoading: boolean }) {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    }
  }, [isLoading]);

  const handleAnimationComplete = () => {
    if (!isLoading) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background text-gray-800"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6 text-primary"
      >
        <Coffee size={64} strokeWidth={1.5} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-xl font-medium mb-2 tracking-tight">잠시만 기다려주세요</h2>
        <div className="flex items-center gap-1 opacity-70">
          <p className="text-sm">커피를 내리는 중...</p>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >.</motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >.</motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >.</motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
