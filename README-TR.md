# Coolify Dashboard

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)

Coolify uygulamaları, servisleri ve veritabanlarını izlemek için modern, production-ready bir dashboard. Kapsamlı çok dilli destek içerir.

## Hızlı Başlangıç

### Docker ile Dağıtım

```bash
docker pull torukobyte/coolify-dashboard:latest

docker run -d -p 5000:5000 \
  --name coolify-dashboard \
  -e "ADMIN_USERNAME=admin" \
  -e "ADMIN_PASSWORD=guvenli_sifreniz" \
  -e "ADMIN_2FA_SECRET=2fa_secret_anahtariniz" \
  -e "JWT_SECRET=jwt_secret_anahtariniz" \
  -e "ALLOWED_ORIGINS=https://dashboard.kalayciburak.com.tr" \
  -e "COOLIFY_BASE_URL=https://coolify.kalayciburak.com.tr" \
  -e "COOLIFY_TOKEN=coolify_api_token_iniz" \
  -e "DASHBOARD_USER_TYPE=admin" \
  torukobyte/coolify-dashboard:latest
```

Dashboard'a `http://localhost:5000` adresinden erişin.

---

## Coolify Üzerinde Kurulum

### Adım 1: Yeni Uygulama Oluşturun

Coolify instance'ınıza gidin ve yeni bir uygulama oluşturun:

- Coolify dashboard'unda **"Add New"** butonuna tıklayın
- Dağıtım türü olarak **"Docker Image"** seçin
- İmaj adı: `torukobyte/coolify-dashboard:latest`

### Adım 2: Genel Yapılandırma

Temel ayarları yapılandırın:

- **Domain**: `dashboard.kalayciburak.com.tr`
- **Port**: `5000`
- Gerektiğinde network ve storage ayarlarını yapılandırın

### Adım 3: Ortam Değişkenleri

Aşağıdaki zorunlu ortam değişkenlerini ayarlayın:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=guvenli_sifreniz
ADMIN_2FA_SECRET=2fa_secret_anahtariniz
JWT_SECRET=jwt_secret_anahtariniz
ALLOWED_ORIGINS=https://dashboard.kalayciburak.com.tr
COOLIFY_BASE_URL=https://coolify.kalayciburak.com.tr
COOLIFY_TOKEN=coolify_api_token_iniz
DASHBOARD_USER_TYPE=admin
```

### Adım 4: 2FA Secret Oluşturun

Kimlik doğrulama için güvenli bir 2FA secret oluşturun:

```bash
# Yerel olarak çalıştırıyorsanız
cd server
npm run generate-2fa

