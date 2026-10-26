import React, { useState } from 'react';
import { Trip, BudgetBreakdown, ScreenType } from '../../types';
import { formatKrw, formatJpy } from '../../data/initialData';

interface BudgetScreenProps {
  trip: Trip;
  budget: BudgetBreakdown;
  onNavigate: (screen: ScreenType) => void;
  onOpenPaymentModal: () => void;
  onOpenShareModal: () => void;
  onShowToast: (msg: string) => void;
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  trip,
  budget,
  onNavigate,
  onOpenPaymentModal,
  onOpenShareModal,
  onShowToast,
}) => {
  const [splitCount, setSplitCount] = useState(trip.travelerCount || 2);
  const [currencyMode, setCurrencyMode] = useState<'both' | 'krw' | 'jpy'>('both');

  const perPersonKrw = Math.round(budget.totalKrw / Math.max(1, splitCount));
  const perPersonJpy = Math.round(budget.totalJpy / Math.max(1, splitCount));

  const isOver = budget.overBudgetKrw > 0;

  const handleCopySettlement = () => {
    const text = `[트래블플랜랩] ${trip.title} 여행 정산 알림\n- 총 예산: ${formatKrw(budget.totalKrw)}\n- 1인당 부담금: ${formatKrw(perPersonKrw)} (${formatJpy(perPersonJpy)})\n- 상세 내역: https://travelplanlab.io/share/${trip.id}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    onShowToast('1인당 정산 요청 메시지가 복사되었습니다!');
  };

  return (
    <div className="flex flex-col w-full pb-32 pt-2">
      {/* 1. Header & Title */}
      <div className="px-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider">
              통합 예산 및 정산 관리
            </span>
            <h2 className="text-[20px] font-extrabold text-[#0b1c30]">
              여행 경비 분석
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenShareModal}
              className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#dce9ff]"
              aria-label="공유"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Total Budget Status Card */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#c5c6ce]/40 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-[#75777e]">총 목표 예산</span>
              <p className="text-[24px] font-extrabold text-[#000412]">
                {formatKrw(trip.budgetKrw)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[12px] text-[#75777e]">현재 예상 지출</span>
              <p className="text-[24px] font-extrabold text-[#006b5f]">
                {formatKrw(budget.totalKrw)}
              </p>
              <p className="text-[11px] text-[#75777e]">현지 통화 약 {formatJpy(budget.totalJpy)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[12px] font-bold">
              <span className={isOver ? 'text-[#ba1a1a]' : 'text-[#006b5f]'}>
                {budget.budgetUsagePercent}% 지출 계획됨
              </span>
              <span className={isOver ? 'text-[#ba1a1a]' : 'text-[#44474d]'}>
                {isOver
                  ? `${formatKrw(budget.overBudgetKrw)} 예산 초과`
                  : `${formatKrw(budget.remainingKrw)} 잔여`}
              </span>
            </div>

            <div className="w-full bg-[#dce9ff] h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOver ? 'bg-[#ba1a1a]' : 'bg-[#006b5f]'
                }`}
                style={{ width: `${Math.min(100, budget.budgetUsagePercent)}%` }}
              ></div>
            </div>
          </div>

          {/* Exchange rate notice */}
          <div className="flex items-center justify-between pt-2 border-t border-[#eff4ff] text-[11px] text-[#75777e]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006b5f]">currency_exchange</span>
              적용 기준 환율: 100엔 = 900.0원
            </span>
            <span>검증: 2026.09.01</span>
          </div>
        </div>
      </div>

      {/* 3. Category Breakdown List */}
      <div className="px-4 mb-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0b1c30]">항목별 상세 내역</h3>
          <span className="text-[11px] text-[#75777e]">전체 5개 부문</span>
        </div>

        {/* 1. 숙박비 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c5c6ce]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#0b1c30]">
              <span className="material-symbols-outlined text-[20px]">hotel</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#0b1c30]">숙박비 (4박)</h4>
              <p className="text-[11px] text-[#75777e]">도쿄역 인근 호텔 1실</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#0b1c30]">{formatKrw(budget.accommodationKrw)}</p>
            <p className="text-[11px] text-[#75777e]">{formatJpy(budget.accommodationJpy)}</p>
          </div>
        </div>

        {/* 2. 항공료 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c5c6ce]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006b5f]">
              <span className="material-symbols-outlined text-[20px]">flight</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#0b1c30]">항공료 (왕복)</h4>
              <p className="text-[11px] text-[#75777e]">성인 {trip.travelerCount}명 기준</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#0b1c30]">{formatKrw(budget.flightKrw)}</p>
            <p className="text-[11px] text-[#75777e]">원화 결제</p>
          </div>
        </div>

        {/* 3. 식비 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c5c6ce]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad2] flex items-center justify-center text-[#e45839]">
              <span className="material-symbols-outlined text-[20px]">restaurant</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#0b1c30]">식비 (식도락·카페)</h4>
              <p className="text-[11px] text-[#75777e]">라멘, 스시, 야시장, 디저트</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#0b1c30]">{formatKrw(budget.foodKrw)}</p>
            <p className="text-[11px] text-[#75777e]">{formatJpy(budget.foodJpy)}</p>
          </div>
        </div>

        {/* 4. 교통비 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c5c6ce]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006b5f]">
              <span className="material-symbols-outlined text-[20px]">subway</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#0b1c30]">교통비</h4>
              <p className="text-[11px] text-[#75777e]">지하철 구간별 요금 및 N'EX</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#0b1c30]">{formatKrw(budget.transportKrw)}</p>
            <p className="text-[11px] text-[#75777e]">{formatJpy(budget.transportJpy)}</p>
          </div>
        </div>

        {/* 5. 관광·입장료 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c5c6ce]/40 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#0f1e36]">
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#0b1c30]">관광·입장료</h4>
              <p className="text-[11px] text-[#75777e]">전망대 및 미술관 티켓</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#0b1c30]">{formatKrw(budget.entranceKrw)}</p>
            <p className="text-[11px] text-[#75777e]">{formatJpy(budget.entranceJpy)}</p>
          </div>
        </div>
      </div>

      {/* 4. Dutch Pay / Splitting Settlement Calculator */}
      <div className="px-4 mb-4">
        <div className="bg-white p-4 rounded-3xl border border-[#c5c6ce]/40 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b5f] text-[20px]">calculate</span>
              <h3 className="text-[15px] font-bold text-[#0b1c30]">동행자 1인당 정산 계산기</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (splitCount > 1) setSplitCount(splitCount - 1);
                }}
                disabled={splitCount <= 1}
                className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#0b1c30] font-bold flex items-center justify-center disabled:opacity-30"
              >
                -
              </button>
              <span className="text-[13px] font-bold text-[#0b1c30] w-7 text-center">
                {splitCount}명
              </span>
              <button
                type="button"
                onClick={() => setSplitCount(splitCount + 1)}
                className="w-6 h-6 rounded-md bg-[#eff4ff] text-[#0b1c30] font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#eff4ff] flex items-center justify-between border border-[#d3e4fe]">
            <div>
              <span className="text-[11px] text-[#75777e]">1인당 부담 금액</span>
              <p className="text-[18px] font-extrabold text-[#000412]">
                {formatKrw(perPersonKrw)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#75777e]">현지 엔화 기준</span>
              <p className="text-[16px] font-bold text-[#006b5f]">
                {formatJpy(perPersonJpy)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySettlement}
            className="w-full h-11 rounded-xl bg-[#0f1e36] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#000412] active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>동행자에게 정산 금액 알림 메시지 복사</span>
          </button>
        </div>
      </div>

      {/* 5. Transit Pass Saving Tip */}
      <div className="px-4 mb-4">
        <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#d3e4fe] flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-[#006b5f] shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <div className="text-[12px] text-[#44474d] leading-relaxed">
            <strong className="text-[#0b1c30] font-bold">교통 패스 절약 조언: </strong>
            도쿄 서브웨이 72시간 패스(¥1,500)를 사전에 준비하시면 현재 계획된 지하철 요금 대비
            약 <strong>₩22,000</strong>을 추가 절약할 수 있습니다.
          </div>
        </div>
      </div>

      {/* 6. Smart Pass Upgrade Banner (if unpaid) */}
      {!trip.isSmartPassPaid && (
        <div className="px-4">
          <div className="p-4 rounded-3xl bg-[#0f1e36] text-white flex flex-col gap-2 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-28 h-28 bg-[#006b5f]/40 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#71f8e4] uppercase tracking-wider">
                SMART PASS
              </span>
              <span className="text-[16px] font-extrabold text-[#71f8e4]">₩19,000</span>
            </div>
            <h4 className="text-[16px] font-bold">
              상세 정산 내역 엑셀·PDF 내보내기
            </h4>
            <p className="text-[12px] text-[#c5c6ce] leading-relaxed">
              1회 결제로 평생 보관되며, 동행자와 함께 실시간 공동 편집 및 무제한 PDF 출력이 가능합니다.
            </p>
            <button
              type="button"
              onClick={onOpenPaymentModal}
              className="mt-1 h-11 rounded-xl bg-[#71f8e4] text-[#00201c] font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#6df5e1] active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>스마트 패스 1회권 결제하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
