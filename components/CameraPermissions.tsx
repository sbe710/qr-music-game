import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface CameraPermissionsProps {
  requestPermission: () => void;
}

export const CameraPermissions: React.FC<CameraPermissionsProps> = ({
  requestPermission,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        We need your permission to show the camera
      </Text>
      <Button onPress={requestPermission} title="grant permission" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default CameraPermissions;
