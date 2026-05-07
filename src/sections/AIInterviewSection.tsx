/**
 * @file AIInterviewSection.tsx
 * @description 사용자의 취향을 분석하기 위한 AI 채팅 인터뷰 섹션입니다.
 */

import { useState, useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Send, Sparkles } from "lucide-react";
import ChatMessage from "@/components/interview/ChatMessage";
import { interviewFlows } from "@/data/interviewData";
import type { AnalysisResults } from "@/types";

type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  options?: string[];
};

export default function AIInterviewSection({ onComplete }: { onComplete?: (results: AnalysisResults) => void }) {
  const { ref, isVisible } = useIntersectionObserver();
  const [activeTrack, setActiveTrack] = useState<null | "personal">(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: interviewFlows.start.ai, options: interviewFlows.start.options },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [freeInput, setFreeInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const totalSteps = activeTrack === "personal" ? interviewFlows.personal.length : 1;
  const progress = activeTrack === "personal" 
    ? Math.min(((currentStep + 1) / totalSteps) * 100, 100)
    : 0;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleOptionSelect = (option: string) => {
    const newUserMsg: Message = { id: crypto.randomUUID(), sender: "user", text: option };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      if (!activeTrack) {
        const track = "personal";
        setActiveTrack(track);
        setCurrentStep(0);
        const nextAi: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: interviewFlows.personal[0].ai,
          options: interviewFlows.personal[0].options,
        };
        setMessages((prev) => [...prev, nextAi]);
      } else {
        const updatedAnswers = [...userAnswers, option];
        setUserAnswers(updatedAnswers);
        const nextStep = currentStep + 1;
        const currentFlow = interviewFlows.personal;

        if (nextStep < currentFlow.length) {
          const nextAi: Message = {
            id: crypto.randomUUID(),
            sender: "ai",
            text: currentFlow[nextStep].ai,
            options: currentFlow[nextStep].options,
          };
          setMessages((prev) => [...prev, nextAi]);
          setCurrentStep(nextStep);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              sender: "ai",
              text: "분석이 완료되었습니다. 당신을 위한 최적의 향기 번역 결과를 확인해 보세요.",
            },
          ]);
          if (onComplete) {
            onComplete({ type: "personal", personalMood: updatedAnswers[0], fashionStyle: updatedAnswers[1] });
          }
          setCurrentStep(nextStep);
        }
      }
      setIsTyping(false);
    }, 1200);
  };

  const handleFreeSubmit = () => {
    if (!freeInput.trim()) return;
    handleOptionSelect(freeInput.trim());
    setFreeInput("");
  };

  const isComplete = activeTrack === "personal" ? currentStep >= interviewFlows.personal.length : false;

  return (
    <section id="interview" className="bg-wood text-cream py-24 md:py-40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <div ref={ref} className={`transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12 md:mb-16">
            <p className="label-upper text-cream/40 mb-4">AI Interview</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight break-keep text-cream">
              {activeTrack === "personal" ? "Personal Scent Style" : "당신의 취향을 들려주세요"}
            </h2>
          </div>

          {activeTrack && (
            <div className="max-w-2xl mx-auto mb-10 md:mb-12">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cream/40 mb-3">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-px bg-cream/10 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-cream transition-all duration-800"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <div className="border-t border-cream/10 pt-8">
              <div 
                ref={scrollContainerRef}
                className="h-[450px] sm:h-[500px] overflow-y-auto pr-4 custom-scrollbar mb-6"
              >
                {messages.map((msg, idx) => (
                  <ChatMessage 
                    key={msg.id} 
                    msg={msg} 
                    index={idx} 
                    onOptionSelect={handleOptionSelect} 
                  />
                ))}

                {isTyping && (
                  <div className="flex gap-3 mb-8">
                    <div className="w-6 h-6 rounded-full bg-cream/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={12} className="text-cream/60" />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-1 h-1 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 bg-cream/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {!isTyping && !isComplete && (
                <div className="flex items-center gap-3 border-b border-cream/20 pb-2 mt-4">
                  <input
                    type="text"
                    value={freeInput}
                    onChange={(e) => setFreeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFreeSubmit()}
                    placeholder="자유롭게 입력하세요"
                    className="flex-1 bg-transparent text-[14px] text-cream placeholder:text-cream/30 outline-none py-2"
                  />
                  <button
                    onClick={handleFreeSubmit}
                    className="p-2 hover:bg-cream/10 transition-colors"
                  >
                    <Send size={16} strokeWidth={1.5} />
                  </button>
                </div>
              )}

              {isComplete && !isTyping && (
                <div className="text-center mt-8 animate-fade-in">
                  <a
                    href="#report"
                    className="inline-flex items-center gap-2 text-[11px] sm:text-[12px] font-medium uppercase tracking-widest border border-cream/30 px-8 py-3.5 hover:bg-cream hover:text-wood transition-all duration-400"
                  >
                    분석 리포트 보기
                    <Sparkles size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
