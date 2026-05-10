import ScentPyramid from "@/components/common/ScentPyramid";
import type { ScentNote } from "@/data/noteData";

interface ScentBlueprintProps {
  isVisible: boolean;
  slots: {
    Top: ScentNote | null;
    Middle: ScentNote | null;
    Base: ScentNote | null;
  };
  matchPercent: number;
  accentClass: string;
}

export default function ScentBlueprint({ isVisible, slots, matchPercent, accentClass }: ScentBlueprintProps) {
  return (
    <div className={`mb-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wood/30">My Scent Blueprint</span>
        <h3 className={`text-xl font-light tracking-widest uppercase ${accentClass}`}>나의 설계도</h3>
        <div className="h-px bg-wood/10 flex-1" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        <div className="w-64 h-64 md:w-80 md:h-80">
          <ScentPyramid slots={slots} isStatic={true} />
        </div>
        <div className="text-center md:text-left">
          <p className="text-wood/40 uppercase tracking-widest text-[11px] mb-2 font-mono">AI Analysis Result</p>
          <h4 className="text-2xl md:text-3xl font-light text-wood break-keep leading-tight">
            AI가 분석한 당신의 무드와 <br/>
            <span className="font-medium text-gold">{matchPercent}%</span> 일치합니다
          </h4>
          <p className="mt-6 text-[13px] text-wood/60 leading-relaxed max-w-xs break-keep">
            선택하신 {slots.Top?.name}, {slots.Middle?.name}, {slots.Base?.name} 노트를 바탕으로 당신의 시각적 아우라와 가장 조화로운 향기 밸런스를 찾았습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
