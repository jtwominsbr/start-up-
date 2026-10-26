import React, { useState } from 'react';
import { Trip } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onShowToast: (msg: string) => void;
  onOpenReadOnlyView?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  trip,
  onShowToast,
  onOpenReadOnlyView,
}) => {
  const [showQr, setShowQr] = useState(false);
  const shareUrl = `https://travelplanlab.io/share/${trip.id}`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    onShowToast('클립보드에 링크가 복사되었습니다!');
    onClose();
  };

  const handleKakaoShare = () => {
    onShowToast('카카오톡 동행자 초대 메시지가 발송되었습니다!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#000412]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar border-t border-[#c5c6ce]/40 animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] flex items-center justify-center text-[#006b5f]">
              <span className="material-symbols-outlined text-[22px]">send</span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#0b1c30]">일정 & 예산 공유</h3>
              <p className="text-[12px] text-[#44474d]">동행자와 실시간으로 확인하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#44474d] hover:text-[#0b1c30]"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick share action buttons */}
        <div className="grid grid-cols-3 gap-2.5 py-2">
          <button
            onClick={handleKakaoShare}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#fee500]/20 hover:bg-[#fee500]/30 active:scale-95 transition-all text-[#191919]"
            type="button"
          >
            <div className="w-11 h-11 rounded-full bg-[#fee500] flex items-center justify-center text-[#191919] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">chat</span>
            </div>
            <span className="text-[12px] font-bold">카카오톡 전송</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#eff4ff] hover:bg-[#dce9ff] active:scale-95 transition-all text-[#0b1c30]"
            type="button"
          >
            <div className="w-11 h-11 rounded-full bg-[#0f1e36] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[22px]">link</span>
            </div>
            <span className="text-[12px] font-bold">링크 복사</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#eff4ff] hover:bg-[#dce9ff] active:scale-95 transition-all text-[#0b1c30]"
            type="button"
          >
            <div className="w-11 h-11 rounded-full bg-[#006b5f] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
            </div>
            <span className="text-[12px] font-bold">{showQr ? 'QR 닫기' : 'QR 코드'}</span>
          </button>
        </div>

        {/* QR Code display area if toggled */}
        {showQr && (
          <div className="p-4 bg-[#eff4ff] rounded-2xl flex flex-col items-center gap-2 animate-in zoom-in-95">
            <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs flex items-center justify-center border border-[#c5c6ce]">
              {/* Clean SVG QR mockup */}
              <svg className="w-full h-full text-[#0b1c30]" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" rx="4" />
                <rect x="15" y="15" width="15" height="15" fill="#fff" />
                <rect x="18" y="18" width="9" height="9" />
                <rect x="65" y="10" width="25" height="25" rx="4" />
                <rect x="70" y="15" width="15" height="15" fill="#fff" />
                <rect x="73" y="18" width="9" height="9" />
                <rect x="10" y="65" width="25" height="25" rx="4" />
                <rect x="15" y="70" width="15" height="15" fill="#fff" />
                <rect x="18" y="73" width="9" height="9" />
                <rect x="42" y="15" width="6" height="18" />
                <rect x="42" y="42" width="16" height="16" />
                <rect x="68" y="42" width="18" height="6" />
                <rect x="42" y="68" width="6" height="18" />
                <rect x="68" y="68" width="18" height="18" />
              </svg>
            </div>
            <p className="text-[11px] text-[#44474d]">현장에서 스마트폰 카메라로 스캔하여 즉시 열람</p>
          </div>
        )}

        {/* Shared Link Input Box */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[18px] text-[#75777e]">language</span>
          <input
            className="flex-1 bg-transparent text-[13px] text-[#0b1c30] outline-none truncate font-mono"
            readOnly
            type="text"
            value={shareUrl}
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-[#000412] text-white text-[12px] font-bold hover:bg-[#0f1e36] active:scale-95 transition-all"
            type="button"
          >
            복사
          </button>
        </div>

        {/* Read-Only permission info & tester button */}
        <div className="flex items-center justify-between px-1 py-1 text-[#44474d] text-[12px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#006b5f]">lock_open</span>
            링크를 가진 모든 동행자 읽기 전용 허용
          </span>
          <span className="text-[#006b5f] font-semibold">최신 수정일: 2026.09.21</span>
        </div>

        {onOpenReadOnlyView && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReadOnlyView();
            }}
            className="w-full py-2.5 rounded-xl bg-[#eff4ff] text-[#006b5f] font-bold text-[13px] hover:bg-[#dce9ff] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>비회원 공유 링크 뷰어로 바로 열람하기</span>
          </button>
        )}
      </div>
    </div>
  );
};
