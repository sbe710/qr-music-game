import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");
const FRAME_SIZE = 200; // Размер центральной рамки

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
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

  const playAudioFromBase64 = async (base64: string) => {
    setLoading(true);
    try {
      // Создаём временный путь для сохранения аудио файла
      const fileUri = FileSystem.documentDirectory + "audio.mp3";

      // Сохраняем base64 данные в файл
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Загружаем и воспроизводим аудиофайл
      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true },
      );
      setSound(sound);

      // После воспроизведения аудио
      sound.setOnPlaybackStatusUpdate((status) => {
        // @ts-ignore
        if (status.didJustFinish) {
          console.log("Audio finished");
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      alert("Failed to play audio from base64.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ThemedView style={styles.container}>
      {!cameraEnabled ? (
        <ThemedView>
          {data ? (
            <ThemedView>
              <ThemedText type="title">Title: {data.title}</ThemedText>
              <ThemedText type="title">Artist: {data.artist}</ThemedText>
              <ThemedText type="title">Year: {data.year}</ThemedText>

              <ThemedView>
                <Button
                  title={loading ? "Loading..." : "Play Audio"}
                  onPress={() => playAudioFromBase64(data.mp3)}
                  disabled={loading}
                />
              </ThemedView>
            </ThemedView>
          ) : null}

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
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarCodeScanned}
          ratio={"1:1"}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <ThemedView style={styles.innerCamera}>
            <ThemedView style={styles.top}></ThemedView>
            <ThemedView style={styles.center}>
              <ThemedView style={styles.left}></ThemedView>
              <ThemedView style={styles.qrFrame}>
                <ThemedView style={styles.qrCornerTopLeft}></ThemedView>
                <ThemedView style={styles.qrCornerTopRight}></ThemedView>
                <ThemedView style={styles.qrCornerBottomLeft}></ThemedView>
                <ThemedView style={styles.qrCornerBottomRight}></ThemedView>
              </ThemedView>
              <ThemedView style={styles.right}></ThemedView>
            </ThemedView>
            <ThemedView style={styles.bottom}>
              <ThemedView style={styles.buttonContainer}>
                <Button
                  title={"Переключить камеру"}
                  onPress={() => toggleCameraFacing()}
                />

                <Button
                  title={"Закрыть"}
                  onPress={() => setCameraEnabled(false)}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </CameraView>
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
  camera: {
    flex: 1,
  },
  innerCamera: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
  },
  top: {
    flexGrow: 1,
    flexShrink: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  center: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: "transparent",
  },
  left: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 0,
  },
  right: {
    flexGrow: 1,
    flexShrink: 0,
  },
  bottom: {
    flexGrow: 1,
    flexShrink: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  qrFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.6)",
    position: "relative",
  },
  qrCornerTopLeft: {
    position: "absolute",
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
    top: 0,
    left: 0,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  qrCornerTopRight: {
    position: "absolute",
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
    top: 0,
    right: 0,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  qrCornerBottomLeft: {
    position: "absolute",
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
    bottom: 0,
    left: 0,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  qrCornerBottomRight: {
    position: "absolute",
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
    bottom: 0,
    right: 0,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  button: {},
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
