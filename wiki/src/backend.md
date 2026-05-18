# 🖥️ 백엔드 엔지니어링 가이드 (Backend Wiki)

Olfít 백엔드 시스템의 설계 철학, API 규격, 핵심 알고리즘 및 데이터 파이프라인에 대한 종합 기술 문서입니다.

---

## 🏗️ 1. 시스템 아키텍처 (Architecture)
시스템의 전체적인 구조와 인프라 구성을 설명합니다.

- **[🧭 백엔드 아키텍처 개요](./backend/architecture/overview.md)**: 전체 시스템 컴포넌트 및 기술 스택
- **[🔄 데이터 플로우 (Data Flow)](./backend/architecture/data_flow.md)**: 사용자 요청부터 추천 결과까지의 흐름
- **[☁️ 인프라 및 서비스 구성](./backend/architecture/infra_diagram.md)**: Docker 컨테이너 및 외부 AI API 연동 구조
- **[📨 시퀀스 다이어그램](./backend/architecture/sequence_diagram.md)**: 컴포넌트 간 상호작용 및 API 호출 순서

## 🔌 2. API 명세 (API Specification)
프론트엔드 및 외부 시스템과의 통신 규격을 정의합니다.

- **[📄 API 명세서 (Specification)](./backend/api/api_specification.md)**: 통합 분석 및 추천 엔드포인트 규격
- **[🤝 추천 API 계약 (Contract)](./backend/api/recommendation-api-contract.md)**: 추천 결과 데이터 구조 및 이미지 페이로드 상세

## 🧠 3. 핵심 비즈니스 로직 (Logic & Algorithms)
Olfít의 기술적 정수인 하이브리드 추천 엔진의 원리를 다룹니다.

- **[🎯 추천 로직 마스터 가이드](./backend/logic/recommendation_logic.md)**: 4단계 통합 추천 파이프라인 개요
- **[🌈 시각-향기 매핑 및 아우라 연산](./backend/logic/visual_scent_mapping.md)**: 아우라 벡터 생성의 수학적 모델 및 정규화
- **[⚖️ 하이브리드 재랭킹 알고리즘](./backend/logic/reranking_algorithm.md)**: 최종 추천 순위 결정을 위한 가중치 합산 공식
- **[🧬 시맨틱 검색 인프라 사양](./backend/logic/vector-rag.md)**: Pinecone 및 OpenAI 임베딩 기술 스펙
- **[🧯 에러 핸들링 및 폴백 전략](./backend/logic/error_handling_fallback.md)**: 외부 API 장애 대응 시나리오

## 📊 4. 데이터 설계 및 관리 (Data)
데이터베이스 구조와 지식 베이스 관리 체계를 정의합니다.

- **[🧩 ERD 설계 및 데이터 모델링](./backend/data/erd_design.md)**: MySQL 하이브리드 스키마 상세
- **[🗺️ 지식 베이스 및 매핑 데이터](./backend/data/knowledge_base_mapping.md)**: 향수 도메인 지식 JSON 구조 및 관리
- **[🛢️ MySQL 문서 저장소 로드맵](./backend/data/mysql-document-store-roadmap.md)**: 확장 가능한 데이터 저장 전략

## ⚙️ 5. 처리 파이프라인 (Pipelines)
대규모 데이터 처리 및 AI 추론 자동화 공정을 설명합니다.

- **[📥 데이터 정규화 및 전처리 파이프라인](./backend/pipeline/data_ingestion_pipeline.md)**: 오프라인 데이터 적재 공정
- **[👁️ VLM-추천 통합 파이프라인](./backend/pipeline/vlm_pipeline.md)**: 실시간 이미지 분석 및 프롬프트 엔지니어링

## 🚀 6. 향후 확장 방안 (Expansion)
시스템 고도화를 위한 실험적 결과 및 기술 제안입니다.

- **[💬 LLM 기반 검색 쿼리 최적화](./backend/expansion/llm-query-generation-expansion.md)**: 자연어 생성(NLG)을 통한 RAG 성능 개선안