# Docker kullanıyorsanız, manuel olarak oluşturun:
node -e "console.log(require('speakeasy').generateSecret({length: 32}).base32)"
```

Oluşturulan secret'ı kopyalayıp ortam değişkenlerinde `ADMIN_2FA_SECRET` olarak kullanın.

### Adım 5: Coolify API Token Oluşturun

**Önemli**: Dağıtıma başlamadan önce, kullanıcı tipinize göre uygun izinlere sahip Coolify API token'ı oluşturun:

#### Görüntüleyici Modu (Sadece Okuma Erişimi)
1. Coolify instance ayarlarınıza gidin
2. **API Tokens** bölümüne gidin
3. **"Create New Token"** butonuna tıklayın
4. Aşağıdaki izinleri seçin:
   - **read**: Tüm okuma izinlerini aktifleştirin
   - **read:sensitive**: Hassas veri okuma erişimini aktifleştirin
5. Oluşturulan token'ı kopyalayın ve `COOLIFY_TOKEN` olarak kullanın
6. Ortam değişkenlerinde `DASHBOARD_USER_TYPE=viewer` olarak ayarlayın

**Not**: `read:sensitive` izni, ortam değişkenleri ve hassas yapılandırma verileri dahil olmak üzere detaylı kaynak bilgilerine erişim için gereklidir.

#### Admin Modu (Tam Kontrol)
1. Coolify instance ayarlarınıza gidin
2. **API Tokens** bölümüne gidin
3. **"Create New Token"** butonuna tıklayın
4. Aşağıdaki izinleri seçin:
   - **write**: Tüm yazma izinlerini aktifleştirin (okuma erişimini de içerir)
5. Oluşturulan token'ı kopyalayın ve `COOLIFY_TOKEN` olarak kullanın
6. Ortam değişkenlerinde `DASHBOARD_USER_TYPE=admin` olarak ayarlayın

**Not**: `write` izni admin özellikleri için **zorunludur**. Bu özellikler şunları içerir:
- Servisleri başlatma ve durdurma
- Servisleri silme
- Filtreleme ile canlı servis loglarını görüntüleme
- Görüntüleyici modunda bulunan tüm okuma işlemleri

**Uyarı**: Admin modunu yalnızca güvendiğiniz kullanıcılarla kullanın, çünkü Coolify servisleriniz üzerinde tam kontrol sağlar.

### Adım 6: 2FA Kurulumu (Tek Seferlik)

Dağıtımdan sonra, İki Faktörlü Doğrulamayı kurun. **Bu işlem sadece bir kez yapılabilir!**

1. Kurulum yapılıp yapılmadığını kontrol edin:
   ```bash
   curl https://dashboard.kalayciburak.com.tr/api/auth/2fa/status
   # Yanıt: {"setupCompleted": false, "canSetup": true}
   ```

2. Admin bilgilerinizle `/api/auth/2fa/setup` endpoint'ine POST isteği gönderin:
   ```bash
   curl -X POST https://dashboard.kalayciburak.com.tr/api/auth/2fa/setup \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"sifreniz"}'
   ```

2. Yanıttaki `qrCode` alanında QR kod bulunur. Görüntülemek için:
   - `qrCode` değerinin tamamını kopyalayın (`data:image/png;base64,...` ile başlar)
   - Tarayıcınızın URL çubuğuna yapıştırın
   - Enter'a basarak QR kod görselini görüntüleyin

3. Görüntülenen QR kodu bir kimlik doğrulama uygulamasıyla tarayın:
   - **Google Authenticator** (iOS/Android)
   - **Microsoft Authenticator** (iOS/Android) - Logo gösterir
   - **Authy** (iOS/Android/Desktop) - Logo gösterir
   - **1Password** (Premium özellik)

4. Secret'ı yedek olarak güvenli bir yerde saklayın

### 2FA Sıfırlama/Yenileme

2FA kurulumunuzu sıfırlamanız veya yenilemeniz gerekiyorsa (ör. kimlik doğrulama uygulaması erişimini kaybetme, güvenliği ihlal edilmiş secret, veya farklı bir cihaz kullanmak isteme), aşağıdaki adımları izleyin:

#### Neden Manuel Sıfırlama?

Dashboard, güvenlik nedenleriyle 2FA sıfırlama için bir kullanıcı arayüzü **sağlamaz**. Bu, yetkisiz kullanıcıların dashboard'a erişim sağlasalar bile 2FA kodlarını yeniden oluşturmalarını engeller. Sıfırlama işlemi sunucu düzeyinde erişim gerektirir ve bu maksimum güvenlik sağlar.

#### Sıfırlama Süreci

**1. Uygulamayı Durdurun**

Öncelikle, çalışan uygulamanızı durdurun:

```bash
# Yerel olarak çalıştırıyorsanız
npm stop

# Docker kullanıyorsanız
docker stop coolify-dashboard

# Coolify üzerinde ise
# Uygulamayı durdurmak için Coolify UI'ı kullanın
```

**2. 2FA State Dosyasını Silin**

Bu dosya, 2FA kurulumunun tamamlanıp tamamlanmadığını takip eder:

```bash
# Server dizinine gidin
cd server

# State dosyasını silin
rm .2fa-state.json

# Docker/Coolify kullanıyorsanız, container'a erişin:
docker exec -it coolify-dashboard rm /app/server/.2fa-state.json
```

**3. Yeni Bir 2FA Secret Oluşturun**

Yeni bir secret anahtarı oluşturun:

```bash
# Yerel olarak çalıştırıyorsanız
cd server
npm run generate-2fa

