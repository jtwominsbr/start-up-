import React, { useState } from 'react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState(currentUser.email);
  const [name, setName] = useState(currentUser.name);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: 'user-google-99',
        name: '김서윤',
        email: 'seoyun@example.com',
        avatarUrl: currentUser.avatarUrl,
        isLoggedIn: true,
      });
      onClose();
    }, 700);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: `user-${Date.now()}`,
        name: name || '여행자',
        email,
        avatarUrl: currentUser.avatarUrl,
        isLoggedIn: true,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000412]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-[#c5c6ce]/40 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <h3 className="text-[18px] font-bold text-[#0b1c30]">로그인 & 클라우드 저장</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#44474d] hover:text-[#0b1c30]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#44474d] leading-relaxed">
          로그인하시면 계획한 일정과 예산이 안전하게 실시간 동기화되어 언제 어디서든 이어서 편집할 수 있습니다.
        </p>

        {/* Google Quick Sign-in */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-2xl bg-white border border-[#c5c6ce] text-[#0b1c30] font-bold text-[14px] flex items-center justify-center gap-3 hover:bg-[#f8f9ff] active:scale-95 transition-all shadow-xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google 계정으로 계속하기</span>
        </button>

        <div className="flex items-center gap-3 text-[12px] text-[#75777e]">
          <div className="flex-1 h-px bg-[#c5c6ce]/40"></div>
          <span>또는 이메일</span>
          <div className="flex-1 h-px bg-[#c5c6ce]/40"></div>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="이름 (예: 김서윤)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#eff4ff] text-[14px] text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#006b5f]"
          />
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-[#eff4ff] text-[14px] text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#006b5f]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-[#000412] text-white font-bold text-[14px] hover:bg-[#0f1e36] active:scale-95 transition-all shadow-md mt-1"
          >
            {isLoading ? '동기화 중...' : '이메일로 로그인 / 저장'}
          </button>
        </form>
      </div>
    </div>
  );
};
