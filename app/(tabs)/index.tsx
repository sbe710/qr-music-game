import { useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { MusicPlayer } from "@/components/MusicPlayer";
import { QRCamera } from "@/components/QRCamera";
import { Track } from "@/types/Track";

export default function HomeScreen() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [scanned, setScanned] = useState(false);
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
    if (scanned) return; // Если сканирование уже произошло, не выполняем запрос
    setScanned(true); // Блокируем дальнейшие сканирования

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
      setLoading(false); // Снимаем состояние загрузки после запроса
    }
  };

  return (
    <ThemedView style={styles.container}>
      {!cameraEnabled ? (
        <ThemedView>
          {data ? <MusicPlayer track={data} /> : null}

          <ThemedView>
            <Button
              title="Сканировать QR-код"
              onPress={() => {
                setData(null);
                setCameraEnabled(true);
              }}
              color={"#7F00FF"}
            />
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
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
