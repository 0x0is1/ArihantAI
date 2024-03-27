import React from "react";
import { StyleSheet, View, Text, Button, Image, TouchableHighlight } from "react-native";
import { Icon } from "@rneui/themed";
import constants from "../../envy";

const PreviewComponent = ({
  capturedImage,
  uploading,
  setCapturedImage,
  setUploading,
  navigation
}) => {
  const retakePicture = () => {
    setCapturedImage(null);
  };

  const uploadImage = async () => {
    if (!capturedImage) {
      alert("No image captured");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", {
        uri: capturedImage.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      const response = await fetch(`${constants.API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = await response.json();
      navigation.navigate("Result", responseData)
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {capturedImage && (
        <Image
          source={{ uri: capturedImage.uri }}
          style={styles.capturedImage}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={{ borderRadius: 50 }}
          onPress={retakePicture}
          disabled={uploading}
        >
          <Icon
            reverse
            name="return-up-back"
            type="ionicon"
            color="#C14953"
            size={30}
          />
        </TouchableHighlight>
        <TouchableHighlight
          style={{ borderRadius: 50 }}
          onPress={uploadImage}
          disabled={uploading || !capturedImage}
        >
          <Icon reverse name="scan" type="ionicon" color="#7D2E68" size={30} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    gap: 140
  },
  capturedImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default PreviewComponent;
