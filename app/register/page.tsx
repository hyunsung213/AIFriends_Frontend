'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, passwordConfirm } = formData;
    
    if (!name || !email || !password || !passwordConfirm) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await register({ email, password, name });
      router.push('/onboarding');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 bg-background relative overflow-y-auto scroll-hidden">
      <header className="flex items-center mb-8 mt-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={32} />
        </button>
      </header>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-800 leading-snug">
          환영합니다!<br />가입 정보를 입력해주세요
        </h1>
      </div>

      <form onSubmit={handleRegister} className="w-full space-y-4">
        <div>
          <label className="block text-[15px] font-bold text-gray-600 mb-2 ml-1">이름</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력해주세요"
            className="w-full p-4 rounded-[16px] border border-gray-200 text-[17px] outline-none focus:border-primary transition-colors bg-white"
          />
        </div>

        <div>
          <label className="block text-[15px] font-bold text-gray-600 mb-2 ml-1">이메일</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력해주세요"
            className="w-full p-4 rounded-[16px] border border-gray-200 text-[17px] outline-none focus:border-primary transition-colors bg-white"
          />
        </div>

        <div>
          <label className="block text-[15px] font-bold text-gray-600 mb-2 ml-1">비밀번호</label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요"
            className="w-full p-4 rounded-[16px] border border-gray-200 text-[17px] outline-none focus:border-primary transition-colors bg-white"
          />
        </div>

        <div>
          <label className="block text-[15px] font-bold text-gray-600 mb-2 ml-1">비밀번호 확인</label>
          <input 
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호를 다시 한 번 입력해주세요"
            className="w-full p-4 rounded-[16px] border border-gray-200 text-[17px] outline-none focus:border-primary transition-colors bg-white"
          />
        </div>

        {error && <p className="text-danger text-[15px] text-left ml-1 mt-2">{error}</p>}
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white text-[19px] font-bold py-5 rounded-[24px] shadow-soft active:scale-[0.98] transition-transform disabled:opacity-50 mt-8"
        >
          {loading ? '가입하는 중...' : '회원가입 완료하기'}
        </button>
      </form>
    </div>
  );
}
