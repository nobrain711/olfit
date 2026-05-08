/**
 * @file recommendationEngine.ts
 * @description 사용자의 AI 인터뷰 분석 결과를 실제 제품 데이터와 매칭하는 로직입니다.
 * 이미지 분석 메타데이터와 사용자가 선택한 향기 노트를 기반으로 유사도를 계산합니다.
 */

import type { AnalysisResults } from "@/types";
import { personalProducts } from "@/data/personalData";
import type { Product } from "@/data/productData";

/**
 * 인터뷰 결과에 따른 추천 제품들을 반환합니다.
 * (이미지 분석 무드 + 선택된 노트를 결합하여 유사도 높은 5개 제품 추출)
 */
export function getRecommendedProducts(results: AnalysisResults | null): (Product & { similarity: number })[] {
  if (!results) return [];

  const selectedNotes = results.analysisMetadata?.selectedNotes || [];
  
  // 제품별 유사도 점수 계산
  const scoredProducts = personalProducts.map((product) => {
    let score = 0;
    
    // 1. 선택된 노트와 제품 노트 간의 매칭 (가중치 2)
    selectedNotes.forEach((userNote) => {
      const targetText = `
        ${product.notes.toLowerCase()} 
        ${product.details.topNotes.toLowerCase()} 
        ${product.details.middleNotes.toLowerCase()} 
        ${product.details.baseNotes.toLowerCase()}
      `;
      if (targetText.includes(userNote.toLowerCase())) {
        score += 2;
      }
    });

    // 2. 패밀리 매칭 (기본 가중치 1.5)
    const mood = results.personalMood || "";
    if (mood.includes("시크") && (product.family === "우디" || product.family === "머스크")) score += 1.5;
    if (mood.includes("로맨틱") && product.family === "플로랄") score += 1.5;
    if (mood.includes("상쾌") && (product.family === "시트러스" || product.family === "프레쉬")) score += 1.5;

    // 점수를 0-100 사이의 유사도 퍼센트로 변환
    // 선택된 노트 개수에 따라 최대 점수(Max Score) 유동적 계산
    const maxPossibleScore = (selectedNotes.length * 2) + 1.5;
    const rawSimilarity = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 70;
    
    // 제품 ID를 기반으로 한 고정된 랜덤값 (결과가 바뀔 때마다 변하지 않게 함)
    const stableRandom = (product.id % 10) / 10; // 0.0 ~ 0.9

    // 65-98% 사이로 정규화 및 변별력 확보
    // rawSimilarity(0~100) -> 0.3 곱해서 범위를 0~30으로 좁힘
    // stableRandom을 더해 제품마다 미세한 차이(0.1~0.9)를 줌
    const similarity = Math.min(Math.round(rawSimilarity * 0.3 + 65 + stableRandom), 98);
    
    return { ...product, similarity };
  });

  // 유사도 순으로 정렬하여 상위 5개 반환
  return scoredProducts
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
}
