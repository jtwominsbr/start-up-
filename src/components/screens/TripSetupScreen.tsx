import React, { useState } from 'react';
import { ScreenType, Trip, TravelPace } from '../../types';
import { formatKrw } from '../../data/initialData';

interface TripSetupScreenProps {
  currentTrip: Trip;
  onUpdateTrip: (updated: Partial<Trip>) => void;
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
}

export const TripSetupScreen: React.FC<TripSetupScreenProps> = ({
  currentTrip,
  onUpdateTrip,
  onNavigate,
  onShowToast,
}) => {
  const [city, setCity] = useState<'도쿄' | '오사카' | '타이베이'>(
    (currentTrip.destination as '도쿄' | '오사카' | '타이베이') || '도쿄'
  );
  const [startDate, setStartDate] = useState(currentTrip.startDate || '2026-10-12');
  const [endDate, setEndDate] = useState(currentTrip.endDate || '2026-10-16');
  const [travelers, setTravelers] = useState(currentTrip.travelerCount || 2);
  const [stayLocation, setStayLocation] = useState(currentTrip.accommodation?.name || '도쿄역 인근 숙소');
  const [budget, setBudget] = useState(currentTrip.budgetKrw || 1800000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentTrip.interests || ['맛집', '도시 탐방', '역사·문화', '쇼핑']
  );
  const [pace, setPace] = useState<TravelPace>(currentTrip.travelPace || '보통');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingDates, setIsEditingDates] = useState(false);

  // Validation
  const isDateInvalid = startDate > endDate;
  const isTravelerInvalid = travelers <= 0;

  const perPersonBudget = Math.round(budget / Math.max(1, travelers));

  const availableInterests = [
    { id: 'food', label: '맛집', icon: 'restaurant' },
    { id: 'city', label: '도시 탐방', icon: 'apartment' },
    { id: 'history', label: '역사·문화', icon: 'account_balance' },
    { id: 'shopping', label: '쇼핑', icon: 'shopping_bag' },
    { id: 'nature', label: '자연·힐링', icon: 'nature' },
    { id: 'cafe', label: '카페 투어', icon: 'local_cafe' },
  ];

  const toggleInterest = (label: string) => {
    if (selectedInterests.includes(label)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== label));
      } else {
        onShowToast('최소 1개 이상의 관심사를 선택해 주세요.');
      }
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleCreateDraft = () => {
    if (isDateInvalid) {
      onShowToast('종료일이 시작일보다 빠를 수 없습니다. 날짜를 확인해 주세요.');
      return;
    }
    if (isTravelerInvalid) {
      onShowToast('여행 인원수는 1명 이상이어야 합니다.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      onUpdateTrip({
        destination: city,
        startDate,
        endDate,
        travelerCount: travelers,
        accommodation: {
          ...currentTrip.accommodation,
          name: stayLocation,
        },
        budgetKrw: budget,
        interests: selectedInterests,
        travelPace: pace,
        title: `서윤의 ${city} 4박 5일 여행`,
        updatedAt: new Date().toISOString(),
      });

      setIsGenerating(false);
      onShowToast('새로운 맞춤형 여행 일정이 생성되었습니다!');
      onNavigate('explore');
    }, 900);
  };

  return (
    <div className="flex flex-col w-full pb-36 pt-1">
      {/* 1. Stepper Progress Header */}
      <section className="px-4 pt-2 pb-3 bg-white border-b border-[#c5c6ce]/30">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="w-6 h-6 rounded-full bg-[#0f1e36] text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-xs">
              1
            </span>
            <span className="text-[13px] text-[#0b1c30] font-bold truncate">여행 조건</span>
          </div>
          <div className="h-0.5 w-4 bg-[#c5c6ce] rounded-full shrink-0"></div>
          <div
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-1.5 flex-1 min-w-0 justify-center opacity-60 hover:opacity-100 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-[#dce9ff] text-[#44474d] flex items-center justify-center text-[11px] font-semibold shrink-0">
              2
            </span>
            <span className="text-[13px] text-[#44474d] truncate">장소 선택</span>
          </div>
          <div className="h-0.5 w-4 bg-[#c5c6ce] rounded-full shrink-0"></div>
          <div
            onClick={() => onNavigate('itinerary')}
            className="flex items-center gap-1.5 flex-1 min-w-0 justify-center opacity-60 hover:opacity-100 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-[#dce9ff] text-[#44474d] flex items-center justify-center text-[11px] font-semibold shrink-0">
              3
            </span>
            <span className="text-[13px] text-[#44474d] truncate">일정 확인</span>
          </div>
          <div className="h-0.5 w-4 bg-[#c5c6ce] rounded-full shrink-0"></div>
          <div
            onClick={() => onNavigate('budget')}
            className="flex items-center gap-1.5 flex-1 min-w-0 justify-end opacity-60 hover:opacity-100 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-[#dce9ff] text-[#44474d] flex items-center justify-center text-[11px] font-semibold shrink-0">
              4
            </span>
            <span className="text-[13px] text-[#44474d] truncate">예산 확인</span>
          </div>
        </div>
        <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden mt-1.5">
          <div className="bg-[#006b5f] h-full rounded-full w-1/4 transition-all duration-300"></div>
        </div>
      </section>

      {/* 2. Step Introduction Banner */}
      <section className="px-4 py-3">
        <div className="bg-[#eff4ff] rounded-2xl p-4 shadow-xs border border-[#d3e4fe]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#006b5f]/15 flex items-center justify-center text-[#006b5f] shrink-0">
              <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold text-[#0b1c30] tracking-tight">
                새로운 여행 조건을 설정해 주세요
              </h2>
              <p className="text-[13px] text-[#44474d] mt-0.5">
                입력하신 정보를 바탕으로 현실적인 4박 5일 동선을 추천해 드려요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form Controls Stack */}
      <div className="px-4 flex flex-col gap-4">
        {/* 1. Destination Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">explore</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">목적지</label>
            </div>
            <span className="text-[12px] text-[#006b5f] font-semibold">실시간 항공권 연동</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setCity('도쿄')}
              className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                city === '도쿄'
                  ? 'bg-[#0f1e36] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1">location_city</span>
              <span className="text-[13px] font-bold">도쿄</span>
              <span className={`text-[11px] ${city === '도쿄' ? 'text-[#7886a3]' : 'text-[#75777e]'}`}>
                일본
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCity('오사카')}
              className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                city === '오사카'
                  ? 'bg-[#0f1e36] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1">temple_buddhist</span>
              <span className="text-[13px] font-bold">오사카</span>
              <span className={`text-[11px] ${city === '오사카' ? 'text-[#7886a3]' : 'text-[#75777e]'}`}>
                일본
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCity('타이베이')}
              className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                city === '타이베이'
                  ? 'bg-[#0f1e36] text-white shadow-sm'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1">ramen_dining</span>
              <span className="text-[13px] font-bold">타이베이</span>
              <span className={`text-[11px] ${city === '타이베이' ? 'text-[#7886a3]' : 'text-[#75777e]'}`}>
                대만
              </span>
            </button>
          </div>

          {/* Quick Destination Snippet Preview */}
          <div className="mt-3 p-3 rounded-xl bg-[#eff4ff] flex items-center gap-3 border border-[#d3e4fe]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjkcACDd1hXQDkWqKieZE0lAvyXiATtjOv4LyWJzv4eXIS7gW5mCnwAJPaCdiZ8E4FpPC1J7A9SsVjlyLe-9ZxNamHoSC1C8em8wnyYts_dpCRbLPGugxiB-1xbn2AoVcFgSJRcZy8uZpmomk21X8oQJFUvHgcVkLN4Gr9WrTQZqLAfCHltbGZDFxfXo7rxjZ-fKVJL_-V4Chgv7VUgSZVBh-S-UZqV8m2ubffFJyOKIJcFRPrOiRlow"
              alt="Destination snippet"
              className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                  {city} 주요 랜드마크
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#71f8e4] text-[#00201c] font-bold">
                  인기
                </span>
              </div>
              <p className="text-[12px] text-[#44474d] truncate mt-0.5">
                {city === '도쿄'
                  ? '신주쿠 · 긴자 · 아사쿠사 · 시부야'
                  : city === '오사카'
                  ? '도톤보리 · 우메다 · 교토 기요미즈데라'
                  : '시먼딩 · 지우펀 · 스린 야시장'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Travel Dates Picker */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">calendar_today</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">여행 일정</label>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6df5e1] text-[#006f64] font-bold">
              4박 5일 추천
            </span>
          </div>

          <div className="bg-[#eff4ff] rounded-2xl p-4 border border-[#d3e4fe]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#75777e]">출발일</span>
                <span className="text-[17px] font-bold text-[#0b1c30]">10월 12일</span>
                <span className="text-[12px] text-[#75777e]">2026년 월요일</span>
              </div>

              <div className="flex flex-col items-center justify-center px-3">
                <span className="text-[11px] text-[#006b5f] font-bold">5일간의 여정</span>
                <div className="flex items-center gap-1 text-[#006b5f] mt-0.5">
                  <span className="h-0.5 w-6 bg-[#006b5f]/40 rounded-full"></span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[11px] text-[#75777e]">도착일</span>
                <span className="text-[17px] font-bold text-[#0b1c30]">10월 16일</span>
                <span className="text-[12px] text-[#75777e]">2026년 금요일</span>
              </div>
            </div>

            <div className="mt-3 pt-3 flex items-center justify-between bg-white rounded-xl px-3.5 py-2.5 border border-[#c5c6ce]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#75777e]">date_range</span>
                <span className="text-[13px] font-semibold text-[#0b1c30]">
                  {startDate} ~ {endDate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingDates(!isEditingDates)}
                className="text-[12px] text-[#006b5f] font-bold hover:underline"
              >
                {isEditingDates ? '접기' : '날짜 수정'}
              </button>
            </div>

            {isEditingDates && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-[#c5c6ce]/40 flex flex-col gap-2.5 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#44474d] w-12 shrink-0">출발일:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 h-9 px-2 text-[13px] rounded-lg border border-[#c5c6ce] text-[#0b1c30]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#44474d] w-12 shrink-0">도착일:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 h-9 px-2 text-[13px] rounded-lg border border-[#c5c6ce] text-[#0b1c30]"
                  />
                </div>
              </div>
            )}

            {isDateInvalid && (
              <div className="mt-2 text-[12px] text-[#ba1a1a] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>종료일이 시작일보다 빠를 수 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Travelers Counter */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">group</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">여행 인원수</label>
            </div>
            <span className="text-[12px] text-[#75777e]">만 12세 이상 성인 기준</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#eff4ff]">
            <div className="flex flex-col pl-1">
              <span className="text-[16px] font-bold text-[#0b1c30]">성인 {travelers}명</span>
              <span className="text-[11px] text-[#75777e]">호텔 1실 및 패스권 수량 반영</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (travelers > 1) setTravelers(travelers - 1);
                }}
                disabled={travelers <= 1}
                aria-label="인원수 감소"
                className="w-10 h-10 rounded-full bg-white text-[#0b1c30] flex items-center justify-center shadow-xs active:scale-90 transition-transform disabled:opacity-30 border border-[#c5c6ce]/30"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="text-[20px] font-extrabold text-[#0b1c30] w-6 text-center">
                {travelers}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (travelers < 10) setTravelers(travelers + 1);
                }}
                aria-label="인원수 증가"
                className="w-10 h-10 rounded-full bg-white text-[#0b1c30] flex items-center justify-center shadow-xs active:scale-90 transition-transform border border-[#c5c6ce]/30"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>

          {isTravelerInvalid && (
            <p className="mt-2 text-[12px] text-[#ba1a1a] font-semibold">
              인원수는 최소 1명 이상이어야 합니다.
            </p>
          )}
        </div>

        {/* 4. Base Hotel / Stay Location */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">hotel</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">대표 숙소 위치</label>
            </div>
            <span className="text-[12px] text-[#006b5f] font-semibold">동선 최적화 기준점</span>
          </div>
          <p className="text-[12px] text-[#75777e] mb-3">
            매일 아침 출발과 복귀를 계산할 숙소 또는 기차역을 정해주세요.
          </p>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#006b5f]">
              <span className="material-symbols-outlined text-[22px]">pin_drop</span>
            </div>
            <input
              type="text"
              value={stayLocation}
              onChange={(e) => setStayLocation(e.target.value)}
              placeholder="숙소 또는 역명 입력"
              className="w-full h-12 pl-11 pr-24 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-[#006b5f] transition-all border border-[#d3e4fe]"
            />
            <button
              type="button"
              onClick={() => {
                setStayLocation(stayLocation.includes('신주쿠') ? '도쿄역 인근 숙소' : '신주쿠역 인근 호텔');
                onShowToast('대표 숙소 위치가 변경되었습니다.');
              }}
              className="absolute right-2 px-3 py-1.5 rounded-lg bg-[#dce9ff] text-[#0c1b33] text-[11px] font-bold hover:bg-[#c5c6ce]/50"
            >
              위치 변경
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-[#006b5f]"></span>
            <span className="text-[12px] text-[#75777e]">
              나리타 공항 특급 열차(N'EX) 55분 소요 거리
            </span>
          </div>
        </div>

        {/* 5. Total Budget Slider */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">payments</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">총 목표 예산</label>
            </div>
            <span className="text-[13px] text-[#006b5f] font-extrabold">
              1인당 약 {formatKrw(perPersonBudget)}
            </span>
          </div>
          <p className="text-[12px] text-[#75777e] mb-3">
            항공 및 숙소를 제외한 현지 식비, 교통, 입장권 기준
          </p>

          <div className="bg-[#eff4ff] rounded-2xl p-4 border border-[#d3e4fe]">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[12px] text-[#75777e]">설정 금액</span>
              <span className="text-[22px] font-extrabold text-[#0b1c30]">
                {formatKrw(budget)}
              </span>
            </div>

            <div className="relative py-2">
              <input
                type="range"
                min="600000"
                max="4000000"
                step="100000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#dce9ff] rounded-full appearance-none cursor-pointer accent-[#006b5f]"
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#75777e] mt-1">
              <span>₩60만 (알뜰)</span>
              <span>₩200만</span>
              <span>₩400만+ (여유)</span>
            </div>
          </div>
        </div>

        {/* 6. Interests / Travel Vibes */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">interests</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">여행 취향 및 관심사</label>
            </div>
            <span className="text-[12px] text-[#75777e]">복수 선택 가능</span>
          </div>
          <p className="text-[12px] text-[#75777e] mb-3">
            선택한 태그를 알고리즘이 가중치로 계산해 루트를 생성합니다.
          </p>

          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.label);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.label)}
                  className={`px-3.5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs ${
                    isSelected
                      ? 'bg-[#0f1e36] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{interest.icon}</span>
                  <span>{interest.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Travel Pace Segmented Control */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">speed</span>
              <label className="text-[15px] font-bold text-[#0b1c30]">여행 속도 (페이스)</label>
            </div>
            <span className="text-[12px] text-[#006b5f] font-semibold">
              {pace === '여유' ? '일일 2~3개 스팟' : pace === '보통' ? '일일 3~4개 스팟' : '일일 5개+ 스팟'}
            </span>
          </div>
          <p className="text-[12px] text-[#75777e] mb-3">
            일정에 포함할 경유지 밀도와 휴식 시간 비율을 조절합니다.
          </p>

          <div className="grid grid-cols-3 p-1 bg-[#eff4ff] rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setPace('여유')}
              className={`py-2.5 px-3 rounded-xl text-[13px] text-center transition-all ${
                pace === '여유'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              여유
            </button>
            <button
              type="button"
              onClick={() => setPace('보통')}
              className={`py-2.5 px-3 rounded-xl text-[13px] text-center transition-all ${
                pace === '보통'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              보통 (추천)
            </button>
            <button
              type="button"
              onClick={() => setPace('알차게')}
              className={`py-2.5 px-3 rounded-xl text-[13px] text-center transition-all ${
                pace === '알차게'
                  ? 'bg-white text-[#0b1c30] font-bold shadow-xs'
                  : 'text-[#44474d] hover:text-[#0b1c30]'
              }`}
            >
              알차게
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-[#eff4ff] text-[#44474d] text-[12px] border border-[#d3e4fe]">
            <span className="material-symbols-outlined text-[16px] text-[#006b5f] shrink-0">timer</span>
            <span>
              {pace === '여유'
                ? '스팟당 체류 2시간 이상과 넉넉한 티타임을 보장하는 느긋한 힐링 일정입니다.'
                : pace === '보통'
                ? '스팟당 평균 체류 1.5시간 및 식사 1시간을 보장하는 최적 균형 일정입니다.'
                : '주요 랜드마크를 빠르고 알차게 순회하는 효율 극대화 코스입니다.'}
            </span>
          </div>
        </div>

        {/* Notice Verification Banner */}
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#eff4ff] text-[#44474d] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[18px] text-[#006b5f] shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="text-[12px] leading-relaxed">
            공식 출처에서 2026년 9월 1일에 확인한 정보입니다. 방문 전 다시 확인해 주세요.
          </p>
        </div>
      </div>

      {/* Sticky Bottom CTA Area */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md p-4 pb-safe shadow-[0_-4px_16px_rgba(15,30,54,0.08)] z-40 border-t border-[#c5c6ce]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="hidden xs:flex flex-col">
            <span className="text-[11px] text-[#75777e]">예상 소요 시간</span>
            <span className="text-[13px] text-[#006b5f] font-bold">약 3초</span>
          </div>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleCreateDraft}
            className="flex-1 h-14 bg-[#000412] text-white rounded-2xl text-[16px] font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#0f1e36] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#71f8e4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>동선 최적화 알고리즘 실행 중...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px] text-[#71f8e4]">auto_awesome</span>
                <span>무료 일정 초안 만들기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
