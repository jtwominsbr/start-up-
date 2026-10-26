import React, { useState } from 'react';
import { Trip } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  trip,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'kakaopay' | 'tosspay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = (shouldFail = false) => {
    setIsProcessing(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsProcessing(false);
      if (shouldFail) {
        setErrorMessage('결제에 실패했습니다. 결제 수단을 확인하고 다시 시도해 주세요.');
      } else {
        onPaymentSuccess();
        onClose();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000412]/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar border border-[#c5c6ce]/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006b5f] text-[24px]">verified</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30]">스마트 패스 1회권 결제</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#44474d] hover:text-[#0b1c30]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current Trip Preview */}
        <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#d3e4fe] flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#006b5f] uppercase tracking-wider">
            결제 대상 여행 일정
          </span>
          <p className="font-bold text-[15px] text-[#0b1c30] truncate">{trip.title}</p>
          <div className="flex items-center gap-2 text-[12px] text-[#44474d]">
            <span>{trip.startDate} ~ {trip.endDate}</span>
            <span>·</span>
            <span>성인 {trip.travelerCount}명</span>
            <span>·</span>
            <span>{trip.accommodation.name}</span>
          </div>
        </div>

        {/* Price & Benefits Box */}
        <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#c5c6ce]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#006b5f]">SMART PASS 1회 이용권</span>
              <h4 className="font-bold text-[16px] text-[#000412]">평생 보관 및 무제한 기능</h4>
            </div>
            <div className="text-right">
              <span className="text-[22px] font-extrabold text-[#000412]">₩19,000</span>
              <p className="text-[11px] text-[#75777e]">부가가치세 포함</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#c5c6ce]/20 text-[13px] text-[#0b1c30]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#006b5f]">check_circle</span>
              <span>무제한 AI 동선 최적화 & 동행자 실시간 공동 편집</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#006b5f]">check_circle</span>
              <span>최신 휴무일/영업시간 자동 재검증 실시간 알림</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#006b5f]">check_circle</span>
              <span>고화질 1080p 모바일 일정표 및 PDF 무제한 내보내기</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#0b1c30]">결제 수단 선택</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                selectedMethod === 'card'
                  ? 'bg-[#0f1e36] text-white shadow-md'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span className="text-[12px] font-bold">신용·체크카드</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('kakaopay')}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                selectedMethod === 'kakaopay'
                  ? 'bg-[#fee500] text-[#191919] font-bold shadow-md'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              <span className="text-[12px] font-bold">카카오페이</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('tosspay')}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                selectedMethod === 'tosspay'
                  ? 'bg-[#0064ff] text-white shadow-md'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="text-[12px] font-bold">토스페이</span>
            </button>
          </div>
        </div>

        {/* Terms notice */}
        <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[11px] text-[#44474d] leading-relaxed">
          * 카드 정보는 서버에 직접 저장되지 않으며, 전자결제대행사(PG)를 통한 토큰 승인 정보만 암호화되어 안전하게 기록됩니다. 결제 후 7일 이내 미사용 시 전액 환불 가능합니다.
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-medium flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handlePay(false)}
            className="w-full h-13 rounded-2xl bg-[#000412] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg hover:bg-[#0f1e36] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#6df5e1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>결제 승인 처리 중...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px] text-[#71f8e4]">lock</span>
                <span>₩19,000 결제하기</span>
              </>
            )}
          </button>

          {/* Test Fail simulation button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handlePay(true)}
            className="text-[12px] text-[#75777e] hover:text-[#0b1c30] underline self-center mt-1"
          >
            [테스트] 결제 오류 상태 시뮬레이션
          </button>
        </div>
      </div>
    </div>
  );
};
