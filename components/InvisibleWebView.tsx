// InvisibleWebView.tsx
import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

interface InvisibleWebViewProps {
  source: { uri: string };
  onLoad: () => void;
}

export const InvisibleWebView: React.FC<InvisibleWebViewProps> = ({
  source,
  onLoad,
}) => {
  return (
    <View style={styles.container}>
      <WebView
        source={source}
        style={styles.webView}
        onLoad={onLoad}
        javaScriptEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10, // Высокий приоритет отрисовки
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Прозрачный черный фон
  },
  closeButtonText: {
    color: "#FFF", // Белый цвет крестика
    fontSize: 22,
    fontWeight: "bold",
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent", // Убираем фон
  },
});

// Экспортируем компонент
export default InvisibleWebView;
