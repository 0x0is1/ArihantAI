import { Button, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "@rneui/themed";
import React from "react";

const ButtonPanel = ({
  cameraRef,
  setCapturedImage,
  capturedImage,
  uploading,
}) => {
  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setCapturedImage(photo);
    }
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 6],
      quality: 1,
    });
    if (!result.canceled) {
      setCapturedImage(result.assets[0]);
    }
  };
  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlight
        style={{ borderRadius: 50 }}
        onPress={takePicture}
        disabled={!!capturedImage || uploading}
      >
        <Icon
          reverse
          name="camera"
          type="ionicon"
          color={!!capturedImage || uploading ? "#808080" : "#17BEBB"}
          size={30}
        />
      </TouchableHighlight>
      <TouchableHighlight
        style={{ borderRadius: 50 }}
        onPress={pickImage}
        disabled={!!capturedImage || uploading}
      >
        <Icon
          reverse
          name="picture"
          type="antdesign"
          color={!!capturedImage || uploading ? "#808080" : "#ff6998"}
          size={30}
        />
      </TouchableHighlight>
    </View>
  );
};

export default ButtonPanel;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    gap: 140,
  },
});
