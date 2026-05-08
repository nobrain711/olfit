import time
import re
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ==========================================
# 🕵️‍♂️ Step 1: 15g 인센스 URL 싹쓸이 (꼬리표 제거!)
# ==========================================
def get_nagchampa_urls():
    list_url = "https://nagchampa.co.kr/category/%EC%A0%84%EC%B2%B4%EC%83%81%ED%92%88/80/#none"
    print(f"🌐 [Step 1] 나그참파 15g URL 수집 시작... ({list_url})")
    
    options = Options()
    options.add_argument('--disable-gpu')
    options.add_argument('window-size=1920x1080')
    driver = webdriver.Chrome(options=options)
    
    product_urls = []
    
    try:
        driver.get(list_url)
        
        print("\n=======================================================")
        print("🛑 로봇 대기 중!")
        print("1. 혹시 팝업창이 뜨면 닫아주세요.")
        print("2. 터미널에서 [Enter] 키를 누르면 크롤링을 시작합니다.")
        print("=======================================================\n")
        
        input("👉 화면이 다 로딩되었나요? [Enter] 키를 누르세요: ")
        print("🤖 '더보기' 버튼을 찾아 무한 클릭을 시작합니다...")
        
        click_count = 0
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight - 1000);")
            time.sleep(1.5)
            try:
                more_btn = driver.find_element(By.CSS_SELECTOR, ".btnMore, a[href*='more']")
                if more_btn.is_displayed():
                    driver.execute_script("arguments[0].click();", more_btn)
                    click_count += 1
                    print(f"   └── 🔄 '더보기' 클릭 {click_count}회 완료! (새 상품 로딩 중...)")
                    time.sleep(2)
                else:
                    break
            except:
                print("   └── 🛑 더 이상 '더보기' 버튼이 없습니다. 탐색 완료!")
                break
                
        # 🎯 '15g' 이미지만 쏙쏙 골라내기
        images = driver.find_elements(By.CSS_SELECTOR, "img[alt*='15g']")
        
        for img in images:
            try:
                parent_a = img.find_element(By.XPATH, "./ancestor::a")
                raw_url = parent_a.get_attribute('href')
                
                # 🚨 유저님 발견 오류 수정: 지저분한 추적 꼬리표(?icid=...) 싹둑 자르기!
                clean_url = raw_url.split('?')[0] 
                
                if clean_url and clean_url not in product_urls:
                    product_urls.append(clean_url)
            except:
                pass
                
        print(f"✅ 총 {len(product_urls)}개의 나그참파 15g 상품 URL 수집 완료!\n")
        
    except Exception as e:
        print(f"❌ URL 수집 중 에러 발생: {e}")
    finally:
        driver.quit()
        
    return product_urls

# ==========================================
# 🕵️‍♂️ Step 2: 상세 페이지 추출 (유저 단서 기반 스나이퍼 모드!)
# ==========================================
def generate_keywords(name):
    """
    상품명을 분석하여 공간의 느낌(우드톤, 따뜻함, 차가움 등)에 따른 키워드를 추출합니다.
    """
    # 브랜드명 제외하고 실제 향 이름 부분만 추출 시도
    clean_name = name.replace("[나그참파코리아]", "").replace("[이달의 향]", "").strip()
    
    keywords = []
    
    # 우드톤 / 묵직함
    if any(word in clean_name for word in ["산달", "샌달", "팔로산토", "트리 오브 라이프", "드래곤", "파출리", "시더우드"]):
        keywords.extend(["우드톤", "묵직함", "차분함"])
    
    # 따뜻함 / 달콤함
    if any(word in clean_name for word in ["바닐라", "시나몬", "로맨스", "머스크", "슈퍼히트", "앰버"]):
        keywords.extend(["따뜻함", "포근함", "달콤함"])
    
    # 차가움 / 청량함 / 싱그러움
    if any(word in clean_name for word in ["레인", "포레스트", "세이지", "레몬그라스", "바이올렛", "로즈마리", "쿨", "민트"]):
        keywords.extend(["차가움", "청량함", "싱그러움"])
        
    # 플로랄 / 화사함
    if any(word in clean_name for word in ["로즈", "자스민", "로맨스", "라벤더"]):
        keywords.extend(["플로랄", "화사함", "우아함"])
        
    # 명상 / 정화 / 차분함 (브랜드명인 '나그참파'는 명시적으로 향 이름에 있을 때만)
    if any(word in clean_name for word in ["요가", "너바나", "리추얼", "차크라", "화이트세이지"]) or ("나그참파" in clean_name and "나그참파코리아" not in clean_name):
        keywords.extend(["명상", "정화", "차분함"])

    # 중복 제거 및 기본값 설정
    keywords = list(dict.fromkeys(keywords)) # 순서 유지하며 중복 제거
    if not keywords:
        keywords = ["차분함", "데일리", "편안함"]
        
    return keywords[:3] # 최대 3개까지만

