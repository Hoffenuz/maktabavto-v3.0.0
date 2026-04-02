import json
import os

def fayllarni_birlashtir(papka_yoli=".", chiqish_fayli="1200.json", boshlanish=1, tugash=62):
    jami_data = []

    for i in range(boshlanish, tugash + 1):
        fayl_nomi = f"n{i}.json"
        toliq_yol = os.path.join(papka_yoli, fayl_nomi)

        if not os.path.exists(toliq_yol):
            print(f"{fayl_nomi} topilmadi, o'tkazib yuborildi.")
            continue

        try:
            with open(toliq_yol, "r", encoding="utf-8") as fayl:
                data = json.load(fayl)

                if isinstance(data, list):
                    jami_data.extend(data)
                else:
                    print(f"{fayl_nomi} ichida list yo'q, o'tkazib yuborildi.")
        except Exception as xato:
            print(f"{fayl_nomi} o'qishda xato: {xato}")

    with open(chiqish_fayli, "w", encoding="utf-8") as chiqish:
        json.dump(jami_data, chiqish, ensure_ascii=False, indent=2)

    print(f"Tayyor: {chiqish_fayli}")
    print(f"Jami obyektlar soni: {len(jami_data)}")


fayllarni_birlashtir()