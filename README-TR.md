# Coolify Dashboard

Coolify uygulamaları, servisleri ve veritabanlarını izlemek için modern, production-ready bir dashboard. Kapsamlı çok dilli destek içerir.

## Hızlı Başlangıç

### Docker ile Dağıtım

```bash
docker pull torukobyte/coolify-dashboard:latest

docker run -d -p 5000:5000 \
  --name coolify-dashboard \
  -e "ADMIN_USERNAME=admin" \
  -e "ADMIN_PASSWORD=guvenli_sifreniz" \
  -e "JWT_SECRET=jwt_secret_anahtariniz" \
  -e "ALLOWED_ORIGINS=https://dashboard.kalayciburak.com.tr" \
  -e "COOLIFY_BASE_URL=https://coolify.kalayciburak.com.tr" \
  -e "COOLIFY_TOKEN=coolify_api_token_iniz" \
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
JWT_SECRET=jwt_secret_anahtariniz
ALLOWED_ORIGINS=https://dashboard.kalayciburak.com.tr
COOLIFY_BASE_URL=https://coolify.kalayciburak.com.tr
COOLIFY_TOKEN=coolify_api_token_iniz
```

### Adım 4: Coolify API Token Oluşturun

**Önemli**: Dağıtıma başlamadan önce, uygun izinlere sahip Coolify API token'ı oluşturun:

1. Coolify instance ayarlarınıza gidin
2. **API Tokens** bölümüne tıklayın
3. **"Create New Token"** butonuna tıklayın
4. Aşağıdaki izinleri seçin:
   - **read**: Tüm okuma izinlerini aktifleştirin
   - **read:sensitive**: Hassas veri okuma erişimini aktifleştirin
5. Oluşturulan token'ı kopyalayın ve `COOLIFY_TOKEN` olarak kullanın

**Not**: `read:sensitive` izni, ortam değişkenleri ve hassas yapılandırma verileri dahil olmak üzere detaylı kaynak bilgilerine erişim için gereklidir.

### Adım 5: Dağıtım

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

| Değişken           | Açıklama                                                  | Örnek                                   | Gerekli |
| ------------------ | --------------------------------------------------------- | --------------------------------------- | ------- |
| `ADMIN_USERNAME`   | Dashboard yönetici kullanıcı adı                          | `admin`                                 | Evet    |
| `ADMIN_PASSWORD`   | Dashboard yönetici şifresi                                | `guvenli_sifre`                         | Evet    |
| `JWT_SECRET`       | JWT token üretimi için gizli anahtar                      | `rastgele_gizli_anahtar`                | Evet    |
| `ALLOWED_ORIGINS`  | CORS izin verilen kaynaklar (virgülle ayrılmış)           | `https://dashboard.kalayciburak.com.tr` | Evet    |
| `COOLIFY_BASE_URL` | Coolify instance temel URL'i                              | `https://coolify.kalayciburak.com.tr`   | Evet    |
| `COOLIFY_TOKEN`    | read + read:sensitive yetkisine sahip Coolify API token'ı | `api_token_iniz`                        | Evet    |

---

## Motivasyon

Coolify kullanırken, her bir uygulama ve servisin URL'lerini ve temel bilgilerini görmek için tek tek içlerine girmem gerekiyordu. Birden fazla kaynak yönetirken bu süreç oldukça yorucu hale geldi. Dedim ki "Neden her şeyi bir bakışta gösteren basit ve şık bir çözüm yapmayayım?" İşte bu dashboard bu ihtiyaçtan doğdu—tüm kaynakları verimli bir şekilde izlemek için merkezi bir görünüm. Başkaları da faydalı bulursa, daha da güzel.

---

## Özellikler

- **Çok Dilli Destek**: İngilizce ve Türkçe arasında sorunsuz geçiş
- **Responsive Tasarım**: Masaüstü ve mobil cihazlar için optimize edilmiş modern arayüz
- **Gerçek Zamanlı İzleme**: Kaynak durumu ve sağlığını gerçek zamanlı takip
- **Güvenli Kimlik Doğrulama**: JWT tabanlı güvenli token yönetimi
- **Kaynak İzleme**: Uygulamalar, servisler ve veritabanlarını izleme
- **Modern Teknoloji Yığını**: React, Tailwind CSS ve Express.js ile geliştirilmiştir

---

## Proje Yapısı

```
coolify-dashboard/
├── client/                 # React frontend uygulaması
│   ├── src/
│   │   ├── components/     # Yeniden kullanılabilir UI bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
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

# Geliştirme sunucusunu başlatın
npm run dev
```

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
