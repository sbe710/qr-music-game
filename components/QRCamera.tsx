import React, { useState } from "react";
import { CameraType, CameraView } from "expo-camera";
import { ThemedView } from "@/components/ThemedView";
import { Button, StyleSheet } from "react-native";
import throttle from "lodash/throttle";

type QRCameraProps = {
  onBarcodeScanned: any;
  onCameraClose: () => void;
};

export const QRCamera: React.FC<QRCameraProps> = ({
  onBarcodeScanned,
  onCameraClose,
}) => {
  const [facing, setFacing] = useState<CameraType>("back");

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const onBarcodeScannedProxy = throttle((barcode) => {
    onBarcodeScanned(barcode);
    // Здесь можно обработать результат сканирования
  }, 2000);
  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      onBarcodeScanned={onBarcodeScannedProxy}
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

            <Button title={"Закрыть"} onPress={onCameraClose} />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </CameraView>
  );
};

const FRAME_SIZE = 200; // Размер центральной рамки

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
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
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
