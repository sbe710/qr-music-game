// useHomeScreenState.ts
import { useState } from "react";
import { Track } from "@/types/Track";
import { useCameraPermissions } from "expo-camera";

export function useHomeScreenState() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Track | null>(null);
  const [webview, setWebview] = useState<{ uri: string } | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setCameraEnabled(false);
    alert(`QR Code scanned! Data: ${data}`);

    try {
      setLoading(true); // переключаем состояние загрузки
      setWebview({ uri: data });
    } catch (error) {
      console.error("Error fetching data from QR code:", error);
      alert("Failed to fetch data from URL.");
    } finally {
      setCameraEnabled(false);
      setLoading(false);
    }
  };

  return {
    cameraEnabled,
    setCameraEnabled,
    loading,
    setLoading,
    data,
    setData,
    webview,
    setWebview,
    permission,
    requestPermission,
    handleBarCodeScanned,
  };
}
