/**
 * @file PrivacyConsentModal.tsx
 * @description 앱 진입 시 개인정보 수집 동의를 받기 위한 필수 모달 컴포넌트입니다.
 * 동의 전까지는 배경을 블러 처리하고 다른 상호작용을 차단합니다.
 */

import { ArrowRight } from "lucide-react";
import OlfitLogo from "@/components/common/OlfitLogo";

interface PrivacyConsentModalProps {
  onAgree: () => void;
}

export default function PrivacyConsentModal({ onAgree }: PrivacyConsentModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
      {/* 백드롭: 더욱 짙은 오버레이로 집중도 향상 */}
      <div className="absolute inset-0 bg-wood/80 backdrop-blur-md" />
      
      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-[480px] bg-cream border border-wood/10 shadow-editorial p-8 md:p-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <OlfitLogo height={32} color="#6B4423" />
          </div>
          
          <h2 className="text-2xl font-light tracking-tight text-wood mb-6">
            Privacy & AI Analysis Consent
          </h2>
          
          <div className="text-left space-y-4 mb-10">
            <p className="text-[13px] leading-relaxed text-wood/70 break-keep">
              Olfit은 더욱 정교한 향기 스타일링을 위해 **AI 이미지 분석 시스템**을 활용합니다. 원활한 서비스 이용을 위해 아래 사항에 대한 동의가 필요합니다.
            </p>
            
            <ul className="space-y-3 pt-4 border-t border-wood/5 text-[11px] text-wood/50 tracking-wide uppercase">
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 bg-wood/30 rounded-full mt-1.5 shrink-0" />
                <span>AI 분석을 위한 업로드 이미지 처리 및 임시 세션 활용</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 bg-wood/30 rounded-full mt-1.5 shrink-0" />
                <span>고유 식별자(UUID) 생성을 통한 익명 사용자 구분</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 bg-wood/30 rounded-full mt-1.5 shrink-0" />
                <span>서비스 품질 개선을 위한 분석 데이터의 통계적 활용</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onAgree}
            className="w-full group flex items-center justify-center gap-3 bg-wood text-cream py-4 text-[12px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:bg-wood/90 active:scale-[0.98]"
          >
            Agree and Continue
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-6 text-[10px] text-wood/30 tracking-wider uppercase">
            * 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
