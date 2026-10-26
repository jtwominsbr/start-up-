import React, { useState } from 'react';
import { Place, DaySchedule } from '../../types';

interface DayPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  daySchedules: DaySchedule[];
  onAddPlaceToDay: (place: Place, dayIndex: number) => void;
  onNavigateToItinerary: (dayIndex: number) => void;
}

export const DayPickerModal: React.FC<DayPickerModalProps> = ({
  isOpen,
  onClose,
  place,
  daySchedules,
  onAddPlaceToDay,
  onNavigateToItinerary,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !place) return null;

  const handleConfirm = () => {
    onAddPlaceToDay(place, selectedDay);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      onNavigateToItinerary(selectedDay);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#000412]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar border-t border-[#c5c6ce]/40 animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider">
              일정 배치 날짜 선택
            </span>
            <h3 className="text-[18px] font-bold text-[#0b1c30]">어느 날짜에 추가할까요?</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#44474d] hover:text-[#0b1c30]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Selected Place Mini Card */}
        <div className="p-3.5 rounded-2xl bg-[#f8f9ff] border border-[#c5c6ce]/40 flex items-center gap-3">
          <img
            src={place.photoUrl}
            alt={place.name}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-[#006b5f] bg-[#6df5e1]/30 px-2 py-0.5 rounded-full">
              {place.categoryLabel}
            </span>
            <h4 className="text-[15px] font-bold text-[#0b1c30] truncate mt-0.5">{place.name}</h4>
            <p className="text-[12px] text-[#44474d]">권장 체류: {place.estimatedStayMinutes}분</p>
          </div>
        </div>

        {/* Day selection list */}
        <div className="space-y-2">
          {daySchedules.map((schedule) => {
            const isSelected = selectedDay === schedule.dayIndex;
            const spotCount = schedule.items.length;
            return (
              <button
                key={schedule.dayIndex}
                type="button"
                onClick={() => setSelectedDay(schedule.dayIndex)}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all border ${
                  isSelected
                    ? 'bg-[#0f1e36] text-white border-[#0f1e36] shadow-md'
                    : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c5c6ce]/30 hover:bg-[#eff4ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[14px] ${
                      isSelected ? 'bg-[#71f8e4] text-[#00201c]' : 'bg-[#dce9ff] text-[#0b1c30]'
                    }`}
                  >
                    {schedule.dayIndex}일
                  </div>
                  <div>
                    <p className="font-bold text-[14px]">
                      {schedule.dayIndex}일차 ({schedule.date.slice(5).replace('-', '.')} {schedule.dayOfWeek})
                    </p>
                    <p className={`text-[12px] ${isSelected ? 'text-[#b8c7e6]' : 'text-[#75777e]'}`}>
                      현재 {spotCount}개 스팟 · 상태: {schedule.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      schedule.status === '과밀'
                        ? 'bg-[#ffdad2] text-[#8c1900]'
                        : schedule.status === '여유'
                        ? 'bg-[#6df5e1] text-[#00201c]'
                        : 'bg-[#dce9ff] text-[#0b1c30]'
                    }`}
                  >
                    {schedule.status}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#71f8e4] text-[20px]">
                      check_circle
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isAdded}
          className="w-full h-13 rounded-2xl bg-[#000412] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg hover:bg-[#0f1e36] active:scale-95 transition-all mt-1"
        >
          {isAdded ? (
            <>
              <span className="material-symbols-outlined text-[20px] text-[#71f8e4]">check</span>
              <span>{selectedDay}일차에 추가 완료! 이동 중...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>{selectedDay}일차 일정에 추가하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
