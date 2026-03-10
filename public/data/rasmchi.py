import json
import os
import requests
import time

# ---------------- SOZLAMALAR ----------------
LIST_FILE = "images_list.json"  # Manzillar ro'yxati
IMAGES_FOLDER = "rasmlar"       # Rasmlar tushadigan papka
BASE_URL = "https://back.eavtotalim.uz" # Asosiy sayt

# Bot emasligimizni bildirish uchun sarlavha
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}
# --------------------------------------------

def download_images():
    # Rasmlar papkasini ochish
    if not os.path.exists(IMAGES_FOLDER):
        os.makedirs(IMAGES_FOLDER)

    # Ro'yxatni o'qish
    if not os.path.exists(LIST_FILE):
        print(f"❌ '{LIST_FILE}' topilmadi. Avval 1-kodni ishlating!")
        return

    with open(LIST_FILE, 'r', encoding='utf-8') as f:
        image_list = json.load(f)

    print(f"🚀 {len(image_list)} ta rasmni yuklash boshlandi...")
    
    count = 0
    errors = 0

    for item in image_list:
        file_name = item['filename']
        relative_path = item['path']
        
        # Saqlash manzili
        save_path = os.path.join(IMAGES_FOLDER, file_name)

        # 1. Agar rasm allaqachon bor bo'lsa, o'tkazib yuboramiz
        if os.path.exists(save_path):
            print(f"⏩ Bor: {file_name}")
            continue

        # 2. URLni to'g'irlash (boshidagi / belgisini olib tashlaymiz)
        clean_path = relative_path.lstrip("/")
        full_url = f"{BASE_URL}/{clean_path}"

        # 3. Yuklab olish
        try:
            response = requests.get(full_url, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                with open(save_path, 'wb') as img_file:
                    img_file.write(response.content)
                count += 1
                print(f"✅ Yuklandi: {file_name}")
            else:
                print(f"⚠️ Topilmadi ({response.status_code}): {full_url}")
                errors += 1

        except Exception as e:
            print(f"❌ Xatolik: {file_name} -> {e}")
            errors += 1
        
        # Serverni band qilmaslik uchun kichik pauza
        time.sleep(0.05)

    print(f"\n🏁 JARAYON TUGADI!")
    print(f"📥 Yangi yuklandi: {count} ta")
    print(f"🚫 Xatoliklar: {errors} ta")

if __name__ == "__main__":
    download_images()