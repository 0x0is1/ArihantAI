import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Camera } from "expo-camera";
import RenderCamera from "./components/RenderCamera";
import PreviewComponent from "./components/PreviewComponent";
import ButtonPanel from "./components/ButtonPanel";
import ModelDetails from "./components/ModelDetails";

export default function Home({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ModelDetails setModelReady={setModelReady} />
      {capturedImage ? (
        <>
          <PreviewComponent
            uploading={uploading}
            setCapturedImage={setCapturedImage}
            capturedImage={capturedImage}
            setUploading={setUploading}
            navigation={navigation}
          />
        </>
      ) : (
        modelReady && <RenderCamera setCameraRef={setCameraRef} />
      )}
      {modelReady && (
        <ButtonPanel
          cameraRef={cameraRef}
          setCapturedImage={setCapturedImage}
          capturedImage={capturedImage}
          uploading={uploading}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: 50,
    backgroundColor: "#dcf5ef",
    alignItems: "center",
    height: "130%",
  },
});
