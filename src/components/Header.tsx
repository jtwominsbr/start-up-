import React, { useState } from 'react';
import { UserProfile, ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  onOpenAuthModal: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenAuthModal,
  onOpenShareModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isSetupScreen = currentScreen === 'plan-setup';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(15,30,54,0.04)] border-b border-[#c5c6ce]/30">
      <div className="h-16 max-w-xl mx-auto px-4 flex items-center justify-between">
        {isSetupScreen ? (
          <div className="flex items-center">
            <button
              aria-label="뒤로 가기"
              onClick={() => onNavigate('home')}
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#dce9ff] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
            <h1 className="text-[18px] font-bold text-[#0b1c30] ml-1">여행 조건 설정</h1>
          </div>
        ) : (
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            {/* Custom Brand Icon matching Image 12 / 13 */}
            <div className="w-8 h-8 rounded-xl bg-[#0f1e36] flex items-center justify-center shadow-xs relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="6" r="3.5" fill="#e45839" />
                <path
                  d="M10 2C6.13 2 3 5.13 3 9C3 14.25 10 22 10 22C10 22 17 14.25 17 9C17 5.13 13.87 2 10 2Z"
                  fill="#006b5f"
                />
                <circle cx="10" cy="9" r="2.8" fill="#ffffff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[19px] tracking-tight text-[#000412] leading-none">
                트래블플랜랩
              </span>
              <span className="text-[10px] font-bold text-[#006b5f] tracking-wide leading-none mt-0.5">
                스마트 자유여행 플래너
              </span>
            </div>
          </div>
        )}

        {/* Right actions: notifications and user profile */}
        <div className="flex items-center gap-1.5 relative">
          {isSetupScreen && (
            <button
              aria-label="공유"
              onClick={onOpenShareModal}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#44474d] hover:text-[#0b1c30] hover:bg-[#dce9ff] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          )}

          {/* Notification Button */}
          <div className="relative">
            <button
              aria-label="알림 확인"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#44474d] hover:text-[#0b1c30] hover:bg-[#dce9ff] active:scale-95 transition-all relative"
              type="button"
            >
              <span className="material-symbols-outlined text-[23px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e45839] ring-2 ring-[#f8f9ff]"></span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl p-4 shadow-xl border border-[#c5c6ce]/40 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                  <span className="font-bold text-[14px] text-[#0b1c30]">실시간 여행 알림</span>
                  <span className="text-[11px] font-semibold text-[#006b5f] bg-[#6df5e1]/30 px-2 py-0.5 rounded-full">
                    3건 미확인
                  </span>
                </div>
                <div className="space-y-2.5 mt-2.5 max-h-64 overflow-y-auto no-scrollbar">
                  <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[12px] text-[#0b1c30]">
                    <div className="font-bold text-[#006b5f] flex items-center gap-1 mb-0.5">
                      <span className="material-symbols-outlined text-[14px]">currency_yen</span>
                      환율 변동 알림
                    </div>
                    오늘 100엔 = 892.4원으로 최근 3개월 중 가장 낮은 수준입니다.
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#ffdad2]/40 text-[12px] text-[#0b1c30]">
                    <div className="font-bold text-[#e45839] flex items-center gap-1 mb-0.5">
                      <span className="material-symbols-outlined text-[14px]">event_busy</span>
                      정기 휴관 알림
                    </div>
                    1일차 일정의 긴자 국립근대미술관이 월요일 휴관입니다.
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8f9ff] text-[12px] text-[#0b1c30]">
                    <div className="font-bold text-[#0f1e36] flex items-center gap-1 mb-0.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      동선 최적화 완료
                    </div>
                    도쿄 4박 5일 코스의 추천 환승 경로가 반영되었습니다.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              aria-label="마이페이지"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#006b5f] active:scale-95 transition-all overflow-hidden"
              type="button"
            >
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shadow-xs border border-white"
                src={user.avatarUrl}
              />
            </button>

            {/* Profile Menu Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl p-4 shadow-xl border border-[#c5c6ce]/40 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-[#eff4ff]">
                  <img
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover shadow-xs"
                    src={user.avatarUrl}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-[#0b1c30] truncate">{user.name}</p>
                    <p className="text-[12px] text-[#44474d] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('itinerary');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#006b5f]">calendar_month</span>
                    내 일정 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('budget');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#006b5f]">payments</span>
                    예산 및 정산 관리
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#e45839] hover:bg-[#ffdad2]/30 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                    계정 전환 / 동기화
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
