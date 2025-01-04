import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

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
        if (status.didJustFinish) {
          console.log("Audio finished");
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio from base64.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {!cameraEnabled ? (
        <View>
          {data ? (
            <ThemedView>
              <ThemedText type="title">Title: {data.title}</ThemedText>
              <ThemedText type="title">Artist: {data.artist}</ThemedText>
              <ThemedText type="title">Year: {data.year}</ThemedText>

              <Button
                title={loading ? "Loading..." : "Play Audio"}
                onPress={() => playAudioFromBase64(data.mp3)}
                disabled={loading}
              />
            </ThemedView>
          ) : null}

          <Button
            title="Сканировать другой QR-код"
            onPress={() => {
              setData(null);
              setCameraEnabled(true);
            }}
          />
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
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
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12'
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           Tap the Explore tab to learn more about what's included in this starter app.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           When you're ready, run{' '}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
