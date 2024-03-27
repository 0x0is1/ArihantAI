import React from "react";
import { StyleSheet, View } from "react-native";
import { Camera } from "expo-camera";

const RenderCamera = ({ setCameraRef }) => {
  return (
    <View style={styles.cameraContainer}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCameraRef(ref)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  camera: {
    width: "85%",
    aspectRatio: 3 / 4,
  },
});

export default RenderCamera;
