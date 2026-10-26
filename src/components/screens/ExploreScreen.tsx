import React, { useState, useMemo } from 'react';
import { Place, PlaceCategory, DaySchedule } from '../../types';
import { formatJpy, formatKrw } from '../../data/initialData';

interface ExploreScreenProps {
  places: Place[];
  onOpenDayPicker: (place: Place) => void;
  onOpenTransitComparison: (fromName: string, toName: string) => void;
  daySchedules: DaySchedule[];
  onShowToast: (msg: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  places,
  onOpenDayPicker,
  onOpenTransitComparison,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(places[0]?.id || 'place-hotel');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [excludeMondayClosed, setExcludeMondayClosed] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [likedPlaceIds, setLikedPlaceIds] = useState<Record<string, boolean>>({
    'place-hotel': true,
    'place-sensoji': true,
  });

  const getOpeningHoursStr = (hours: any): string => {
    if (typeof hours === 'string') return hours;
    if (hours && hours.monday) return hours.monday;
    return '09:00 - 18:00';
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (activeCategory !== 'all') {
        const cat = place.category as string;
        if (activeCategory === '관광지' && cat !== '관광지' && cat !== 'sightseeing' && cat !== '역사') return false;
        if (activeCategory === '맛집' && cat !== '맛집' && cat !== 'food') return false;
        if (activeCategory === '카페' && cat !== '카페' && cat !== 'cafe') return false;
        if (activeCategory === '쇼핑' && cat !== '쇼핑' && cat !== 'shopping') return false;
      }
      if (
        searchKeyword.trim() &&
        !place.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !(place.japaneseName || place.originalName || '').toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !(place.area || place.address || '').toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }
      if (excludeMondayClosed && place.closedDays.some((d) => d.includes('월'))) {
        return false;
      }
      return true;
    });
  }, [places, activeCategory, searchKeyword, excludeMondayClosed]);

  const selectedPlace = useMemo(() => {
    return places.find((p) => p.id === selectedPlaceId) || filteredPlaces[0] || places[0];
  }, [places, selectedPlaceId, filteredPlaces]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPlaceIds((prev) => {
      const next = !prev[id];
      onShowToast(next ? '위시리스트에 저장되었습니다.' : '위시리스트에서 제외되었습니다.');
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* 1. Search Bar & Filter Controls Header */}
      <div className="p-4 bg-white border-b border-[#c5c6ce]/30 flex flex-col gap-3 sticky top-16 z-30 shadow-xs">
        {/* Search input with clear */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-[#75777e] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="장소명, 역, 음식 종류로 검색 (예: 라멘, 신사, 타워)"
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[13px] outline-none border border-[#d3e4fe] focus:bg-white focus:ring-2 focus:ring-[#006b5f]"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3 text-[#75777e] hover:text-[#0b1c30]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-[#0f1e36] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
            }`}
          >
            전체 ({places.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('관광지')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === '관광지'
                ? 'bg-[#006b5f] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
            }`}
          >
            관광명소
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('맛집')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === '맛집'
                ? 'bg-[#e45839] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
            }`}
          >
            맛집·식도락
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('카페')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === '카페'
                ? 'bg-[#8c1900] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
            }`}
          >
            카페·디저트
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('쇼핑')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
              activeCategory === '쇼핑'
                ? 'bg-[#0f1e36] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#44474d] hover:bg-[#dce9ff]'
            }`}
          >
            쇼핑
          </button>
        </div>

        {/* Quick filter toggles & view toggle */}
        <div className="flex items-center justify-between pt-1 text-[12px]">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[#44474d] cursor-pointer">
              <input
                type="checkbox"
                checked={excludeMondayClosed}
                onChange={(e) => setExcludeMondayClosed(e.target.checked)}
                className="rounded text-[#006b5f] focus:ring-0"
              />
              <span className="font-medium">월요일 휴무 제외</span>
            </label>
          </div>

          <div className="flex items-center gap-1 bg-[#eff4ff] p-0.5 rounded-xl border border-[#d3e4fe]">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#75777e]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">map</span>
              <span>지도</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#75777e]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">view_list</span>
              <span>목록</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Styled Map Simulation (if split mode) */}
      {viewMode === 'split' && (
        <div className="relative w-full h-72 bg-[#e5ebf4] overflow-hidden border-b border-[#c5c6ce]/30 shadow-inner">
          {/* Stylized vector map grid representation */}
          <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapgrid)" />
            {/* Tokyo Bay & River curves */}
            <path
              d="M-50,220 Q120,180 200,240 T450,210"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M180,-20 Q210,120 190,260"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Subway & JR Line representations */}
            <path
              d="M20,60 Q180,90 320,50 T440,160"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="4"
              strokeDasharray="6,4"
            />
            <path
              d="M100,250 Q220,130 360,110"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
            />
          </svg>

          {/* Map Location Pins */}
          {filteredPlaces.map((place, idx) => {
            const isSelected = place.id === selectedPlaceId;
            // Map coordinates pseudo distribution
            const pinX = 22 + ((idx * 27) % 76);
            const pinY = 18 + ((idx * 23 + (idx % 2) * 15) % 65);

            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedPlaceId(place.id)}
                style={{ left: `${pinX}%`, top: `${pinY}%` }}
                className={`absolute -translate-x-1/2 -translate-y-full transition-all duration-200 z-10 ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg ${
                    isSelected
                      ? 'bg-[#0f1e36] text-white ring-4 ring-[#71f8e4]'
                      : (place.category === '관광지' || (place.category as string) === 'sightseeing' || place.category === '역사')
                      ? 'bg-[#006b5f] text-white'
                      : (place.category === '맛집' || (place.category as string) === 'food')
                      ? 'bg-[#e45839] text-white'
                      : 'bg-white text-[#0b1c30] border border-[#c5c6ce]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {(place.category === '관광지' || (place.category as string) === 'sightseeing' || place.category === '역사')
                      ? 'photo_camera'
                      : (place.category === '맛집' || (place.category as string) === 'food')
                      ? 'restaurant'
                      : (place.category === '카페' || (place.category as string) === 'cafe')
                      ? 'local_cafe'
                      : 'shopping_bag'}
                  </span>
                  <span className="truncate max-w-[80px]">{place.name}</span>
                </div>
                {/* Pin pointer stem */}
                <div
                  className={`w-2 h-2 rotate-45 mx-auto -mt-1 ${
                    isSelected
                      ? 'bg-[#0f1e36]'
                      : (place.category === '관광지' || (place.category as string) === 'sightseeing' || place.category === '역사')
                      ? 'bg-[#006b5f]'
                      : (place.category === '맛집' || (place.category as string) === 'food')
                      ? 'bg-[#e45839]'
                      : 'bg-white'
                  }`}
                ></div>
              </button>
            );
          })}

          {/* Map Overlay Controls */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20">
            <button
              type="button"
              onClick={() => onShowToast('현재 지도 배율을 확대했습니다.')}
              className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#0b1c30] shadow-sm hover:bg-white"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
            <button
              type="button"
              onClick={() => onShowToast('현재 지도 배율을 축소했습니다.')}
              className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#0b1c30] shadow-sm hover:bg-white"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPlaceId(places[0].id);
                onShowToast('선택한 장소 중심으로 지도를 재설정했습니다.');
              }}
              className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#006b5f] shadow-sm hover:bg-white"
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </button>
          </div>

          <div className="absolute left-3 bottom-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-[#44474d] font-semibold flex items-center gap-1 shadow-xs z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006b5f]"></span>
            <span>도쿄 중심부 관광지 & 맛집 네트워크</span>
          </div>
        </div>
      )}

      {/* 3. Selected Spot Highlight Card (if spot exists) */}
      {selectedPlace && (
        <div className="p-4 bg-white border-b border-[#c5c6ce]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider">
              선택된 장소 상세
            </span>
            <button
              type="button"
              onClick={(e) => toggleWishlist(selectedPlace.id, e)}
              className="text-[#ba1a1a] flex items-center gap-1 text-[12px] font-medium"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={likedPlaceIds[selectedPlace.id] ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                favorite
              </span>
              <span>{likedPlaceIds[selectedPlace.id] ? '저장됨' : '저장하기'}</span>
            </button>
          </div>

          <div className="flex gap-3.5">
            <img
              src={selectedPlace.photoUrl}
              alt={selectedPlace.name}
              className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-bold">
                  {selectedPlace.categoryLabel}
                </span>
                <div className="flex items-center text-[12px] text-[#0b1c30] font-bold">
                  <span className="material-symbols-outlined text-[15px] text-[#ffb020] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{selectedPlace.rating}</span>
                  <span className="text-[#75777e] font-normal ml-0.5">({selectedPlace.reviewCount})</span>
                </div>
              </div>

              <h3 className="text-[17px] font-bold text-[#0b1c30] truncate mt-1">
                {selectedPlace.name}
              </h3>
              <p className="text-[11px] text-[#75777e] truncate">
                {selectedPlace.japaneseName || selectedPlace.originalName || selectedPlace.area}
              </p>

              <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[#44474d]">
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#006b5f]">schedule</span>
                  {getOpeningHoursStr(selectedPlace.openingHours)}
                </span>
                <span>·</span>
                <span>체류 {selectedPlace.estimatedStayMinutes}분</span>
              </div>
            </div>
          </div>

          {/* Costs & Verified Badges */}
          <div className="mt-3 grid grid-cols-2 gap-2 bg-[#eff4ff] p-3 rounded-2xl border border-[#d3e4fe] text-[12px]">
            <div>
              <span className="text-[#75777e]">입장료: </span>
              <span className="font-bold text-[#0b1c30]">
                {selectedPlace.entranceFeeJpy > 0
                  ? `${formatJpy(selectedPlace.entranceFeeJpy)} (${formatKrw(selectedPlace.entranceFeeJpy * 9)})`
                  : '무료'}
              </span>
            </div>
            <div>
              <span className="text-[#75777e]">예상 식비: </span>
              <span className="font-bold text-[#006b5f]">
                {selectedPlace.estimatedMealCostJpy > 0
                  ? `${formatJpy(selectedPlace.estimatedMealCostJpy)} (${formatKrw(selectedPlace.estimatedMealCostJpy * 9)})`
                  : '-'}
              </span>
            </div>
          </div>

          {/* Verification note */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#75777e]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006b5f]">verified</span>
              휴무: {selectedPlace.closedDays.join(', ')}
            </span>
            <span>공식 검증: 2026.09.01</span>
          </div>

          {/* Action CTAs */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenTransitComparison(selectedPlace.name, '숙소')}
              className="px-3.5 h-11 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-bold text-[13px] flex items-center gap-1.5 hover:bg-[#dce9ff]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006b5f]">alt_route</span>
              <span>경로 비교</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenDayPicker(selectedPlace)}
              className="flex-1 h-11 rounded-xl bg-[#000412] text-white font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-md hover:bg-[#0f1e36] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#71f8e4]">add_circle</span>
              <span>내 일정에 추가하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Places List View / Card Feed */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0b1c30]">
            추천 장소 ({filteredPlaces.length}곳)
          </h3>
          <span className="text-[11px] text-[#75777e]">거리 순 정렬</span>
        </div>

        {filteredPlaces.length === 0 ? (
          /* Empty state for search */
          <div className="p-8 bg-white rounded-2xl border border-dashed border-[#c5c6ce] text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#75777e]">
              <span className="material-symbols-outlined text-[24px]">search_off</span>
            </div>
            <p className="font-bold text-[14px] text-[#0b1c30]">일치하는 장소를 찾을 수 없습니다</p>
            <p className="text-[12px] text-[#75777e]">검색어를 변경하거나 필터를 초기화해 보세요.</p>
            <button
              type="button"
              onClick={() => {
                setSearchKeyword('');
                setActiveCategory('all');
                setExcludeMondayClosed(false);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#0f1e36] text-white text-[12px] font-bold"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          filteredPlaces.map((place) => {
            const isSelected = place.id === selectedPlaceId;
            return (
              <div
                key={place.id}
                onClick={() => setSelectedPlaceId(place.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 bg-white ${
                  isSelected
                    ? 'border-[#006b5f] shadow-sm ring-1 ring-[#006b5f]'
                    : 'border-[#c5c6ce]/40 hover:border-[#006b5f]/50'
                }`}
              >
                <img
                  src={place.photoUrl}
                  alt={place.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#006b5f] bg-[#6df5e1]/30 px-2 py-0.5 rounded-full">
                      {place.categoryLabel}
                    </span>
                    <button
                      type="button"
                      aria-label="찜하기"
                      onClick={(e) => toggleWishlist(place.id, e)}
                      className="text-[#75777e] hover:text-[#ba1a1a]"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          likedPlaceIds[place.id] ? 'text-[#ba1a1a]' : ''
                        }`}
                        style={likedPlaceIds[place.id] ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <h4 className="text-[15px] font-bold text-[#0b1c30] truncate mt-0.5">
                    {place.name}
                  </h4>
                  <p className="text-[12px] text-[#75777e] truncate">{place.description}</p>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#44474d]">
                    <span className="font-semibold text-[#006b5f]">
                      {place.entranceFeeJpy > 0 ? formatJpy(place.entranceFeeJpy) : '입장료 무료'}
                    </span>
                    <span>·</span>
                    <span>체류 {place.estimatedStayMinutes}분</span>
                    {place.closedDays.length > 0 && !place.closedDays.includes('연중무휴') && (
                      <>
                        <span>·</span>
                        <span className="text-[#e45839]">휴무: {place.closedDays[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
