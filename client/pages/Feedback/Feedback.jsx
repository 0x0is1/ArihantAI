import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Dropdown from "./components/DropdownComponent";
import * as FileSystem from "expo-file-system";
import { encode } from "base-64";

const Feedback = ({ navigation }) => {
  const [APIurl, setAPIurl] = useState("");
  const [classDetails_raw, setClassDetails_raw] = useState(null);
  const [crops_, setCrops_] = useState(null);
  const [diseases_, setDiseases_] = useState(null);
  const navParams = navigation.getState().routes[1].params;
  const preview = navParams.preview;
  const [crop_, setCrop_] = useState(null);
  const [disease_, setDisease_] = useState(null);

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      const cdata = {
        crop: crop_,
        disease: disease_,
      }
      const cb64 = encode(JSON.stringify(cdata))
      formData.append("file", {
        uri: preview,
        name: cb64,
        type: "image/jpeg",
      });
      const response = await fetch(`${APIurl}/sendFeedback`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = await response.json();
      alert(responseData.message);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading feedback");
    }
  };

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
          value: cropLabel,
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

  const onSubmitListener = async () => {
    uploadImage();
    navigation.goBack();
  };

  const onCancelListener = () => {
    navigation.goBack();
  };

  const readFromFile = async () => {
    try {
      const filePath = FileSystem.documentDirectory + "envy/envy.js";
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      setAPIurl(fileContent);
    } catch (error) {
      console.error("Failed to read file:", error);
      Alert.alert("Error", "Failed to read file.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await readFromFile();
        if (!APIurl) return;

        const response = await fetch(`${APIurl}/classes`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        }); 

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        setClassDetails_raw(responseData);
        parseClasses(responseData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Failed to fetch data.");
      }
    };
    fetchData();
  }, [APIurl]);

  return (
    classDetails_raw &&
    crops_ &&
    diseases_ && (
      <View style={styles.container}>
        <Text style={styles.title}>Enhancement Feedback</Text>
        <Image source={{ uri: preview }} style={styles.capturedImage} />
        <Dropdown _key="Choose crop ..." data={crops_} value={crop_} setValue={setCrop_} />
        <Dropdown _key="Choose disease ..." data={diseases_} value={disease_} setValue={setDisease_}/>
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
    alignItems: "center",
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