def crawl_nagchampa_detail(driver, url):
    result = None
    wait = WebDriverWait(driver, 10) 

    try:
        driver.get(url)
        
        # 🚨 상세페이지 뼈대가 아니라 '상품 가격표'가 화면에 렌더링될 때까지 스마트하게 기다림
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#span_product_price_text")))
        except:
            print(f"   └── ⚠️ 로딩 지연 또는 품절 페이지 (URL: {url})")
            return None

        time.sleep(1) 
        driver.execute_script("window.scrollBy(0, 400);")
        time.sleep(0.5)
        
        # 🎯 1. 상품명 & 메인 이미지 (유저님이 찾아준 img alt 치트키 적용!)
        try:
            # 매트 이름을 피하기 위해, alt에 '15g'가 박혀있는 메인 썸네일 이미지를 찾음
            img_element = driver.find_element(By.CSS_SELECTOR, "img[alt*='15g']")
            name = img_element.get_attribute('alt').strip()
            
            # 메인 이미지 주소도 여기서 한방에 해결!
            image_url = img_element.get_attribute('src')
            if not image_url or 'base64' in image_url:
                image_url = img_element.get_attribute('data-src')
        except:
            name = "Unknown"
            image_url = ""
            
        # 🎯 2. 가격 (유저님이 찾아준 id 정확하게 타겟팅)
        try:
            price_element = driver.find_element(By.CSS_SELECTOR, "#span_product_price_text")
            price = int(re.sub(r'[^0-9]', '', price_element.text))
        except:
            price = 0

        # 키워드 생성
        keywords = generate_keywords(name)
            
        result = {
            "brand": "Nag Champa",
            "name": name,
            "category": "인센스 스틱",
            "size": "15g",
            "price": price,
            "keywords": keywords,
            "image_url": image_url,
            "source_url": url,
        }

    except Exception as e:
        print(f"⚠️ [{url}] 에러 발생: {e}")

    return result

# ==========================================
# 🚀 실행 메인 블록
# ==========================================
if __name__ == "__main__":
    print("🤖 4th의 'Olfit' 나그참파 크롤러 가동!\n")
    
    urls = get_nagchampa_urls()
    
    test_urls = urls
    final_data = []
    
    if test_urls:
        print("\n🚀 본격적인 상세 페이지 수집을 시작합니다!")
        
        options = Options()
        options.add_argument('--disable-gpu')
        options.add_argument('window-size=1920x1080')
        detail_driver = webdriver.Chrome(options=options)
        
        try:
            for i, url in enumerate(test_urls, 1):
                # 꼬리표가 잘렸기 때문에 이제 번호가 아주 예쁘게 찍힐 거야!
                item_id = url.split('/')[-2] if url.endswith('/') else url.split('/')[-1]
                print(f"▶️ [{i}/{len(test_urls)}] 상세 수집 중: 상품번호 {item_id}")
                
                data = crawl_nagchampa_detail(detail_driver, url)
                
                if data and data['name'] != "Unknown":
                    final_data.append(data)
                    print(f"   └ 🌿 성공: {data['name']} ({data['price']}원)")
                    
        finally:
            detail_driver.quit()
            
        print("\n=== 📊 결과 데이터 ===")
        print(json.dumps(final_data, indent=4, ensure_ascii=False))
        
        if final_data:
            save_path = 'nagchampa_15g_data.json'
            with open(save_path, 'w', encoding='utf-8') as f:
                json.dump(final_data, f, indent=4, ensure_ascii=False)
            print(f"\n💾 성공! '{save_path}' 파일 저장 완료!")