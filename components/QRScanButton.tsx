// QRScanButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface QRScanButtonProps {
  onPress: () => void;
}

export const QRScanButton: React.FC<QRScanButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.scanQRButton}>
      <Icon name={"qr-code-sharp"} size={30} style={styles.icon} />
      <Text style={styles.scanQRButtonText}>Сканировать QR-код</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scanQRButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#7F00FF",
    padding: 10,
    margin: 20,
    borderRadius: 10,
  },
  scanQRButtonText: {
    color: "#EEEEEE",
    marginLeft: 5,
  },
  icon: {
    color: "#EEEEEE",
  },
});

// Экспорт компонента
export default QRScanButton;
