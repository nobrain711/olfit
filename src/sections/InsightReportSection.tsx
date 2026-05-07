/**
 * @file InsightReportSection.tsx
 * @description AI 인터뷰 결과를 바탕으로 사용자의 향기 아우라를 분석하여 시각화해 주는 섹션입니다.
 * 분기된 리포트(Personal/Space)와 레이어링 레시피를 포함합니다.
 */

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import RadarChart from "@/components/common/RadarChart";
import LayeringRecipe from "@/components/report/LayeringRecipe";
import SimilarAuras from "@/components/report/SimilarAuras";
import { radarData, auras } from "@/data/reportData";
import { getLayeringRecommendation } from "@/data/recommendationEngine";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { useRef, useMemo } from "react";
import type { AnalysisResults } from "@/types";

export default function InsightReportSection({ results }: { results: AnalysisResults | null }) {
  const { ref: ref1, isVisible: vis1 } = useIntersectionObserver();
  const { ref: ref2, isVisible: vis2 } = useIntersectionObserver();
  const { ref: ref3, isVisible: vis3 } = useIntersectionObserver();
  const reportRef = useRef<HTMLDivElement>(null);

  // 다이내믹 데이터 계산
  const layeringData = useMemo(() => getLayeringRecommendation(results), [results]);

  // 사용자의 선택에 따른 가변적인 로직 생성
  const dynamicLogicSteps = [
    `${results?.fashionStyle || 'Minimal'} 스타일 → 그에 어울리는 현대적 텍스처 치환`,
    `${results?.personalMood || 'Casual'} → 해당 분위기를 극대화하는 향기 노트 배합`,
    `추천 베이스: ${layeringData?.main.name} (${layeringData?.main.family})`,
    "도시의 금속 질감과 자연의 조화로운 레이어링 완성",
  ];

  // 인터뷰 결과에 따른 레이더 차트 데이터 동적 계산
  const getDynamicRadarData = () => {
    if (!results) return radarData;

    // 기본값 복사
    const baseData = [
      { axis: "플로랄", value: 0.2 },
      { axis: "우디", value: 0.2 },
      { axis: "오리엔탈", value: 0.2 },
      { axis: "프레시", value: 0.2 },
      { axis: "구르망", value: 0.2 },
    ];

    // Mood mapping
    const mood = results.personalMood || "";
    if (mood.includes("로맨틱")) baseData[0].value += 0.5;
    if (mood.includes("단정한")) baseData[1].value += 0.4;
    if (mood.includes("자유로운")) baseData[3].value += 0.5;
    if (mood.includes("시그니처")) baseData[2].value += 0.5;

    // Fashion mapping
    const fashion = results.fashionStyle || "";
    if (fashion.includes("미니멀")) { baseData[1].value += 0.3; baseData[3].value += 0.2; }
    if (fashion.includes("고프코어")) { baseData[3].value += 0.4; baseData[1].value += 0.2; }
    if (fashion.includes("빈티지")) { baseData[2].value += 0.4; baseData[1].value += 0.2; }
    if (fashion.includes("아방가르드")) { baseData[4].value += 0.5; baseData[2].value += 0.2; }

    // 값 제한 (0.1 ~ 0.95)
    return baseData.map(d => ({
      ...d,
      value: Math.max(0.1, Math.min(0.95, d.value + (Math.random() * 0.1))) // 약간의 랜덤성 추가
    }));
  };

  const currentRadarData = getDynamicRadarData();

  // 결과에 따른 다이내믹 테마 결정
  const getThemeColors = () => {
    if (!results) return { bg: "bg-cream", accent: "text-wood", border: "border-wood/10" };
    
    const sortedData = [...currentRadarData].sort((a, b) => b.value - a.value);
    const dominantScent = sortedData[0].axis;
    
    switch (dominantScent) {
      case "플로랄": return { bg: "bg-[#FFF5F5]", accent: "text-[#D63D6C]", border: "border-[#D63D6C]/20" };
      case "우디": return { bg: "bg-[#F4F1ED]", accent: "text-[#5D4037]", border: "border-[#5D4037]/20" };
      case "오리엔탈": return { bg: "bg-[#FCF8F2]", accent: "text-[#B45309]", border: "border-[#B45309]/20" };
      case "프레시": return { bg: "bg-[#F0F9FF]", accent: "text-[#0369A1]", border: "border-[#0369A1]/20" };
      case "구르망": return { bg: "bg-[#FFFBEB]", accent: "text-[#92400E]", border: "border-[#92400E]/20" };
      default: return { bg: "bg-cream", accent: "text-wood", border: "border-wood/10" };
    }
  };

  const theme = getThemeColors();

  // 리포트 이미지 저장 함수
  const saveReportAsImage = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#FDFCF0", // cream bg (기본값)
        scale: 2, // 고해상도
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Olfit_Report.png`;
      link.click();
    } catch (err) {
      console.error("이미지 저장 실패:", err);
    }
  };

  // 텍스트 내의 <br/> 태그를 실제 줄바꿈으로 변환하여 렌더링하는 헬퍼
  const renderText = (text: string) => {
    return text.split("<br/>").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("<br/>").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section id="report" className={`${theme.bg} py-24 md:py-40 transition-colors duration-1000`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        {/* 결과가 없을 때 보여줄 안내 문구 */}
        {!results && (
          <div className="max-w-2xl mx-auto text-center py-20 border border-wood/10 rounded-sm">
            <p className="text-wood/40 uppercase tracking-widest text-[11px] mb-4">Awaiting Analysis</p>
            <h2 className="text-xl sm:text-2xl font-light mb-8 break-keep px-4 text-wood">
              AI 인터뷰를 완료하면 <span className="hidden sm:inline"><br/></span> 당신만의 아우라 리포트가 생성됩니다.
            </h2>
            <a href="#interview" className="inline-block border border-wood/30 px-8 py-3 text-[11px] uppercase tracking-widest hover:bg-wood hover:text-cream transition-all duration-400">
              인터뷰 시작하기
            </a>
          </div>
        )}

        {results && (
          <>
            {/* 섹션 타이틀 및 저장 버튼 */}
            <div ref={ref1} className={`flex flex-col items-center mb-20 transition-all duration-800 ${vis1 || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="label-upper text-wood/40 mb-4">Diagnosis Report</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight break-keep text-wood mb-8">
                당신의 아우라 진단
              </h2>
              
              <button 
                onClick={saveReportAsImage}
                className="flex items-center gap-2 px-6 py-2.5 border border-wood/20 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-wood hover:text-cream transition-all duration-300"
              >
                <Download size={14} />
                Save Report as Image
              </button>
            </div>

            <div ref={reportRef} className="p-4 md:p-8 rounded-lg">
              {/* 01. Personal Aura Section */}
              <div className="mb-32 animate-in fade-in duration-1000">
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wood/30">Personal Analysis</span>
                  <h3 className={`text-xl font-light tracking-widest uppercase ${theme.accent}`}>Personal Aura</h3>
                  <div className="h-px bg-wood/10 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                  {/* 좌측: 레이더 차트 및 상세 수치 */}
                  <div ref={ref2} className={`transition-all duration-800 delay-100 ${vis2 || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-wood/40 mb-12 text-center">
                      Olfactory Silhouette
                    </p>
                    <RadarChart data={currentRadarData} forceDraw={!!results} />
                    <div className="flex justify-center gap-6 sm:gap-8 mt-12">
                      {currentRadarData.map((d) => (
                        <div key={d.axis} className="text-center">
                          <p className={`text-base sm:text-lg font-light ${theme.accent}`}>{Math.round(d.value * 100)}%</p>
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-wood/40 mt-1">{d.axis}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 우측: 개인 번역 로직 및 조향사 노트 */}
                  <div ref={ref3} className={`transition-all duration-800 delay-200 ${vis3 || results ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-wood/40 mb-8">
                      Personal Translation Logic
                    </p>
                    <div className="space-y-0 mb-12">
                      {dynamicLogicSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`group py-5 border-b ${theme.border} flex items-start gap-4 hover:bg-wood/[0.01] transition-colors duration-300 px-2 -mx-2`}
                        >
                          <span className="text-[11px] font-medium text-wood/30 mt-0.5 font-mono">
                            0{i + 1}
                          </span>
                          <p className="text-[15px] leading-relaxed text-wood/70 group-hover:text-wood transition-colors duration-300 break-keep">
                            {renderText(step)}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`p-6 bg-wood/5 border-l-2 ${theme.border.replace('border-b', 'border-l')} italic`}>
                      <p className="text-[13px] text-wood/70 leading-relaxed break-keep">
                        "당신이 지향하는 {results.fashionStyle} 스타일과 {results.personalMood} 분위기를 현대적인 후각 언어로 치환했습니다. 
                        선택하신 무드가 어우러진 잔향은 당신의 아우라를 더욱 선명하게 완성할 것입니다."
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-wood/40 mt-4 not-italic">— Senior Perfumer L</p>
                    </div>
                  </div>
                </div>

                <LayeringRecipe fashionStyle={results.fashionStyle || "Minimal"} data={layeringData} />
                
                <SimilarAuras auras={auras} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
