import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const SERVER_URL = 'http://10.54.0.53:5000/predict'; // Kendi IP adresin

  const pickImage = async (fromCamera) => {
    try {
      let permissionResult = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('İzin reddedildi', 'Uygulamanın çalışması için izin gerekli.');
        return;
      }

      let pickerResult = fromCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.5, base64: false })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: false });

      if (pickerResult.canceled) return;

      const uri = pickerResult.assets[0].uri;

      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(resizedImage.uri);
      uploadImage(resizedImage.uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      setResult('');

      let formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`${data.predicted_class} (%${(data.confidence * 100).toFixed(2)})`);
      } else {
        console.error('API Hatası:', data);
        Alert.alert('Hata', 'Tahmin yapılırken hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Bağlantı hatası', 'Sunucuya ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌱 Atık Sınıflandır</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
          <Text style={styles.buttonText}>Kameradan Çek</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
          <Text style={styles.buttonText}>Galeriden Seç</Text>
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading && <ActivityIndicator size="large" color="#228B22" />}

      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}

      <Text style={styles.footer}>Made in 2025 by Beyza&Irem</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#e7f7ea',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    marginVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 224,
    height: 224,
    marginTop: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#81c784',
  },
  resultCard: {
    backgroundColor: '#dcedc8',
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  resultText: {
    fontSize: 20,
    color: '#33691e',
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    color: '#777',
  },
});
