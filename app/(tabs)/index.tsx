import { useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { MusicPlayer } from "@/components/MusicPlayer";
import { QRCamera } from "@/components/QRCamera";
import { Track } from "@/types/Track";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Track | null>();

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setCameraEnabled(false);
    // Показать сообщение о том, что QR-код отсканирован
    alert(`QR Code scanned! Data: ${data}`);

    // Выполнить GET-запрос по ссылке
    try {
      setLoading(true); // Устанавливаем состояние загрузки
      const response = await axios.get(data); // Отправляем запрос по URL, полученному из QR-кода
      console.log("Response:", response.data); // Выводим ответ на консоль

      // Обработка данных
      setData(response.data); // Пример сохранения данных
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data from URL.");
    } finally {
      setCameraEnabled(false);
      setLoading(false); // Снимаем состояние загрузки после запроса
    }
  };

  return (
    <ThemedView style={styles.container}>
      {!cameraEnabled ? (
        <ThemedView>
          {data ? <MusicPlayer track={data} /> : null}

          <ThemedView>
            <TouchableOpacity
              onPress={() => {
                setData(null);
                setCameraEnabled(true);
              }}
              style={styles.scanQRButton}
            >
              <Icon name={"qr-code-sharp"} size={30} color="#7F00FF" />
              <Text style={styles.scanQRButtonText}>Сканировать QR-код</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ) : (
        <QRCamera
          onCameraClose={() => setCameraEnabled(false)}
          onBarcodeScanned={handleBarCodeScanned}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  scanQRButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    borderWidth: 4,
    borderColor: "#7F00FF",
    padding: 10,
    margin: 20,
    borderRadius: 10,
  },
  scanQRButtonText: {
    color: "#7F00FF",
  },
});
