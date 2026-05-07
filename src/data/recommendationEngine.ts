/**
 * @file recommendationEngine.ts
 * @description 사용자의 AI 인터뷰 분석 결과를 실제 제품 데이터와 매칭하는 로직입니다.
 */

import type { AnalysisResults } from "@/types";
import { personalProducts } from "../../crawler/personalData";
import { nagChampaProducts } from "./nagChampaData";
import type { Product } from "./productData";

/**
 * 인터뷰 결과에 따른 추천 제품들을 반환합니다.
 */
export function getRecommendedProducts(results: AnalysisResults | null): Product[] {
  if (!results) return [];

  if (results.type === "personal") {
    const mood = results.personalMood || "";
    const fashion = results.fashionStyle || "";

    // 1. 분위기 및 스타일에 따른 타겟 향기 패밀리 결정
    let targetFamilies: string[] = [];
    
    if (mood.includes("로맨틱") || mood.includes("우아한")) {
      targetFamilies = ["플로랄", "머스크"];
    } else if (mood.includes("자유로운") || fashion.includes("고프코어")) {
      targetFamilies = ["프레쉬", "시트러스", "우디"];
    } else if (mood.includes("시그니처") || fashion.includes("아방가르드")) {
      targetFamilies = ["앰버", "우디"];
    } else if (mood.includes("단정한") || fashion.includes("미니멀")) {
      targetFamilies = ["머스크", "우디", "플로랄"];
    } else {
      targetFamilies = ["우디", "머스크"]; // 기본 추천
    }

    // 2. 해당 패밀리에 속하는 제품 필터링
    return personalProducts.filter(p => targetFamilies.includes(p.family));
  } 

  return [];
}

/**
 * 레이어링 추천을 위해 메인 향수와 서브 향수를 결정합니다.
 */
export function getLayeringRecommendation(results: AnalysisResults | null): { main: Product; accent: Product; outcome: string; description: string } | null {
  if (!results || results.type !== "personal") return null;

  const recommended = getRecommendedProducts(results);
  if (recommended.length < 2) {
    // 제품이 부족할 경우 전체 리스트에서 보충
    const main = recommended[0] || personalProducts.find(p => p.name === "SANTAL33") || personalProducts[0];
    const accent = personalProducts.find(p => p.family === "시트러스") || personalProducts[1];
    return {
      main,
      accent,
      outcome: "새벽의 숲과 시트러스",
      description: "우디한 베이스가 중심을 잡아주며 시트러스의 생동감이 더해집니다."
    };
  }

  const main = recommended[0];
  // 메인과 다른 패밀리의 향수를 액센트로 선택
  const accent = personalProducts.find(p => p.family !== main.family) || recommended[1];

  let outcome = "당신만의 시그니처 아우라";
  let description = `${results.fashionStyle} 스타일의 감각을 후각적으로 완성하는 최적의 조합입니다.`;

  if (main.family === "우디") {
    outcome = "깊은 숲의 정적과 빛";
    description = "묵직한 우디 노트 위에 투명한 향기를 덧입혀 지적인 카리스마를 연출합니다.";
  } else if (main.family === "플로랄") {
    outcome = "무채색 도시 속의 꽃";
    description = "우아한 플로럴 향에 중성적인 노트를 더해 현대적이고 세련된 분위기를 자아냅니다.";
  }

  return { main, accent, outcome, description };
}
