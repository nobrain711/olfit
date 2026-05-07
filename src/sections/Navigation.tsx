/**
 * @file Navigation.tsx
 * @description 상단 네비게이션 바와 전체 화면 메뉴 오버레이를 담당하는 컴포넌트입니다.
 * 스크롤 위치에 따른 헤더 디자인 변경 및 모바일 대응 메뉴 기능을 포함합니다.
 */

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useIsScrolled } from "@/hooks/useIntersectionObserver";

export default function Navigation() {
  // 스크롤이 80px 이상 내려갔는지 여부를 감지하여 헤더 스타일 전환에 사용
  const isScrolled = useIsScrolled(80);
  
  // 전체 화면 메뉴의 열림/닫힘 상태 관리
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 열림 시 바디 스크롤 차단
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // 워터마킹: 개발자 도구 콘솔에 시그니처 출력
  useEffect(() => {
    console.log(
      "%cOlfit - Authored by JJonyeok (2026)",
      "color: #4A3E3E; font-size: 12px; font-weight: bold; border-left: 3px solid #4A3E3E; padding-left: 10px;"
    );
  }, []);

  // 네비게이션 메뉴 링크 데이터
  const navLinks = [
    { label: "컨셉", href: "#philosophy" },
    { label: "향기 가이드", href: "#guide" },
    { label: "AI 인터뷰", href: "#interview" },
    { label: "분석 리포트", href: "#report" },
    { label: "안전성", href: "#safety" },
  ];

  return (
    <>
      {/* 상단 고정 헤더 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-cream/95 backdrop-blur-sm border-b border-wood/5 h-14 md:h-16" 
            : "bg-transparent h-16 md:h-20" 
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 h-full flex items-center justify-between relative">
          {/* 왼쪽 영역: 메뉴 버튼 */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="메뉴 열기"
              className={`flex items-center gap-2 text-[10px] md:text-[11px] font-medium uppercase tracking-widest hover:opacity-60 transition-all duration-300 ${
                isScrolled ? "text-wood" : "text-cream"
              }`}
            >
              <Menu size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>

          {/* 중앙 영역: 로고 */}
          <a
            href="#"
            data-author="jjonyeok"
            className={`absolute left-1/2 -translate-x-1/2 text-sm md:text-base font-light tracking-[0.3em] uppercase transition-all duration-500 ${
              isScrolled ? "text-wood" : "text-cream"
            }`}
          >
            {/* Olfit-ID: 2026-JJY-SIGN */}
            Olfit
          </a>

          {/* 오른쪽 영역: 빈 공간 (비율 유지용) */}
          <div className="flex items-center invisible pointer-events-none">
            <div className="w-[50px]"></div>
          </div>
        </div>
      </header>

      {/* 전체 화면 메뉴 오버레이 */}
      <div
        className={`fixed inset-0 z-[60] bg-cream/98 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* 메뉴 상단: 닫기 버튼 */}
          <div className="h-16 md:h-20 flex items-center justify-end px-6 md:px-8 flex-shrink-0">
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest hover:opacity-60 transition-opacity duration-300 text-wood"
            >
              <span>Close</span>
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* 메뉴 중앙: 링크 리스트 */}
          <nav className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
            <div className="space-y-2 md:space-y-4">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="group py-4 md:py-6 border-b border-wood/10 flex items-center justify-between hover:border-wood/30 transition-colors"
                  style={{
                    transitionDelay: menuOpen ? `${i * 50}ms` : "0ms",
                  }}
                >
                  <span
                    className={`text-3xl sm:text-4xl md:text-5xl font-light tracking-tight transition-all duration-700 ${
                      menuOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-4 opacity-0"
                    }`}
                  >
                    {link.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] md:text-[11px] font-mono text-wood/20 group-hover:text-wood/50 transition-colors duration-500 ${
                      menuOpen ? "opacity-100" : "opacity-0"
                    }`}>
                      VIEW SECTION
                    </span>
                    <span className="text-[10px] md:text-[12px] font-mono text-wood/30 group-hover:text-wood transition-colors duration-300">
                      0{i + 1}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </nav>

          {/* 메뉴 하단: 카피라이트 */}
          <div className="max-w-2xl mx-auto w-full px-6 pb-12 flex-shrink-0">
            <p className="text-[10px] md:text-[11px] text-wood/40 tracking-widest uppercase">
              © 2026 Olfit. AI Scent Stylist.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
