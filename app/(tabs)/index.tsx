import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHomeScreenState } from "@/hooks/useHomeScreenState";
import { ThemedView } from "@/components/ThemedView";
import { QRCamera } from "@/components/QRCamera";
import { MusicPlayer } from "@/components/MusicPlayer";
import CameraPermissions from "@/components/CameraPermissions";
import InvisibleWebView from "@/components/InvisibleWebView";
import QRScanButton from "@/components/QRScanButton";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen() {
  const {
    cameraEnabled,
    setCameraEnabled,
    permission,
    requestPermission,
    webview,
    setWebview,
    data,
    setData,
    handleBarCodeScanned,
  } = useHomeScreenState();

  if (!permission) return null;

  if (!permission.granted) {
    return <CameraPermissions requestPermission={requestPermission} />;
  }

  if (webview) {
    return (
      <View style={styles.splitContainer}>
        <View style={styles.halfScreen}>
          <InvisibleWebView
            source={webview}
            onLoad={() => console.log("WebView loaded")}
          />
        </View>

        <View style={styles.halfScreen}>
          <TouchableOpacity
            onPress={() => {
              setCameraEnabled(false);
              setData(null);
              setWebview(null);
            }}
          >
            <Icon name={"close"} size={30} color="#fff" />
          </TouchableOpacity>

          <MusicPlayer
            track={{
              artist: "artist",
              title: "title",
              year: "year",
              mp3: "year",
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {!cameraEnabled ? (
        <ThemedView>
          {data && <MusicPlayer track={data} />}

          <QRScanButton
            onPress={() => {
              setData(null);
              setCameraEnabled(true);
            }}
          />
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
  splitContainer: {
    flex: 1,
    flexDirection: "column", // Два компонента сверху и снизу
  },
  halfScreen: {
    flex: 1, // Равное распределение пространства
    borderBottomWidth: 1, // Линия-разделитель между блоками
    borderColor: "#ddd",
  },
});
