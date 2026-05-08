import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ==========================================
# 🕵️‍♂️ Step 1: 리스트 페이지에서 100ml 기본 정보 '싹쓸이'
# ==========================================
def get_perfume_base_data():
    list_url = "https://www.lelabofragrances.co.kr/eau-de-parfum.html"
    print(f"🌐 [Step 1] 전체 리스트 데이터 수집 시작... ({list_url})")
    
    options = Options()
    # options.add_argument('--headless') 
    options.add_argument('--disable-gpu')
    options.add_argument('window-size=1920x1080')
    driver = webdriver.Chrome(options=options)
    
    perfumes_base_info = []
    
    try:
        driver.get(list_url)
        time.sleep(3)
        
        # 🚨 스크롤을 살짝 내려서 모든 향수 이미지가 로딩되게 강제
        driver.execute_script("window.scrollBy(0, 1500);")
        time.sleep(2)
        
        # 유저님이 찾아낸 바로 그 마법의 클래스!
        items = driver.find_elements(By.CSS_SELECTOR, "a.product-item-head-link")
        
        for item in items:
            variant = item.get_attribute("data-variant")
            
            # 100ml 데이터만 쏙쏙 골라내기!
            if variant and "100" in variant:
                url = item.get_attribute("href")
                
                # 중복 수집 방지
                if any(p['source_url'] == url for p in perfumes_base_info):
                    continue
                    
                raw_name = item.get_attribute("data-name") # ex: "비올렛30|VIOLETTE30"
                name = raw_name.replace("|", "\n") if raw_name else "Unknown"
                
                price = int(item.get_attribute("data-price") or 0)
                
                try:
                    img_tag = item.find_element(By.CSS_SELECTOR, "img")
                    image_url = img_tag.get_attribute("src")
                except:
                    image_url = ""
                
                perfumes_base_info.append({
                    "brand": "Le Labo",
                    "name": name,
                    "size": "100ml",
                    "price": price,
                    "image_url": image_url,
                    "source_url": url,
                    # 아래 두 개는 Step 2에서 채워 넣을 빈 공간!
                    "description": "",
                    "ingredients": []
                })
                
        print(f"✅ 총 {len(perfumes_base_info)}개의 100ml 기본 데이터 수집 완료!\n")
        
    except Exception as e:
        print(f"❌ Step 1 에러 발생: {e}")
    finally:
        driver.quit()
        
    return perfumes_base_info

# ==========================================
# 🕵️‍♂️ Step 2: 상세 페이지에서 '설명'과 '전성분'만 추가 추출
# ==========================================
def fill_detail_info(perfume_data):
    options = Options()
    options.add_argument('--headless') # 상세 정보는 백그라운드에서 조용히 수집!
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)
    
    url = perfume_data["source_url"]
    
    try:
        driver.get(url)
        time.sleep(2)
        driver.execute_script("window.scrollBy(0, 600);")
        time.sleep(1)
            
        # 1. 향 설명 추출
        try:
            desc = driver.find_element(By.CSS_SELECTOR, ".product-description, .description, #collapse-description, .product-details-main-text").text.strip()
            perfume_data["description"] = desc
        except:
            perfume_data["description"] = ""

        # 2. 전성분(Ingredients) 추출 및 전처리
        try:
            raw_ingredients = driver.find_element(By.CSS_SELECTOR, "div.product-details-extra-main-text, .ingredients").text
            clean_text = raw_ingredients.split('[')[0].replace('\n', '').strip()
            perfume_data["ingredients"] = [item.strip() for item in clean_text.split(',') if item.strip()]
        except:
            perfume_data["ingredients"] = []

    except Exception as e:
        print(f"⚠️ [{perfume_data['name']}] 상세 수집 중 에러: {e}")
    finally:
        driver.quit()

    return perfume_data

# ==========================================
# 🚀 실행 메인 블록
# ==========================================
if __name__ == "__main__":
    print("🤖 4th의 'Olfit' 초고속 크롤러 가동을 시작합니다!\n")
    
    # 1. 리스트 페이지에서 100ml 데이터 일괄 수집
    base_data_list = get_perfume_base_data()
    
    # 🔥 테스트용 제한을 풀고 전체 데이터를 다 가져오고 싶다면 아래 줄을 수정!
    # test_list = base_data_list[:3]  <-- 3개만 테스트하던 것
    test_list = base_data_list        # <-- 전체 데이터 수집으로 변경!
    
    final_db_data = []
    
    for i, data in enumerate(test_list, 1):
        print(f"▶️ [{i}/{len(test_list)}] 상세 정보 수집 중: {data['name'].split()[0]}")
        filled_data = fill_detail_info(data)
        final_db_data.append(filled_data)
            
    print("\n🎉 모든 수집이 완료되었습니다!")
    
    # 터미널에 예쁘게 출력
    # print("\n=== 📊 최종 저장할 완벽한 JSON 데이터 ===")
    # print(json.dumps(final_db_data, indent=4, ensure_ascii=False))

    # ⬇️ ================= 여기서부터 새로 추가 & 수정된 부분 ================= ⬇️
    
    # 💾 3. 수집된 데이터를 로컬 JSON 파일로 저장하기
    save_path = 'lelabo_100ml_data.json'
    with open(save_path, 'w', encoding='utf-8') as f:
        json.dump(final_db_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n💾 성공! 로컬 컴퓨터에 '{save_path}' 파일로 완벽하게 다운로드 및 저장되었습니다!")