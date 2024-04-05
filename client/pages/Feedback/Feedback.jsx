import { Button, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Dropdown from "./components/DropdownComponent";

const Feedback = ({navigation}) => {
  const navParams = navigation.getState().routes[1].params;
  const preview = navParams.preview;
  const [classDetails_raw, setClassDetails_raw] = useState({
    class_names: [
      "Apple___Apple_scab",
      "Apple___Black_rot",
      "Apple___Cedar_apple_rust",
      "Apple___healthy",
      "Blueberry___healthy",
      "Cherry_(including_sour)___Powdery_mildew",
      "Cherry_(including_sour)___healthy",
      "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
      "Corn_(maize)___Common_rust_",
      "Corn_(maize)___Northern_Leaf_Blight",
      "Corn_(maize)___healthy",
      "Grape___Black_rot",
      "Grape___Esca_(Black_Measles)",
      "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
      "Grape___healthy",
      "Orange___Haunglongbing_(Citrus_greening)",
      "Peach___Bacterial_spot",
      "Peach___healthy",
      "Pepper,_bell___Bacterial_spot",
      "Pepper,_bell___healthy",
      "Potato___Early_blight",
      "Potato___Late_blight",
      "Potato___healthy",
      "Raspberry___healthy",
      "Soybean___healthy",
      "Squash___Powdery_mildew",
      "Strawberry___Leaf_scorch",
      "Strawberry___healthy",
      "Tomato___Bacterial_spot",
      "Tomato___Early_blight",
      "Tomato___Late_blight",
      "Tomato___Leaf_Mold",
      "Tomato___Septoria_leaf_spot",
      "Tomato___Spider_mites Two-spotted_spider_mite",
      "Tomato___Target_Spot",
      "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
      "Tomato___Tomato_mosaic_virus",
      "Tomato___healthy",
    ],
  });
  const [crops_, setCrops_] = useState(null);
  const [diseases_, setDiseases_] = useState(null);

  const parseClasses = (data) => {
    const uniqueCropsMap = new Map();
    const uniqueDiseasesMap = new Map();

    data.class_names.forEach((item, index) => {
      const details = item.split("___");
      const cropLabel = details[0];
      const diseaseLabel = details[1];

      if (!uniqueCropsMap.has(cropLabel)) {
        uniqueCropsMap.set(cropLabel, {
          label: cropLabel.replaceAll("_", " "),
          value: diseaseLabel,
        });
      }

      if (!uniqueDiseasesMap.has(diseaseLabel)) {
        uniqueDiseasesMap.set(diseaseLabel, {
          label: diseaseLabel.replaceAll("_", " "),
          value: diseaseLabel,
        });
      }
    });

    const uniqueCrops = Array.from(uniqueCropsMap.values());
    const uniqueDiseases = Array.from(uniqueDiseasesMap.values());

    setCrops_(uniqueCrops);
    setDiseases_(uniqueDiseases);
  };

  
  const onSubmitListener = () => {
    alert("Feedback submitted. Thanks for your contribution.");
    navigation.goBack();
  };
  const onCancelListener = () => {
    navigation.goBack();
  };

  useEffect(() => {
    parseClasses(classDetails_raw);
  }, [classDetails_raw]);

  return (
    crops_ &&
    diseases_ && (
      <View style={styles.container}>
        <Text style={styles.title}>Enhancement Feedback</Text>
        <Image source={{ uri: preview }} style={styles.capturedImage} />
        <Dropdown _key="Choose crop ..." data={crops_} />
        <Dropdown _key="Choose disease ..." data={diseases_} />
        <View style={styles.buttonsContainer}>
          <Text style={styles.buttonContainer} onPress={onSubmitListener}>
            Submit
          </Text>
          <Text
            style={[styles.buttonContainer, { backgroundColor: "#f5517a" }]}
            onPress={onCancelListener}
          >
            Cancel
          </Text>
        </View>
      </View>
    )
  );
};

export default Feedback;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  capturedImage: {
    width: 280,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 50,
    paddingVertical: 15,
    backgroundColor: "#3498db",
    borderRadius: 5,
    paddingHorizontal: 50,
    fontSize: 16,
  },
  title: {
    backgroundColor: "#69a3c9",
    marginVertical: 10,
    fontSize: 18,
    paddingHorizontal: 70,
    paddingVertical: 10,
    borderRadius: 5,
    color: "#fff",
    fontWeight: "600",
  },
});