# Docker kullanıyorsanız, manuel olarak oluşturun:
node -e "console.log(require('speakeasy').generateSecret({length: 32}).base32)"
```

Oluşturulan secret'ı kopyalayın (şuna benzer görünür: `JBSWY3DPEHPK3PXP`)

**4. Ortam Değişkenlerini Güncelleyin**

`.env` dosyanızı veya ortam yapılandırmanızı güncelleyin:

```env
ADMIN_2FA_SECRET=YENİ_SECRET_BURAYA
```

**Coolify'da:**
1. Uygulama ayarlarınıza gidin
2. **Environment Variables** (Ortam Değişkenleri) bölümüne tıklayın
3. `ADMIN_2FA_SECRET` değerini yeni değerle güncelleyin
4. Değişiklikleri kaydedin

**5. Uygulamayı Yeniden Başlatın**

```bash
# Yerel olarak çalıştırıyorsanız
npm run dev

# Docker kullanıyorsanız
docker restart coolify-dashboard

# Coolify üzerinde ise
# Uygulamayı yeniden başlatmak/deploy etmek için Coolify UI'ı kullanın
```

**6. 2FA'yı Tekrar Kurun**

Yeniden başlatmadan sonra, yeni 2FA kurulumunu tamamlamak için [Adım 6](#adım-6-2fa-kurulumu-tek-seferlik)'yı takip edin:

```bash
curl -X POST https://dashboard.kalayciburak.com.tr/api/auth/2fa/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"sifreniz"}'
```

Yeni QR kodunu kimlik doğrulama uygulamanızla tarayın.

**7. Eski Girdiyi Kimlik Doğrulama Uygulamasından Kaldırın**

**Önemli**: Kimlik doğrulama uygulamanızdan eski "Coolify Dashboard" girişini silmeyi unutmayın, çünkü yeni secret ile artık çalışmayacaktır.

#### Hızlı Referans

| Adım | İşlem | Komut/Konum |
|------|-------|-------------|
| 1 | Uygulamayı Durdur | `docker stop coolify-dashboard` veya Coolify UI |
| 2 | State Dosyasını Sil | `rm server/.2fa-state.json` |
| 3 | Yeni Secret Oluştur | `npm run generate-2fa` veya `node -e "..."` |
| 4 | Ortam Değişkenini Güncelle | `.env` dosyasını düzenle veya Coolify Ortam Değişkenleri |
| 5 | Uygulamayı Yeniden Başlat | `docker restart` veya Coolify Deploy |
| 6 | 2FA'yı Kur | `/api/auth/2fa/setup` endpoint'ine POST |
| 7 | Kimlik Doğrulama Uygulamasını Güncelle | Eski girdiyi kaldır, yeni QR'ı tara |

### Adım 7: Dağıtım

- Yapılandırmayı kaydedin
- Uygulamayı başlatmak için **"Deploy"** butonuna tıklayın
- Dashboard, yapılandırdığınız domain üzerinden erişilebilir olacaktır

---

## Ekran Görüntüleri

### Giriş Ekranı

![Giriş Ekranı](https://raw.githubusercontent.com/kalayciburak/coolify-dashboard/master/docs/screenshots/tr/1.png)

### Uygulamalar Genel Görünüm

![Uygulamalar Genel Görünüm](https://raw.githubusercontent.com/kalayciburak/coolify-dashboard/master/docs/screenshots/tr/2.png)

### Uygulama Detayları

![Uygulama Detayları](https://raw.githubusercontent.com/kalayciburak/coolify-dashboard/master/docs/screenshots/tr/3.png)

### Servis Detayları

![Servis Detayları](https://raw.githubusercontent.com/kalayciburak/coolify-dashboard/master/docs/screenshots/tr/4.png)

### Veritabanı Yapılandırması

![Veritabanı Detayları](https://raw.githubusercontent.com/kalayciburak/coolify-dashboard/master/docs/screenshots/tr/5.png)

### Çok Dilli Destek

![Çok Dilli Destek](https://raw.githubusercontent.com/kalayciburak/coolify-dashboard/master/docs/screenshots/tr/6.png)

---

## Ortam Değişkenleri

| Değişken              | Açıklama                                                                               | Örnek                                   | Gerekli | Varsayılan   |
| --------------------- | -------------------------------------------------------------------------------------- | --------------------------------------- | ------- | ------------ |
| `ADMIN_USERNAME`      | Dashboard yönetici kullanıcı adı                                                       | `admin`                                 | Evet    | -            |
| `ADMIN_PASSWORD`      | Dashboard yönetici şifresi                                                             | `guvenli_sifre`                         | Evet    | -            |
| `ADMIN_2FA_SECRET`    | İki Faktörlü Doğrulama secret (Base32 encoded)                                         | `npm run generate-2fa` ile oluşturun    | Evet    | -            |
| `JWT_SECRET`          | JWT token üretimi için gizli anahtar                                                   | `rastgele_gizli_anahtar`                | Evet    | -            |
| `ALLOWED_ORIGINS`     | CORS izin verilen kaynaklar (virgülle ayrılmış)                                        | `https://dashboard.kalayciburak.com.tr` | Evet    | -            |
| `COOLIFY_BASE_URL`    | Coolify instance temel URL'i                                                           | `https://coolify.kalayciburak.com.tr`   | Evet    | -            |
| `COOLIFY_TOKEN`       | Coolify API token (viewer için read+read:sensitive, admin için write)                  | `your_api_token`                        | Evet    | -            |
| `DASHBOARD_USER_TYPE` | Kullanıcı erişim seviyesi: `viewer` (sadece okuma) veya `admin` (tam kontrol)          | `admin` veya `viewer`                   | Hayır   | `viewer`     |
| `NODE_ENV`            | Ortam modu: `development` test için 2FA'yı devre dışı bırakır                          | `development` veya `production`         | Hayır   | `production` |

