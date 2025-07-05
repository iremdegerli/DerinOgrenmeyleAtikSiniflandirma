# Yapay Zeka Tabanlı Geri Dönüşüm: Atık Sınıflandırma Modeli
## 🌟 Proje Hakkında
Bu proje, yapay zeka (deep learning) tabanlı bir atık sınıflandırma sistemi geliştirmeyi ve bunu mobil uygulama ve web arayüzü üzerinden kullanıcıya sunmayı amaçlamaktadır. Kullanıcılar kamerayla veya galeriden seçtikleri bir görseli uygulamaya yükleyerek atığın türünü (kağıt, cam veya plastik) anında öğrenebilir.

Geliştirilen yapay zeka modeli (örneğin InceptionV3, MobileNetV2, DenseNet121 vb.) transfer öğrenme yöntemiyle eğitilmiş ve Flask üzerinden RESTful API olarak sunulmuştur. Mobil uygulama ise React Native + Expo kullanılarak geliştirilmiştir.

## 💡 Özellikler
📷 Kamera veya galeri üzerinden fotoğraf yükleme

⚡ Hızlı ve gerçek zamanlı sınıflandırma

🌎 Flask tabanlı RESTful API servisi

🤖 Derin öğrenme tabanlı model (transfer learning)

📱 Kullanıcı dostu mobil arayüz (React Native + Expo)

## 🛠️ Kullanılan Teknolojiler
### Backend (API)
- Python 3.11.x
- Flask
- TensorFlow 2.x
- Pillow
- NumPy
### Mobil Uygulama
- React Native
- Expo
- TypeScript
### Model Eğitimi
- TensorFlow ve Keras
- Transfer öğrenme: InceptionV3, DenseNet121, ResNet50, ResNet101, MobileNetV2, VGG16, EfficientNetB0, ViT.
- Veri artırma ve erken durdurma (EarlyStopping), ReduceLROnPlateau
