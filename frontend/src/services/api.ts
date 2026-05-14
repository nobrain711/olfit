import axios from 'axios';
import { useOlfitStore } from '@/store/useStore';
import type { AnalysisResults } from '@/types'; // ✅ 타입 import 추가

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response Interceptor: 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { setError } = useOlfitStore.getState();
    
    if (axios.isAxiosError(error)) {
      // ✅ 백엔드가 {"error": "..."} 형태로 내려오므로 둘 다 커버
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        '서버와의 통신 중 오류가 발생했습니다.';
      setError(message);
      console.error('API Error:', message);
    } else {
      setError('알 수 없는 오류가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

// Request Interceptor: 세션 ID 및 공통 헤더 주입
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem("olfit_session_id");
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }
  return config;
});

/**
 * AI 아우라 분석 요청을 백엔드로 전송합니다.
 */
export const requestAuraAnalysis = async (
  base64Image: string,
  selectedNotes: string[]
): Promise<AnalysisResults> => { // ✅ 반환 타입 명시
  const { setLoading, setError } = useOlfitStore.getState();
  
  try {
    setLoading(true);
    setError(null);
    const response = await api.post<AnalysisResults>('/api/analyze/', {
      image: base64Image,
      selectedNotes: selectedNotes,
    });
    return response.data;
  } finally {
    setLoading(false);
  }
};

export default api;