---

## Motivasyon

Coolify kullanırken, her bir uygulama ve servisin URL'lerini ve temel bilgilerini görmek için tek tek içlerine girmem gerekiyordu. Birden fazla kaynak yönetirken bu süreç oldukça yorucu hale geldi. Dedim ki "Neden her şeyi bir bakışta gösteren basit ve şık bir çözüm yapmayayım?" İşte bu dashboard bu ihtiyaçtan doğdu—tüm kaynakları verimli bir şekilde izlemek için merkezi bir görünüm. Başkaları da faydalı bulursa, daha da güzel.

---

## Özellikler

- **İki Faktörlü Doğrulama (2FA)**: TOTP tabanlı güvenli kimlik doğrulama
- **Rol Tabanlı Erişim Kontrolü**: Görüntüleyici modu (salt okunur) ve Admin modu (tam kontrol)
- **Admin Servis Yönetimi**:
  - Tek tıkla servisleri başlatma ve durdurma
  - Servisleri doğrudan dashboard'dan silme
  - Gerçek zamanlı servis loglarını izleme
  - Anahtar kelime ile log filtreleme
  - Otomatik kaydırma özelliği
  - Geçen süre göstergeli gerçek zamanlı işlem yükleme durumları
  - Animasyonlu çerçeveler ve ikonlarla görsel geri bildirim
  - Gerçek zamanlı geçen süre gösterimi ile modern glassmorphism durum banner'ı
  - Yerelleştirilmiş zaman formatı (Türkçe'de "1d 30s", İngilizce'de "1m 30s" görünür)
- **Akıllı State Yönetimi**:
  - **Zustand Store**: Hafif, merkezi state yönetimi
  - **Adaptif Polling**: Kaynak verimliliği için akıllı yoklama aralıkları (5s → 30s)
  - **İyimser Güncellemeler**: API onayından önce anında UI geri bildirimi
  - **Sessiz Arka Plan Senkronizasyonu**: Kullanıcı deneyimini bozmadan veri güncelleme
  - **İşleme Özel Yükleme**: Kaynak başına, işlem başına yükleme durumları
  - **Otomatik Temizleme**: Uygun interval temizliği ile bellek sızıntılarını önler
