import random

class VLEngine:
    def __init__(self):
        self.model = "Mock-VLM-Engine-v4"

    def analyze_image(self, image_base64):
        """
        [MOCK] 이미지를 분석하여 가상의 시각적 무드와 키워드를 반환합니다.
        실제 환경에서는 NVIDIA NIM API 등을 호출합니다.
        """
        moods = ["Modern", "Chic", "Romantic", "Vintage", "Natural", "Minimal"]
        selected_mood = random.choice(moods)
        
        return {
            "visual_summary": f"A {selected_mood.lower()} style with clean silhouettes and sophisticated textures.",
            "detected_keywords": [selected_mood, "Sophisticated", "Clean"],
            "colors": ["#FFFFFF", "#000000", "#C0C0C0"],
            "mood": selected_mood
        }
