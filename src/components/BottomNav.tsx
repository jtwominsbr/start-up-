import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    {
      id: 'home' as ScreenType,
      label: '홈',
      icon: 'home',
    },
    {
      id: 'explore' as ScreenType,
      label: '여행지 탐색',
      icon: 'explore',
    },
    {
      id: 'itinerary' as ScreenType,
      label: '내 일정',
      icon: 'calendar_today',
    },
    {
      id: 'budget' as ScreenType,
      label: '내 여행',
      icon: 'flight_takeoff',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#c5c6ce]/30 shadow-[0_-4px_16px_rgba(15,30,54,0.06)]">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive =
            currentScreen === tab.id || (tab.id === 'home' && currentScreen === 'plan-setup');
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-all relative ${
                isActive
                  ? 'text-[#000412] font-bold scale-105'
                  : 'text-[#44474d] hover:text-[#000412] font-normal'
              }`}
              type="button"
            >
              {isActive && (
                <span className="absolute top-1 w-6 h-0.5 bg-[#006b5f] rounded-full"></span>
              )}
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] mt-0.5 leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
