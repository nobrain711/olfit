import time
import re
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

# ==========================================
# 🕵️‍♂️ Step 1: 전체 향수 페이지에서 상품 URL만 싹쓸이!
# ==========================================
def get_byredo_urls():
    list_url = "https://www.byredo.com/ko_kr/c/perfume/personal-fragrances/categories/perfumes"
    print(f"🌐 [Step 1] 바이레도 전체 향수 URL 수집 시작... ({list_url})")
    
    options = Options()
    options.add_argument('--disable-gpu')
    options.add_argument('window-size=1920x1080')
    options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    driver = webdriver.Chrome(options=options)
    product_urls = []
    
    try:
        driver.get(list_url)
        
        print("\n=======================================================")
        print("🛑 로봇 대기 중!")
        print("1. 크롬 창에 봇 차단(Cloudflare)이나 쿠키 동의가 뜨면 직접 풀어주세요.")
        print("2. 향수 리스트가 정상적으로 뜨면 이 터미널에서 [Enter] 키를 누르세요.")
        print("=======================================================\n")
        
        input("👉 화면이 다 로딩되었나요? [Enter] 키를 눌러 크롤링을 시작하세요: ")
        
        print("🤖 스크롤을 내리며 탐색을 시작합니다...")
        for _ in range(75):
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(2)
            
        links = driver.find_elements(By.TAG_NAME, "a")
        
        for link in links:
            url = link.get_attribute('href')
            if url:
                if '/ko_kr/' in url and '/c/' not in url:
                    if '?' not in url and '#' not in url and ('parfum' in url.lower() or 'cologne' in url.lower()):
                        if url not in product_urls:
                            product_urls.append(url)
                
        print(f"✅ 총 {len(product_urls)}개의 바이레도 향수 URL 1차 수집 완료!\n")
        
    except Exception as e:
        print(f"❌ URL 수집 중 에러 발생: {e}")
    finally:
        driver.quit()
        
    return product_urls

# ==========================================
# 🕵️‍♂️ Step 2: 상세 페이지 데이터 추출 (이제 창을 계속 재활용합니다!)
# ==========================================
def crawl_byredo_detail(driver, url):
    result = None

    try:
        driver.get(url)
        time.sleep(2.5) # 속도를 위해 대기 시간을 조금 줄였어!
        
        # 🚨 쿠키가 화면을 가릴 수 있으니 스크롤을 내립니다.
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(1)
        
        # 🎯 1. 50ml 버튼 클릭
        try:
            xpath_50ml = "//*[(local-name()='button' or local-name()='label' or local-name()='div' or local-name()='span') and (contains(text(), '50ml') or contains(text(), '50 ml'))]"
            option_50ml = driver.find_element(By.XPATH, xpath_50ml)
            driver.execute_script("arguments[0].click();", option_50ml)
            time.sleep(1.5) 
        except:
            pass 

        # 2. 상품명
        try:
            name = driver.find_element(By.CSS_SELECTOR, "h1").text.strip()
        except:
            name = "Unknown"
            
        # 🎯 3. 가격 
        try:
            price_element = driver.find_element(By.CSS_SELECTOR, "[data-testid='special-price'], [data-testid='price']")
            price = int(re.sub(r'[^0-9]', '', price_element.text))
        except:
            price = 0

        # 아코디언 메뉴 투시를 위한 추가 스크롤
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(0.5)

        # 🎯 4. 조향 노트 (Top, Middle, Base) 수집
        notes_list = []
        try:
            note_elements = driver.find_elements(By.CSS_SELECTOR, "li.py-1")
            for el in note_elements:
                text = el.get_attribute("textContent").strip()
                if "탑:" in text or "미들:" in text or "베이스:" in text or "Top:" in text:
                    clean_note = re.sub(r'\s+', ' ', text)
                    notes_list.append(clean_note)
        except:
            pass

        # 🎯 5. 전성분 및 설명
        ingredients_list = []
        desc = ""
        try:
            text_boxes = driver.find_elements(By.CSS_SELECTOR, "[data-testid='product-text']")
            for box in text_boxes:
                text = box.get_attribute("textContent").strip()
                
                if "알코올" in text or "성분은 제품개선을 위해" in text:
                    clean_text = text.split('\n')[0].replace('.', '').strip()
                    ingredients_list = [item.strip() for item in clean_text.split(',') if item.strip()]
                elif text and len(text) > 20:
                    desc = text
        except:
            pass

        # 6. 메인 이미지 
        try:
            image_url = driver.find_element(By.CSS_SELECTOR, "picture img, img[class*='object-cover']").get_attribute('src')
        except:
            image_url = ""
            
        # 📦 최종 데이터 조립
        result = {
            "brand": "Byredo",
            "name": name,
            "category": "오 드 퍼퓸",
            "size": "50ml",
            "price": price,
            "description": desc,
            "notes": notes_list,
            "ingredients": ingredients_list,
            "image_url": image_url,
            "source_url": url,
        }

    except Exception as e:
        print(f"⚠️ [{url}] 상세 페이지 에러 발생: {e}")

    return result

# ==========================================
# 🚀 실행 메인 블록
# ==========================================
if __name__ == "__main__":
    print("🤖 4th의 'Olfit' 바이레도 크롤러 최종 가동!\n")
    
    # 1. 주소 싹쓸이
    urls = get_byredo_urls()
    
    # 🔥 일단 상위 5개만 테스트로 돌려보기! (잘 되면 test_urls = urls 로 바꾸기)
    test_urls = urls 
    final_data = []
    
    if test_urls:
        print("\n🚀 본격적인 상세 페이지 수집을 시작합니다!")
        
        # 🚨 여기서 크롬 창을 딱 1번만 엽니다!
        options = Options()
        options.add_argument('--disable-gpu')
        options.add_argument('window-size=1920x1080')
        detail_driver = webdriver.Chrome(options=options)
        
        try:
            for i, url in enumerate(test_urls, 1):
                print(f"▶️ [{i}/{len(test_urls)}] 상세 수집 중: {url.split('/')[-1]}")
                
                # 열어둔 하나의 창(detail_driver)을 계속 재활용해서 함수로 넘김!
                data = crawl_byredo_detail(detail_driver, url)
                
                # 🔥 여기서 꿀팁! 첫 번째 향수 페이지가 열리면 로봇이 5초 멈춥니다.
                # 이때 뜬 쿠키 창을 직접 딱 한 번만 눌러주세요! 
                if i == 1:
                    print("   [안내] 첫 번째 페이지입니다. 혹시 쿠키 동의 창이 떴다면 지금 눌러주세요! (5초 대기)")
                    time.sleep(5)
                
                if data and data['name'] != "Unknown":
                    final_data.append(data)
                    print(f"   └ 🌿 성공: {data['name']} ({data['price']}원)")
                    
        finally:
            # 모든 수집이 끝난 후에야 창을 닫습니다.
            detail_driver.quit()
            
        print("\n=== 📊 결과 데이터 ===")
        print(json.dumps(final_data, indent=4, ensure_ascii=False))
        
        # 💾 수집된 데이터를 로컬 JSON 파일로 자동 저장
        if final_data:
            save_path = 'byredo_50ml_data.json'
            with open(save_path, 'w', encoding='utf-8') as f:
                json.dump(final_data, f, indent=4, ensure_ascii=False)
                
            print(f"\n💾 성공! 로컬 컴퓨터에 '{save_path}' 파일로 완벽하게 저장되었습니다!")