- **Çok Dilli Destek**: İngilizce ve Türkçe arasında sorunsuz geçiş
- **Responsive Tasarım**: Masaüstü ve mobil cihazlar için optimize edilmiş modern arayüz
- **Gerçek Zamanlı İzleme**: Kaynak durumu ve sağlığını gerçek zamanlı takip
- **Güvenli Kimlik Doğrulama**: JWT tabanlı güvenli token yönetimi
- **Kaynak İzleme**: Uygulamalar, servisler ve veritabanlarını izleme
- **Modern Teknoloji Yığını**: React 19, Zustand, Tailwind CSS 4 ve Express.js ile geliştirilmiştir

---

## Proje Yapısı

```
coolify-dashboard/
├── client/                 # React frontend uygulaması
│   ├── src/
│   │   ├── components/     # Yeniden kullanılabilir UI bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── store/          # Zustand state yönetimi
│   │   ├── api/            # API client servisleri
│   │   ├── services/       # İş mantığı katmanı
│   │   ├── utils/          # Yardımcı fonksiyonlar
│   │   └── i18n/           # Uluslararasılaştırma (EN/TR)
├── server/                 # Express backend uygulaması
│   ├── routes/             # API route tanımları
│   ├── middleware/         # Özel middleware'ler
│   ├── services/           # Backend servisleri
│   └── utils/              # Backend yardımcı araçları
└── Dockerfile              # Docker yapılandırması
```

---

## Geliştirme

### Gereksinimler

- Node.js 20.x veya üzeri
- npm veya yarn
- Git

### Yerel Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/kalayciburak/coolify-dashboard.git

# Proje dizinine gidin
cd coolify-dashboard

# Bağımlılıkları yükleyin
npm install

# server/.env dosyasını oluşturun ve gerekli değişkenleri ayarlayın
# Tüm seçenekler için "Ortam Değişkenleri" bölümüne bakın

# Geliştirme sunucusunu başlatın (2FA devre dışı)
NODE_ENV=development npm run dev
```

### Geliştirme Modu (2FA Bypass)

Yerel geliştirmeyi kolaylaştırmak için, `NODE_ENV=development` ayarlayarak İki Faktörlü Doğrulamayı devre dışı bırakabilirsiniz:

```bash
# Linux/macOS
NODE_ENV=development npm run dev

# Windows (PowerShell)
$env:NODE_ENV="development"; npm run dev

# Windows (CMD)
set NODE_ENV=development && npm run dev
```

**Önemli Notlar:**
- `NODE_ENV=development` ayarlandığında 2FA **otomatik olarak devre dışı** bırakılır
- Production'da, 2FA güvenliğini atladığı için **asla** `NODE_ENV=development` kullanmayın
- `NODE_ENV=development` olmadan, 2FA her zaman gereklidir (varsayılan production davranışı)
- Kalıcı dev modu için `server/.env` dosyanıza `NODE_ENV=development` ekleyebilirsiniz

### Mevcut Script'ler

| Komut            | Açıklama                                       |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Client ve server'ı geliştirme modunda başlatır |
| `npm run build`  | Frontend'i production için derler              |
| `npm run start`  | Production sunucusunu başlatır                 |
| `npm run lint`   | ESLint ile kod kalitesi kontrolü yapar         |
| `npm run format` | Kodu Prettier ile formatlar                    |

---

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen aşağıdaki yönergeleri takip edin:

1. Repository'yi fork edin
2. Feature branch oluşturun: `git checkout -b feature/yeni-ozellik-adi`
3. Değişikliklerinizi commit edin: `git commit -m 'Yeni özellik ekle'`
4. Branch'e push edin: `git push origin feature/yeni-ozellik-adi`
5. Pull Request açın

### Kurallar

- Mevcut kod stilini ve kurallarını takip edin
- Açık ve anlamlı commit mesajları yazın
- Yeni özellikler için test ekleyin
- Gerektiğinde dokümantasyonu güncelleyin
- PR göndermeden önce tüm testlerin geçtiğinden emin olun

---

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## Destek

Hata raporları, özellik istekleri veya sorularınız için lütfen [GitHub](https://github.com/kalayciburak/coolify-dashboard/issues) üzerinden issue açın.
