'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      router.push('/home');
    } catch (err: unknown) {
      console.error('Login error:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      
      if (error.response) {
        // 서버에서 응답을 보냈으나 에러 상태 코드인 경우
        const serverMessage = error.response.data?.message;
        const status = error.response.status;
        
        if (serverMessage) {
          setError(serverMessage);
        } else if (status === 401) {
          setError('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else if (status === 404) {
          setError('존재하지 않는 계정입니다.');
        } else {
          setError(`로그인에 실패했습니다. (오류 코드: ${status})`);
        }
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
        // 서버가 꺼져있거나 네트워크 연결이 안 된 경우
        setError('서버와 연결할 수 없습니다. 백엔드 서버가 켜져 있는지 확인해주세요.');
      } else {
        setError('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 text-center bg-background overflow-y-auto scroll-hidden">
      <div className="flex flex-col justify-center items-center w-full mt-10 mb-8">
        <div className="w-24 h-24 bg-primary-light rounded-[2rem] flex items-center justify-center mb-6 shadow-soft">
          <Heart className="text-primary" size={48} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-snug">
          오늘의 마음을<br />따뜻하게 들어주는<br />AI 말벗
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed max-w-[280px]">
          혼자 있는 시간에도 편하게 이야기하고, 내 마음을 천천히 정리해보세요.
        </p>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-4 mb-6">
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해주세요"
          className="w-full p-4 rounded-[16px] border border-gray-200 text-[17px] outline-none focus:border-primary transition-colors"
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="w-full p-4 rounded-[16px] border border-gray-200 text-[17px] outline-none focus:border-primary transition-colors"
        />
        {error && <p className="text-danger text-[14px] text-left ml-2">{error}</p>}
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white text-[19px] font-bold py-5 rounded-[24px] shadow-soft active:scale-[0.98] transition-transform disabled:opacity-50 mt-4"
        >
          {loading ? '로그인 중...' : '로그인하기'}
        </button>
      </form>

      <div className="flex items-center space-x-4 text-[15px] font-medium text-gray-500">
        <button onClick={() => router.push('/register')} className="hover:text-primary transition-colors">
          회원가입
        </button>
        <div className="w-[1px] h-3 bg-gray-300"></div>
        <button onClick={() => alert('준비 중인 기능입니다.')} className="hover:text-primary transition-colors">
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}
