// InvisibleWebView.tsx
import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/Ionicons";
import { MusicPlayer } from "@/components/MusicPlayer";

interface InvisibleWebViewProps {
  source: { uri: string };
  onLoad: () => void;
  targetTestId?: string; // Атрибут data-testid целевого элемента
  onCloseClick?: () => void; // Колбэк для клика по кнопке
}

export const InvisibleWebView: React.FC<InvisibleWebViewProps> = ({
  source,
  onLoad,
  targetTestId,
  onCloseClick,
}) => {
  const webViewRef = useRef<WebView>(null);

  // Инжектирование JavaScript для вызова нажатия на элемент
  const handleElementClick = () => {
    if (!targetTestId) return;

    const javascriptToInject = `
      // Находим элемент с указанным data-testid
      const targetElement = document.querySelector('[data-testid="${targetTestId}"]');
      if (targetElement) {
        // Эмулируем событие нажатия
        targetElement.click();
      } else {
        console.warn("Элемент с data-testid='${targetTestId}' не найден");
      }
    `;

    // Инжектируем JavaScript в WebView
    webViewRef.current?.injectJavaScript(javascriptToInject);
  };

  return (
    <View style={styles.splitContainer}>
      <View style={styles.halfScreen}>
        <WebView
          ref={webViewRef}
          source={source}
          style={styles.webView}
          onLoad={onLoad}
          javaScriptEnabled
        />
      </View>

      <View style={styles.halfScreen}>
        <TouchableOpacity onPress={onCloseClick}>
          <Icon name={"close"} size={30} color="#fff" />
        </TouchableOpacity>

        <MusicPlayer
          onTogglePlayPause={handleElementClick}
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
};

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
  actionButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
  webView: {
    flex: 1,
  },
});

// Экспортируем компонент
export default InvisibleWebView;
