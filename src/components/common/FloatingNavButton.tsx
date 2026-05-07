/**
 * @file FloatingNavButton.tsx
 * @description 페이지 탐색을 돕는 플로팅 버튼 컴포넌트입니다.
 * 시나리오 B: 단일 클릭 시 이전 섹션으로, 더블 클릭 시 최상단으로 이동합니다.
 */

import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingNavButton() {
  const [isVisible, setIsVisible] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 스크롤 위치에 따라 버튼 표시 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤되었을 때 버튼 노출
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 이전 섹션으로 이동하는 로직
   */
  const scrollToPreviousSection = () => {
    // 모든 섹션 요소를 가져옴 (main 태그 내부의 자식들)
    const sections = Array.from(document.querySelectorAll("main > section"));
    const currentScroll = window.scrollY;
    
    // 현재 스크롤 위치보다 위쪽에 있는 섹션들 중 가장 가까운 섹션 찾기
    const prevSection = [...sections]
      .reverse()
      .find((section) => {
        const rect = section.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        // 현재 위치보다 최소 100px 위에 있는 섹션을 찾음 (현재 섹션의 시작점으로 가는 것 방지)
        return absoluteTop < currentScroll - 100;
      });

    if (prevSection) {
      prevSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // 이전 섹션이 없으면 최상단으로
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * 최상단으로 이동하는 로직
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * 단일 클릭과 더블 클릭을 구분하는 핸들러 (시나리오 B)
   */
  const handleClick = () => {
    if (clickTimeoutRef.current) {
      // 더블 클릭으로 판단
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      scrollToTop();
    } else {
      // 단일 클릭 가능성 - 타이머 시작
      clickTimeoutRef.current = setTimeout(() => {
        scrollToPreviousSection();
        clickTimeoutRef.current = null;
      }, 250); // 250ms 이내에 다시 클릭하면 더블 클릭
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-wood text-cream shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="이동 버튼"
    >
      <div className="relative">
        <ArrowUp 
          size={20} 
          strokeWidth={2.5} 
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
      </div>
      
      {/* 툴팁/힌트 (호버 시 노출) */}
      <div className="absolute right-full mr-4 px-3 py-1.5 bg-wood text-cream text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded tracking-wider">
        CLICK: PREV / DBL CLICK: TOP
      </div>
    </button>
  );
}
