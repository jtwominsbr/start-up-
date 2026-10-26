import React from 'react';

interface TransitComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromName?: string;
  toName?: string;
}

export const TransitComparisonModal: React.FC<TransitComparisonModalProps> = ({
  isOpen,
  onClose,
  fromName = '아사쿠사 센소지',
  toName = '츠키지 장외시장',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000412]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-[#c5c6ce]/40 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006b5f] text-[24px]">alt_route</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30]">이동 경로 및 교통수단 비교</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#44474d] hover:text-[#0b1c30]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Route section */}
        <div className="p-3 rounded-2xl bg-[#eff4ff] flex items-center justify-between text-[13px] font-bold text-[#0b1c30]">
          <span className="truncate max-w-[140px]">{fromName}</span>
          <span className="material-symbols-outlined text-[#006b5f] text-[18px]">arrow_forward</span>
          <span className="truncate max-w-[140px] text-right">{toName}</span>
        </div>

        {/* 2-Column Comparison Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Public Transit (Recommended) */}
          <div className="p-4 rounded-2xl bg-[#f8f9ff] border-2 border-[#006b5f] flex flex-col gap-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-[#6df5e1] text-[#006f64] px-2 py-0.5 rounded-full">
                추천 경로
              </span>
              <span className="material-symbols-outlined text-[#006b5f] text-[20px]">subway</span>
            </div>

            <div>
              <span className="text-[12px] text-[#44474d]">대중교통 (지하철)</span>
              <p className="text-[20px] font-extrabold text-[#000412]">18분 소요</p>
              <p className="text-[12px] text-[#006b5f] font-semibold">히비야선 환승 1회</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#c5c6ce]/30 text-[12px] text-[#44474d]">
              <div className="flex justify-between">
                <span>이동 거리:</span>
                <span className="font-bold text-[#0b1c30]">3.1 km</span>
              </div>
              <div className="flex justify-between">
                <span>교통 요금:</span>
                <span className="font-bold text-[#006b5f]">¥180 (₩1,620)</span>
              </div>
              <div className="flex justify-between">
                <span>체력 피로도:</span>
                <span className="font-bold text-[#006b5f]">낮음 (에어컨)</span>
              </div>
            </div>
          </div>

          {/* Walking */}
          <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#c5c6ce]/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold bg-[#eff4ff] text-[#44474d] px-2 py-0.5 rounded-full">
                도보 이동
              </span>
              <span className="material-symbols-outlined text-[#44474d] text-[20px]">directions_walk</span>
            </div>

            <div>
              <span className="text-[12px] text-[#44474d]">도보 코스</span>
              <p className="text-[20px] font-extrabold text-[#000412]">48분 소요</p>
              <p className="text-[12px] text-[#75777e]">골목길 경유 코스</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#c5c6ce]/30 text-[12px] text-[#44474d]">
              <div className="flex justify-between">
                <span>이동 거리:</span>
                <span className="font-bold text-[#0b1c30]">3.8 km</span>
              </div>
              <div className="flex justify-between">
                <span>교통 요금:</span>
                <span className="font-bold text-[#006b5f]">₩0 (무료)</span>
              </div>
              <div className="flex justify-between">
                <span>체력 피로도:</span>
                <span className="font-bold text-[#e45839]">높음 (주의)</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-3 rounded-2xl bg-[#eff4ff] text-[12px] text-[#0b1c30] leading-relaxed flex items-start gap-2">
          <span className="material-symbols-outlined text-[#006b5f] text-[18px] shrink-0 mt-0.5">insights</span>
          <p>
            <strong>동선 조언:</strong> 낮 12시 기온 및 오후 일정 피로도를 고려하여 <strong>지하철(히비야선)</strong>을 이용하면 30분 이상을 절약할 수 있습니다.
          </p>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-full h-12 rounded-2xl bg-[#000412] text-white font-bold text-[15px] hover:bg-[#0f1e36] transition-colors"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
