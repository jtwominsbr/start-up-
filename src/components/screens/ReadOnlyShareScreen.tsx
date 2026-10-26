import React, { useState } from 'react';
import { Trip, DaySchedule } from '../../types';
import { formatKrw, formatJpy } from '../../data/initialData';

interface ReadOnlyShareScreenProps {
  trip: Trip;
  daySchedules: DaySchedule[];
  onExitReadOnly: () => void;
  onShowToast: (msg: string) => void;
}

export const ReadOnlyShareScreen: React.FC<ReadOnlyShareScreenProps> = ({
  trip,
  daySchedules,
  onExitReadOnly,
  onShowToast,
}) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const currentSchedule =
    daySchedules.find((d) => d.dayIndex === selectedDay) || daySchedules[0];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] pb-24">
      {/* Top Read-Only Bar */}
      <div className="bg-[#0f1e36] text-white px-4 py-2.5 flex items-center justify-between text-[12px] shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#71f8e4]">lock</span>
          <span className="font-semibold">동행자 전용 읽기 전용 공유 모드</span>
        </div>
        <button
          type="button"
          onClick={onExitReadOnly}
          className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold"
        >
          편집 모드로 돌아가기
        </button>
      </div>

      {/* Trip Header Banner */}
      <div className="p-4 bg-white border-b border-[#c5c6ce]/30 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#006b5f] text-[11px] font-bold">
            공유된 여행 일정표
          </span>
          <span className="text-[12px] text-[#75777e]">최신 동기화 완료</span>
        </div>
        <h1 className="text-[20px] font-extrabold text-[#0b1c30]">{trip.title}</h1>
        <p className="text-[13px] text-[#44474d]">
          {trip.startDate} ~ {trip.endDate} (5일간) · 인원 {trip.travelerCount}명 · 숙소: {trip.accommodation.name}
        </p>

        {/* Action Button */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onShowToast('일정표 이미지가 클립보드에 복사되었습니다.')}
            className="flex-1 h-10 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#dce9ff]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#006b5f]">image</span>
            <span>일정 이미지 캡처</span>
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              onShowToast('공유 링크가 복사되었습니다!');
            }}
            className="px-3.5 h-10 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-bold text-[12px] flex items-center gap-1 hover:bg-[#dce9ff]"
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="px-4 py-3 bg-[#eff4ff]/60 border-b border-[#c5c6ce]/20">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {daySchedules.map((schedule) => (
            <button
              key={schedule.dayIndex}
              type="button"
              onClick={() => setSelectedDay(schedule.dayIndex)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                selectedDay === schedule.dayIndex
                  ? 'bg-[#000412] text-white shadow-xs'
                  : 'bg-white text-[#44474d] border border-[#c5c6ce]/30'
              }`}
            >
              {schedule.dayIndex}일차 ({schedule.dayOfWeek})
            </button>
          ))}
        </div>
      </div>

      {/* Day Timeline */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[12px] text-[#75777e]">
          <span>
            총 {currentSchedule.items.length}개 스팟 · 활동시간 약{' '}
            {Math.floor(currentSchedule.totalActivityMinutes / 60)}시간
          </span>
          <span className="font-bold text-[#006b5f]">
            예상 경비 {formatJpy(currentSchedule.totalExpenseJpy)}
          </span>
        </div>

        {currentSchedule.items.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-xs border border-[#c5c6ce]/40 flex gap-3">
            <img
              src={item.place.photoUrl}
              alt={item.place.name}
              className="w-18 h-18 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#006b5f]">
                  {item.startTime} ~ {item.endTime}
                </span>
                <span className="text-[11px] text-[#75777e]">체류 {item.stayMinutes}분</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#0b1c30] truncate mt-0.5">
                {idx + 1}. {item.place.name}
              </h3>
              <p className="text-[11px] text-[#75777e] truncate">{item.place.address || item.place.area}</p>
              <div className="mt-1 text-[11px] font-semibold text-[#006b5f]">
                {item.place.entranceFeeJpy > 0
                  ? `입장료 ${formatJpy(item.place.entranceFeeJpy)}`
                  : item.place.estimatedMealCostJpy > 0
                  ? `예상 식비 ${formatJpy(item.place.estimatedMealCostJpy)}`
                  : '입장료 무료'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
