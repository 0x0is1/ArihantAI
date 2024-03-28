import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import ModelDetails from "../Home/components/ModelDetails";
import { encode } from "base-64";
import LoadingContainer from "./components/LoadingContainer";
import PredictionInfo from "./components/PredictionInfo";
import DiseaseDetails from "./components/DiseaseDetails";
import * as FileSystem from "expo-file-system";

const Result = ({ navigation }) => {
  const trid = navigation.getState().routes[1].params.tracking_id;
  const [result, setResult] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [loadingResult, setLoadingResult] = useState(true);
  const [loadingDiseaseDetails, setLoadingDiseaseDetails] = useState(true);
  const [APIurl, setAPIurl] = useState("");

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

        const response = await fetch(`${APIurl}/prediction_status/${trid}`, {
          method: "GET",
          body: null,
        });
        const responseData = await response.json();
        setResult(responseData);
        setLoadingResult(false);

        if (responseData.status === "incomplete") {
          setTimeout(fetchData, 2000);
        } else {
          await fetchCategory(responseData.result[0]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Failed to fetch data.");
      }
    };

    fetchData();
  }, [trid, APIurl]);

  const fetchCategory = async (predictedCategory) => {
    try {
      const response = await fetch(
        `${APIurl}/disease/${encode(predictedCategory)}`,
        {
          method: "GET",
          body: null,
        }
      );
      const responseData = await response.json();
      setDiseaseDetails(responseData);
      setLoadingDiseaseDetails(false);
    } catch (error) {
      console.error("Failed to fetch category:", error);
      Alert.alert("Error", "Failed to fetch category.");
    }
  };

  return (
    result && (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ModelDetails setModelReady={() => {}} />
        {loadingResult || loadingDiseaseDetails ? (
          <LoadingContainer />
        ) : (
          <View style={styles.viewContainer}>
            <PredictionInfo result={result} />
            {diseaseDetails && (
              <DiseaseDetails diseaseDetails={diseaseDetails} />
            )}
          </View>
        )}
      </ScrollView>
    )
  );
};

export default Result;

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: 20,
    backgroundColor: "#dcf5ef",
    alignItems: "center",
    minHeight: "100%",
  },
  viewContainer: {
    alignItems: "center",
  },
});
