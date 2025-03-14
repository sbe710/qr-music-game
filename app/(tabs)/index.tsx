import React from "react";
import { StyleSheet } from "react-native";
import { useHomeScreenState } from "@/hooks/useHomeScreenState";
import { ThemedView } from "@/components/ThemedView";
import { QRCamera } from "@/components/QRCamera";
import CameraPermissions from "@/components/CameraPermissions";
import InvisibleWebView from "@/components/InvisibleWebView";
import QRScanButton from "@/components/QRScanButton";

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
      <InvisibleWebView
        source={webview}
        targetTestId={"album-play"}
        onLoad={() => console.log("WebView loaded")}
        onCloseClick={() => {
          setCameraEnabled(false);
          setData(null);
          setWebview(null);
        }}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      {!cameraEnabled ? (
        <ThemedView>
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
