import React, { useState } from 'react';
import { ScreenType, Trip } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  currentTrip: Trip;
  onSelectDestination: (dest: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  currentTrip,
  onSelectDestination,
}) => {
  const [hasDraftTrip, setHasDraftTrip] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteCities, setFavoriteCities] = useState<Record<string, boolean>>({
    tokyo: true,
    osaka: false,
    taipei: false,
  });
  const [isSearchingVoice, setIsSearchingVoice] = useState(false);
  const [isStartingPlan, setIsStartingPlan] = useState(false);
  const [styleTestResult, setStyleTestResult] = useState<string | null>(null);

  const toggleFavorite = (cityKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteCities((prev) => ({
      ...prev,
      [cityKey]: !prev[cityKey],
    }));
  };

  const handleStartPlan = () => {
    setIsStartingPlan(true);
    setTimeout(() => {
      setIsStartingPlan(false);
      onNavigate('plan-setup');
    }, 450);
  };

  const handleVoiceSearch = () => {
    setIsSearchingVoice(true);
    setTimeout(() => {
      setIsSearchingVoice(false);
      setSearchQuery('도쿄 맛집 탐방 코스');
    }, 1000);
  };

  const handleRunStyleTest = () => {
    const suggestions = [
      '미식과 야경 중심의 "도쿄 4박 5일 힐링 코스"를 추천해 드려요!',
      '전통 사찰과 감성 카페 위주의 "교토·오사카 3박 4일 코스"가 어울려요!',
      '야시장 투어와 가성비 중심의 "타이베이 3박 4일 코스"가 딱 맞습니다!',
    ];
    const picked = suggestions[Math.floor(Math.random() * suggestions.length)];
    setStyleTestResult(picked);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* 1. Live Exchange Rate Alert Toast */}
      <div className="px-4 mb-3">
        <div
          onClick={() => onNavigate('budget')}
          className="flex items-center justify-between bg-[#eff4ff] px-4 py-2 rounded-full shadow-xs cursor-pointer hover:bg-[#dce9ff] transition-colors border border-[#d3e4fe]"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 rounded-full bg-[#006b5f] animate-pulse"></span>
            <p className="text-[12px] text-[#44474d] truncate">
              <strong className="text-[12px] text-[#006b5f] font-bold">실시간 환율 알림</strong>{' '}
              오늘 100엔 = 892.4원 (최근 3개월 최저 수준)
            </p>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#44474d] shrink-0">
            arrow_forward_ios
          </span>
        </div>
      </div>

      {/* 2. Warm Personal Greeting & Headline */}
      <div className="px-4 mt-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d7e3ff] text-[#0c1b33] mb-2.5">
          <span className="material-symbols-outlined text-[15px] text-[#006b5f]">flight</span>
          <span className="text-[11px] font-bold">스마트 트래블 플래너</span>
        </div>
        <h1 className="text-[26px] font-extrabold text-[#0b1c30] tracking-tight leading-tight">
          안녕하세요 서윤님,
          <br />
          다음 자유여행을 계획해 볼까요?
        </h1>
        <p className="text-[14px] text-[#44474d] mt-1.5 leading-relaxed">
          검색한 여행지를 실제로 이동 가능한 일정과 실시간 예산으로 바로 바꿔보세요.
        </p>
      </div>

      {/* 3. Search Input Container */}
      <div className="px-4 mb-5">
        <div className="relative flex items-center bg-white rounded-2xl shadow-xs border border-[#c5c6ce]/50 hover:shadow-md transition-shadow">
          <div className="absolute left-4 flex items-center pointer-events-none text-[#75777e]">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigate('explore');
            }}
            placeholder="도쿄, 오사카, 타이베이 또는 가고 싶은 장소 검색"
            className="w-full h-14 pl-12 pr-12 bg-transparent text-[#0b1c30] placeholder:text-[#75777e] text-[14px] outline-none"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            aria-label="음성 검색"
            className="absolute right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-[#44474d] hover:bg-[#eff4ff] transition-colors"
          >
            {isSearchingVoice ? (
              <span className="material-symbols-outlined text-[20px] text-[#006b5f] animate-pulse">
                mic
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">mic</span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Active Draft Trip Card OR Empty State */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-[#0b1c30]">최근 작성 중인 여행</span>
          <button
            type="button"
            onClick={() => setHasDraftTrip(!hasDraftTrip)}
            className="text-[11px] text-[#75777e] hover:text-[#006b5f] underline"
          >
            {hasDraftTrip ? '[테스트] 빈 상태 보기' : '[테스트] 초안 복원'}
          </button>
        </div>

        {hasDraftTrip ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#c5c6ce]/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#dce9ff] rounded-full -mr-8 -mt-8 opacity-60 pointer-events-none"></div>
            <div className="relative z-10 flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#ffdad2] text-[#8c1900] font-bold">
                  작성 중인 여행 초안
                </span>
                <span className="text-[12px] text-[#75777e]">D-21</span>
              </div>
              <button
                aria-label="일정 옵션"
                type="button"
                onClick={() => onNavigate('itinerary')}
                className="text-[#75777e] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjxqs2-NRTRcgsYVufBQzuspJoQPfzljZYSb91aVRBxL8VGRzxTPxtpbDlUlU7qcsczwPoZIlWyv0QnoISpUwwh6e9JmDY5-ky1VwQTSoMDo3ZyG99Q49tvhfwjyGsT5doGYgbLtMnVzf2t4QWjptXYJyGxPnFzJOGMk0vO83ZSZRFBmUhGDHTCKcM90_lXACpdZqivXA2yZ6DwzUVqBGjsqSANZmiu8RsmhtDqkdWAcE1nP9EylHpsA"
                  alt="Tokyo preview"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-[16px] text-[#0b1c30] truncate">{currentTrip.title}</h2>
                <p className="text-[12px] text-[#75777e] mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                  <span>{currentTrip.startDate} ~ {currentTrip.endDate} (월~금)</span>
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-3 pt-2 bg-[#eff4ff] rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#006b5f]"></div>
                <span className="text-[12px] text-[#0b1c30] font-semibold">동선 최적화 80% 완료</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('itinerary')}
                className="text-[12px] text-[#006b5f] flex items-center gap-0.5 font-bold hover:underline"
              >
                이어쓰기
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        ) : (
          /* Empty state when no trips exist */
          <div className="p-6 rounded-2xl bg-white text-center shadow-xs border border-dashed border-[#c5c6ce] flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#006b5f]">
              <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
            </div>
            <p className="font-bold text-[14px] text-[#0b1c30]">
              아직 저장한 여행이 없습니다. 첫 여행을 계획해 보세요.
            </p>
            <p className="text-[12px] text-[#75777e] max-w-xs">
              원하는 도시를 고르고 일정과 예산을 3초 만에 자동으로 수립하세요.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('plan-setup')}
              className="mt-2 px-4 py-2 rounded-xl bg-[#000412] text-white text-[13px] font-bold hover:bg-[#0f1e36]"
            >
              새 여행 시작하기
            </button>
          </div>
        )}
      </div>

      {/* 5. Primary Action CTA Button */}
      <div className="px-4 mb-7">
        <button
          type="button"
          onClick={handleStartPlan}
          className="w-full h-14 bg-[#000412] text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-md hover:bg-[#0f1e36] active:scale-[0.98] transition-all"
        >
          {isStartingPlan ? (
            <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[22px] text-[#71f8e4]">auto_fix_high</span>
          )}
          <span>여행 계획 시작하기</span>
        </button>
      </div>

      {/* 6. Recommended Free Travel Destinations */}
      <div className="mb-7">
        <div className="px-4 flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">추천 자유여행지</h2>
            <p className="text-[12px] text-[#75777e] mt-0.5">지금 가장 동선 짜기 좋은 인기 도시</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="text-[12px] text-[#44474d] hover:text-[#006b5f] flex items-center"
          >
            전체보기
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Carousel */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {/* Card 1: 도쿄 */}
          <div
            onClick={() => {
              onSelectDestination('도쿄');
              onNavigate('explore');
            }}
            className="shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-xs border border-[#c5c6ce]/40 flex flex-col group cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-36 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp-M91s0ZKtBFVDRL9UbD3MqVAhm3_lBHIsc93f-tgY12BCmr07YW2F9pdfZms94m_bwiwwuKlfZ8W-NHQqnY528s4hG9LypFs93SeqUolqwJGi_74OJ8Dp3L6z34eQJgbiNcQIshOeqXG15rVX7bVlhReOJSRxePEcE0bbUtWA6-SeHE91SeYyRNutKswYxsJloc5hNYSDiWvfUTDDCpGMec3H7lpvgJsqsCdnPVunyCIwYjsY-zRYQ"
                alt="도쿄 스카이트리"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#000412]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold">
                인기 1위
              </div>
              <button
                type="button"
                aria-label="도쿄 저장"
                onClick={(e) => toggleFavorite('tokyo', e)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#44474d] hover:text-[#ba1a1a] transition-colors"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    favoriteCities.tokyo ? 'text-[#ba1a1a]' : ''
                  }`}
                  style={favoriteCities.tokyo ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  favorite
                </span>
              </button>
            </div>
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">도쿄</h3>
                  <span className="text-[12px] text-[#75777e]">일본</span>
                </div>
                <p className="text-[13px] text-[#44474d] font-medium line-clamp-1">도쿄 4박 5일 추천</p>
                <p className="text-[11px] text-[#75777e] mt-0.5 line-clamp-1">최신 핫플레이스 & 미식 탐방</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-semibold">
                  #자유여행
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-semibold">
                  #맛집탐방
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: 오사카 */}
          <div
            onClick={() => {
              onSelectDestination('오사카');
              onNavigate('plan-setup');
            }}
            className="shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-xs border border-[#c5c6ce]/40 flex flex-col group cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-36 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYkhSHSzQcf3hO9PkDNWxCvi1QgURqx6Wasx5kk9Il6t69Rh1rsQff7gInvMpF-tzzdxVet6IZPNf1ZwXLFPUiyygGhiqy_L6vgIgeMxXUm15d3npIpVh4wq5Wbjn9aKNSuwRz2LThIQ-TXOp9pvONLi9yO-kC4dTUr8xtT_K3IigFf2Mm-yEAI4eLd1u-h_eyJ1bg04ntQ1gPSw6hYOldPncXAiY22N97ObQquf1HRYH22uZgDbv6Vg"
                alt="오사카 도톤보리"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#6df5e1] text-[#006f64] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                동선 최적화 추천
              </div>
              <button
                type="button"
                aria-label="오사카 저장"
                onClick={(e) => toggleFavorite('osaka', e)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#44474d] hover:text-[#ba1a1a] transition-colors"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    favoriteCities.osaka ? 'text-[#ba1a1a]' : ''
                  }`}
                  style={favoriteCities.osaka ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  favorite
                </span>
              </button>
            </div>
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">오사카</h3>
                  <span className="text-[12px] text-[#75777e]">일본</span>
                </div>
                <p className="text-[13px] text-[#44474d] font-medium line-clamp-1">교토·오사카 3박 4일</p>
                <p className="text-[11px] text-[#75777e] mt-0.5 line-clamp-1">간사이 감성 카페 & 식도락 코스</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-semibold">
                  #식도락
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-semibold">
                  #교토당일치기
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: 타이베이 */}
          <div
            onClick={() => {
              onSelectDestination('타이베이');
              onNavigate('plan-setup');
            }}
            className="shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-xs border border-[#c5c6ce]/40 flex flex-col group cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-36 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwq5VutgoeEQvcqtPtnj29TqgAT7rg7Qi9SUmE3vkw9DxNMS8HXgrPRyCmUcxZhc5C6lcWQWJUt0yYKGP0VD9lKfEPbudU8-JpGYf-auGcezqJgnrYXEr_ngrzCxm17yJqArYY3OtARYarzrGAbunDsN4of1saY0PDf3_k6npAA6OgPVvT53JppruicwDxOc9R4UWSvUVj6IyRPREuXsJ74BAEEt33jtlrN94Nrt3nUVd2b6C08ywnpw"
                alt="타이베이 지우펀"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#ffdad2] text-[#8c1900] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                가성비 추천
              </div>
              <button
                type="button"
                aria-label="타이베이 저장"
                onClick={(e) => toggleFavorite('taipei', e)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#44474d] hover:text-[#ba1a1a] transition-colors"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    favoriteCities.taipei ? 'text-[#ba1a1a]' : ''
                  }`}
                  style={favoriteCities.taipei ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  favorite
                </span>
              </button>
            </div>
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">타이베이</h3>
                  <span className="text-[12px] text-[#75777e]">대만</span>
                </div>
                <p className="text-[13px] text-[#44474d] font-medium line-clamp-1">타이베이 3박 4일</p>
                <p className="text-[11px] text-[#75777e] mt-0.5 line-clamp-1">활기찬 야시장 & 예스진지 투어</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-semibold">
                  #야시장
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-semibold">
                  #예스진지
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Why TravelPlanLab Bento Cards (3종) */}
      <div className="px-4 mb-6">
        <div className="mb-3">
          <span className="text-[11px] text-[#006b5f] font-bold tracking-wider uppercase">
            Why TravelPlanLab
          </span>
          <h2 className="text-[18px] font-bold text-[#0b1c30] mt-0.5">
            실패 없는 여행을 만드는 스마트 플래너
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Bento 1: 일정 자동 생성 */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#c5c6ce]/40 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#71f8e4]/40 flex items-center justify-center shrink-0 text-[#006b5f]">
              <span className="material-symbols-outlined text-[24px]">route</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#0b1c30]">일정 자동 생성</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#6df5e1]/40 text-[#006f64] text-[11px] font-semibold">
                  동선 최적화
                </span>
              </div>
              <p className="text-[13px] text-[#44474d] mt-1 leading-relaxed">
                장소 간 이동 시간과 권장 체류 시간을 정밀 계산하여 체력 낭비 없는 최적의 경로를 세워드립니다.
              </p>
            </div>
          </div>

          {/* Bento 2: 예산 자동 계산 */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#c5c6ce]/40 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#d7e3ff] flex items-center justify-center shrink-0 text-[#0f1e36]">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#0b1c30]">예산 자동 계산</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#d7e3ff] text-[#0c1b33] text-[11px] font-semibold">
                  실시간 환율
                </span>
              </div>
              <p className="text-[13px] text-[#44474d] mt-1 leading-relaxed">
                관광지 입장료, 전철 요금, 식비를 엔화·원화 실시간 환율을 반영해 예상 경비로 자동 집계합니다.
              </p>
            </div>
          </div>

          {/* Bento 3: 최신 정보 검증 */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#c5c6ce]/40 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdad2] flex items-center justify-center shrink-0 text-[#e45839]">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#0b1c30]">최신 정보 검증</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#8c1900] text-[11px] font-semibold">
                  2026.09 기준
                </span>
              </div>
              <p className="text-[13px] text-[#44474d] mt-1 leading-relaxed">
                2026년 9월 1일 최신 기준 정기 휴무일, 브레이크타임, 현지 축제 운영 정보를 실시간 교차 검증합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Travel Style Test Prompt */}
      <div className="px-4">
        <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#d3e4fe] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#006b5f] shadow-xs">
                <span className="material-symbols-outlined text-[20px]">help_outline</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#0b1c30]">어디로 가야 할지 고민되시나요?</p>
                <p className="text-[11px] text-[#75777e]">여행 스타일 설문으로 1분 맞춤 추천받기</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRunStyleTest}
              className="px-3.5 py-1.5 rounded-xl bg-white font-bold text-[12px] text-[#006b5f] shadow-xs hover:bg-[#dce9ff] active:scale-95 transition-all"
            >
              테스트
            </button>
          </div>

          {styleTestResult && (
            <div className="mt-1 p-3 rounded-xl bg-white text-[12px] text-[#006b5f] font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[16px]">sparkles</span>
              <span>{styleTestResult}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
