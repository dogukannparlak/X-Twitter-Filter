# Kitleleri Uyutma Aracı Engelleyici

Bu kullanıcı betiği (UserScript), X (Twitter) üzerindeki belirli kelimeleri içeren gönderileri otomatik olarak bulanıklaştırarak gizler. Kullanıcı, belirlenen kelimeleri değiştirebilir veya filtreyi kapatabilir.

## 🚀 Özellikler

✅ **Belirlenen kelimeleri içeren gönderileri bulanıklaştırır.**  
✅ **Kullanıcı yeni kelimeler ekleyebilir veya çıkarabilir.**  
✅ **Sansürlenen içerikler tekrar görünür hale getirilebilir.**  
✅ **Kolay kullanım için ayar butonu eklenmiştir.**  
✅ **Hafif ve hızlı çalışır.**

---

## 📥 Kurulum

### **1️⃣ Tarayıcıya UserScript Yöneticisi Ekle**
Bu betiği çalıştırmak için bir kullanıcı betiği yöneticisine ihtiyacınız var.

🔹 **Tampermonkey (Önerilen)**: [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  
🔹 **Tampermonkey Firefox Add-ons**: [Firefox Eklenti Sayfası](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

Tampermonkey'i yükledikten sonra, tarayıcınızın sağ üst köşesinde bir Tampermonkey simgesi göreceksiniz.

### **2️⃣ Kullanıcı Betiğini (UserScript) Yükleyin**
1. Tarayıcınızda **Tampermonkey simgesine tıklayın** ve "Dashboard" (Kontrol Paneli) seçeneğini seçin.
2. "Create a new script" (Yeni betik oluştur) butonuna tıklayın.
3. Açılan editörde **varsayılan kodları silin** ve bu betiğin kodunu yapıştırın.
4. **Kaydedin (Ctrl + S veya File > Save).**

### **3️⃣ Betiği Etkinleştirin**
- X (Twitter) sitesini açın ve sayfayı yenileyin.
- Eğer çalışmazsa, **Tampermonkey menüsünden betiğin aktif olduğundan emin olun.**

---

## ⚙️ Kullanım

### **Filtre Ayarlarını Değiştirme**
- Sağ alt köşede **"⚙️ Filtre Ayarları"** butonu bulunur.
- Yeni bir kelime eklemek için butona tıklayın ve kelimeyi girin.
- Eğer mevcut bir kelimeyi kaldırmak isterseniz, aynı kelimeyi girerek kaldırabilirsiniz.

### **Sansürü Kaldırma**
- Bulanıklaştırılmış gönderinin ortasındaki kırmızı uyarı metnine tıklayarak sansürü kaldırabilirsiniz.

---

## 🔧 Teknik Detaylar

- Engellenen kelimeler **localStorage**'da saklanır, böylece tarayıcı kapandığında bile korunur.
- İçerikleri izlemek için **MutationObserver yerine setInterval()** kullanılır (daha az CPU tüketir).
- UI tarafında daha iyi bir deneyim için **özel stil ve etkileşimli butonlar** eklenmiştir.

---

## 📜 Lisans
Bu proje açık kaynaklıdır ve MIT Lisansı ile lisanslanmıştır. Kullanım ve geliştirme serbesttir! 🎉

