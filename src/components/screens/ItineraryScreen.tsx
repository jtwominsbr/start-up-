import React, { useState } from 'react';
import { Trip, DaySchedule, ItineraryItem, ScreenType } from '../../types';
import { formatJpy, formatKrw } from '../../data/initialData';

interface ItineraryScreenProps {
  trip: Trip;
  daySchedules: DaySchedule[];
  selectedDayIndex: number;
  onSelectDayIndex: (index: number) => void;
  onUpdateDaySchedule: (updated: DaySchedule) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenPaymentModal: () => void;
  onOpenShareModal: () => void;
  onOpenTransitComparison: (fromName: string, toName: string) => void;
  onShowToast: (msg: string) => void;
  onReorderItem: (dayIndex: number, itemId: string, direction: 'up' | 'down') => void;
  onDeleteItem: (dayIndex: number, itemId: string) => void;
  onAdjustStayTime: (dayIndex: number, itemId: string, deltaMinutes: number) => void;
  onReoptimizeDay: (dayIndex: number) => void;
}

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  trip,
  daySchedules,
  selectedDayIndex,
  onSelectDayIndex,
  onNavigate,
  onOpenPaymentModal,
  onOpenShareModal,
  onOpenTransitComparison,
  onShowToast,
  onReorderItem,
  onDeleteItem,
  onAdjustStayTime,
  onReoptimizeDay,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  const currentSchedule =
    daySchedules.find((d) => d.dayIndex === selectedDayIndex) || daySchedules[0];

  const handleOptimizeClick = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      onReoptimizeDay(selectedDayIndex);
      setIsOptimizing(false);
      onShowToast(`${selectedDayIndex}일차 동선이 최단 이동 경로로 재정렬되었습니다!`);
    }, 700);
  };

  const handleExportImage = () => {
    setIsExportingImage(true);
    setTimeout(() => {
      setIsExportingImage(false);
      onShowToast('1080p 고화질 여행 일정표 이미지가 다운로드되었습니다!');
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full pb-32 pt-2">
      {/* 1. Trip Summary Card */}
      <div className="px-4 mb-3">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#006b5f] bg-[#6df5e1]/30 px-2 py-0.5 rounded-full">
                  동선 최적화 활성화
                </span>
                {trip.isSmartPassPaid ? (
                  <span className="text-[11px] font-bold text-[#006f64] bg-[#6df5e1] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    스마트 패스 적용
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPaymentModal}
                    className="text-[11px] font-bold text-[#8c1900] bg-[#ffdad2] px-2 py-0.5 rounded-full flex items-center gap-0.5 hover:bg-[#ffb4a6]"
                  >
                    <span>무료 체험 중 · 패스 전환</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  </button>
                )}
              </div>
              <h2 className="text-[18px] font-extrabold text-[#0b1c30] mt-1 truncate">
                {trip.title}
              </h2>
              <p className="text-[12px] text-[#75777e] mt-0.5">
                {trip.startDate} ~ {trip.endDate} (5일간) · 성인 {trip.travelerCount}명
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenShareModal}
              className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#dce9ff]"
              aria-label="공유하기"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#eff4ff]">
            <button
              type="button"
              disabled={isOptimizing}
              onClick={handleOptimizeClick}
              className="h-10 rounded-xl bg-[#eff4ff] text-[#006b5f] font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#dce9ff] active:scale-95 transition-all"
            >
              {isOptimizing ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">alt_route</span>
              )}
              <span>동선 재최적화 (AI)</span>
            </button>

            <button
              type="button"
              disabled={isExportingImage}
              onClick={handleExportImage}
              className="h-10 rounded-xl bg-[#0f1e36] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#000412] active:scale-95 transition-all"
            >
              {isExportingImage ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  hourglass_empty
                </span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">download</span>
              )}
              <span>일정 이미지 저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Day Tabs (1일차 ~ 5일차) */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {daySchedules.map((schedule) => {
            const isSelected = schedule.dayIndex === selectedDayIndex;
            return (
              <button
                key={schedule.dayIndex}
                type="button"
                onClick={() => onSelectDayIndex(schedule.dayIndex)}
                className={`px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[76px] transition-all ${
                  isSelected
                    ? 'bg-[#000412] text-white shadow-md scale-105'
                    : 'bg-white text-[#44474d] border border-[#c5c6ce]/40 hover:bg-[#eff4ff]'
                }`}
              >
                <span className="text-[13px] font-bold">
                  {schedule.dayIndex}일차
                </span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#71f8e4]' : 'text-[#75777e]'}`}>
                  {schedule.date.slice(5).replace('-', '.')} ({schedule.dayOfWeek})
                </span>
                <span
                  className={`text-[9px] mt-1 px-1.5 py-0.2 rounded-full font-semibold ${
                    schedule.status === '과밀'
                      ? 'bg-[#ffdad2] text-[#8c1900]'
                      : schedule.status === '여유'
                      ? 'bg-[#6df5e1] text-[#00201c]'
                      : isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#eff4ff] text-[#0b1c30]'
                  }`}
                >
                  {schedule.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Day Summary Info Bar */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between bg-[#eff4ff] px-4 py-2.5 rounded-2xl border border-[#d3e4fe] text-[12px]">
          <div className="flex items-center gap-1.5 text-[#0b1c30]">
            <span className="material-symbols-outlined text-[16px] text-[#006b5f]">schedule</span>
            <span className="font-bold">
              총 {Math.floor(currentSchedule.totalActivityMinutes / 60)}시간{' '}
              {currentSchedule.totalActivityMinutes % 60}분 활동
            </span>
            <span className="text-[#75777e]">({currentSchedule.items.length}개 스팟)</span>
          </div>
          <div className="font-bold text-[#006b5f]">
            예상 {formatJpy(currentSchedule.totalExpenseJpy)}
          </div>
        </div>
      </div>

      {/* 4. Warning Cards (if conflicts exist) */}
      {currentSchedule.warnings && currentSchedule.warnings.length > 0 && (
        <div className="px-4 mb-4 flex flex-col gap-2">
          {currentSchedule.warnings.map((warn) => (
            <div
              key={warn.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                warn.type === 'closure'
                  ? 'bg-[#ffdad2]/50 border-[#ffb4a6] text-[#8c1900]'
                  : warn.type === 'transit'
                  ? 'bg-[#fee500]/20 border-[#fee500] text-[#713f12]'
                  : 'bg-[#dce9ff]/60 border-[#b8c7e6] text-[#0c1b33]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                {warn.type === 'closure'
                  ? 'event_busy'
                  : warn.type === 'transit'
                  ? 'warning'
                  : 'density_medium'}
              </span>
              <div className="flex-1 min-w-0 text-[12px]">
                <div className="flex items-center justify-between">
                  <strong className="text-[13px] font-bold">{warn.title}</strong>
                  {warn.actionLabel && (
                    <button
                      type="button"
                      onClick={() => onNavigate('explore')}
                      className="px-2 py-0.5 rounded-md bg-white/80 font-bold hover:bg-white text-[11px] shadow-xs"
                    >
                      장소 교체
                    </button>
                  )}
                </div>
                <p className="mt-0.5 leading-relaxed">{warn.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Interactive Timeline Items */}
      <div className="px-4 flex flex-col">
        {currentSchedule.items.length === 0 ? (
          /* Empty state */
          <div className="p-8 bg-white rounded-3xl border border-dashed border-[#c5c6ce] text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#75777e]">
              <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            </div>
            <p className="font-bold text-[14px] text-[#0b1c30]">
              아직 {selectedDayIndex}일차에 추가된 장소가 없습니다.
            </p>
            <p className="text-[12px] text-[#75777e]">
              여행지 탐색 탭에서 가고 싶은 명소나 맛집을 추가해 보세요.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="mt-2 px-4 py-2 rounded-xl bg-[#000412] text-white text-[13px] font-bold"
            >
              장소 탐색하러 가기
            </button>
          </div>
        ) : (
          currentSchedule.items.map((item, idx) => {
            const isLast = idx === currentSchedule.items.length - 1;

            return (
              <div key={item.id} className="relative flex flex-col">
                {/* Spot Card */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40 flex flex-col gap-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0f1e36] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[13px] font-bold text-[#006b5f]">
                        {item.startTime} ~ {item.endTime}
                      </span>
                    </div>

                    {/* Reorder & delete action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="위로 이동"
                        disabled={idx === 0}
                        onClick={() => onReorderItem(selectedDayIndex, item.id, 'up')}
                        className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#44474d] hover:text-[#0b1c30] flex items-center justify-center disabled:opacity-20"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        aria-label="아래로 이동"
                        disabled={isLast}
                        onClick={() => onReorderItem(selectedDayIndex, item.id, 'down')}
                        className="w-7 h-7 rounded-lg bg-[#eff4ff] text-[#44474d] hover:text-[#0b1c30] flex items-center justify-center disabled:opacity-20"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        aria-label="삭제"
                        onClick={() => onDeleteItem(selectedDayIndex, item.id)}
                        className="w-7 h-7 rounded-lg bg-[#ffdad2]/40 text-[#e45839] hover:bg-[#ffdad2] flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Spot info body */}
                  <div className="flex gap-3">
                    <img
                      src={item.place.photoUrl}
                      alt={item.place.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#006b5f] bg-[#6df5e1]/30 px-2 py-0.5 rounded-full">
                          {item.place.categoryLabel}
                        </span>
                        {item.warning && (
                          <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.5 rounded-full">
                            주의
                          </span>
                        )}
                      </div>
                      <h3 className="text-[16px] font-bold text-[#0b1c30] truncate mt-0.5">
                        {item.place.name}
                      </h3>
                      <p className="text-[11px] text-[#75777e] truncate">
                        {item.place.japaneseName || item.place.originalName || item.place.area}
                      </p>
                      <p className="text-[11px] text-[#44474d] mt-1 truncate">
                        영업시간: {typeof item.place.openingHours === 'string' ? item.place.openingHours : item.place.openingHours?.monday || '09:00 - 18:00'}
                      </p>
                    </div>
                  </div>

                  {/* Stay Time Adjuster & Expense tags */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#eff4ff] text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#75777e]">체류:</span>
                      <button
                        type="button"
                        onClick={() => onAdjustStayTime(selectedDayIndex, item.id, -15)}
                        disabled={item.stayMinutes <= 30}
                        className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#0b1c30] font-bold flex items-center justify-center hover:bg-[#dce9ff] disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#0b1c30] w-12 text-center">
                        {item.stayMinutes}분
                      </span>
                      <button
                        type="button"
                        onClick={() => onAdjustStayTime(selectedDayIndex, item.id, 15)}
                        className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#0b1c30] font-bold flex items-center justify-center hover:bg-[#dce9ff]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right font-semibold text-[#006b5f]">
                      {item.place.entranceFeeJpy > 0
                        ? `입장료 ${formatJpy(item.place.entranceFeeJpy)}`
                        : item.place.estimatedMealCostJpy > 0
                        ? `식비 ${formatJpy(item.place.estimatedMealCostJpy)}`
                        : '입장료 무료'}
                    </div>
                  </div>
                </div>

                {/* Transit connector line & pill to next place */}
                {!isLast && (
                  <div className="relative py-3 flex items-center justify-center">
                    {/* Vertical connecting line */}
                    <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-dashed border-l-2 border-dashed border-[#c5c6ce]"></div>

                    {/* Transit pill */}
                    <div className="relative z-10 flex items-center gap-2 bg-[#eff4ff] px-3.5 py-1.5 rounded-full border border-[#d3e4fe] shadow-xs text-[11px] text-[#0b1c30]">
                      <span className="material-symbols-outlined text-[15px] text-[#006b5f]">
                        {item.transitType === 'transit' || item.transportMode === '대중교통' ? 'subway' : 'directions_walk'}
                      </span>
                      <span className="font-bold">
                        {item.transitLineName ? `${item.transitLineName} ` : ''}
                        {item.travelMinutes}분 소요
                      </span>
                      {item.transportCostJpy > 0 && (
                        <span className="text-[#75777e]">({formatJpy(item.transportCostJpy)})</span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          onOpenTransitComparison(
                            item.place.name,
                            currentSchedule.items[idx + 1]?.place?.name || '다음 장소'
                          )
                        }
                        className="text-[#006b5f] font-bold hover:underline pl-1 border-l border-[#c5c6ce]"
                      >
                        경로 비교
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Spot Floating Button */}
      <div className="px-4 mt-4">
        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className="w-full h-12 rounded-2xl border-2 border-dashed border-[#006b5f]/50 text-[#006b5f] font-bold text-[14px] flex items-center justify-center gap-2 bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>{selectedDayIndex}일차에 장소 추가하기</span>
        </button>
      </div>
    </div>
  );
};
