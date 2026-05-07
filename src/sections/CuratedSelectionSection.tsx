/**
 * @file CuratedSelectionSection.tsx
 * @description 사용자 맞춤형 추천 제품 리스트를 보여주는 섹션입니다.
 * 필터링 기능(전체, 맞춤, 비건, 에코)과 제품 호버 효과를 포함합니다.
 */

import { useState, useMemo } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import ProductCard from "@/components/curated/ProductCard";
import ProductModal from "@/components/curated/ProductModal";
import { products } from "@/data/productData";
import { getRecommendedProducts } from "@/data/recommendationEngine";
import type { Product } from "@/data/productData";
import type { AnalysisResults } from "@/types";

const filters = ["All", "For You", "Vegan", "Eco"] as const;
type Filter = (typeof filters)[number];

export default function CuratedSelectionSection({ results }: { results: AnalysisResults | null }) {
  const { ref, isVisible } = useIntersectionObserver();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [activeBrand, setActiveBrand] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 분석 결과에 따른 추천 상품 목록 (ID 리스트 추출)
  const recommendedIds = useMemo(() => 
    getRecommendedProducts(results).map(p => p.id), 
    [results]
  );

  // Deriving state from props during render phase
  const [prevResults, setPrevResults] = useState<AnalysisResults | null>(results);
  if (results !== prevResults) {
    setPrevResults(results);
    if (results?.type === "personal") {
      setActiveFilter("For You");
    }
  }

  // 현재 카테고리(Personal)에 존재하는 브랜드 목록 추출
  const availableBrands = ["All", ...new Set(products.filter(p => p.category === "Personal").map(p => p.brand))];

  const categoryFiltered = products.filter((p) => p.category === "Personal");
  
  const filtered = categoryFiltered.filter((p) => {
    // 'For You' 필터일 경우 분석 엔진에서 계산된 ID 목록에 포함되는지 확인
    const matchFilter = activeFilter === "For You" 
      ? recommendedIds.includes(p.id)
      : (activeFilter === "All" || p.tags.includes(activeFilter));
      
    const matchBrand = activeBrand === "All" || p.brand === activeBrand;
    return matchFilter && matchBrand;
  });

  return (
    <section id="curated" className="bg-[#F7F7F7] py-24 md:py-40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <div ref={ref} className={`mb-12 md:mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="label-upper text-wood/40 mb-4">Curated Selection</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-10 md:mb-12 text-wood">
            당신을 위한 향기 큐레이션
          </h2>

          <div className="flex flex-col gap-6">
            {/* 태그 필터 */}
            <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2">
              <span className="text-[10px] uppercase tracking-widest text-wood/30 mr-2 shrink-0">Mood</span>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`relative text-[10px] md:text-[11px] font-medium uppercase tracking-widest transition-colors duration-300 pb-2 whitespace-nowrap ${
                    activeFilter === f ? "text-wood" : "text-wood/40 hover:text-wood/70"
                  }`}
                >
                  {f === "All" ? "전체" : f === "For You" ? "맞춤" : f === "Vegan" ? "비건" : "에코"}
                  {activeFilter === f && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-wood rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* 브랜드 필터 */}
            <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-2">
              <span className="text-[10px] uppercase tracking-widest text-wood/30 mr-2 shrink-0">Brand</span>
              {availableBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => setActiveBrand(b)}
                  className={`relative text-[10px] md:text-[11px] font-medium uppercase tracking-widest transition-colors duration-300 pb-2 whitespace-nowrap ${
                    activeBrand === b ? "text-wood" : "text-wood/40 hover:text-wood/70"
                  }`}
                >
                  {b === "All" ? "전체" : b}
                  {activeBrand === b && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-wood rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isVisible={isVisible} 
              index={i} 
              onClick={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </div>

      {/* 제품 상세 모달 */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </section>
  );
}
