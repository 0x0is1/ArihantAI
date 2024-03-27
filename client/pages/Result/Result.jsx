import {
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ModelDetails from "../Home/components/ModelDetails";
import constants from "../env";

const Result = ({ navigation }) => {
  const trid = navigation.getState().routes[1].params.tracking_id;
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const response = await fetch(
        `${constants.API_URL}/prediction_status/${trid}`,
        {
          method: "GET",
          body: null,
        }
      );
      const responseData = await response.json();
      setResult(responseData);

      if (responseData.status === "incomplete") {
        setTimeout(fetchResult, 2000);
      }
    };

    fetchResult();
  }, [trid]);

  return (
    result && (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ModelDetails />
        {result.status === "incomplete" ? (
          <View style={styles.resultContainer}>
            <ActivityIndicator
              size="large"
              color="#84B082"
              style={styles.activityIndicator}
            />
            <Text style={styles.resultText}>{result.message}</Text>
          </View>
        ) : (
          <View style={[styles.resultContainer, { flexDirection: "column" }]}>
            <Text style={styles.resultText}>
              <Text style={styles.title}>Crop: </Text>
              {result.result[0].split("__")[0].replace("_", " ")}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.title}>Disease:</Text> {result.result[0].split("__")[1].replaceAll("_", " ")}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.title}>Confidence:</Text> {Math.round(result.result[1])}%
            </Text>
          </View>
        )}
      </ScrollView>
    )
  );
};

export default Result;

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: 50,
    backgroundColor: "#dcf5ef",
    alignItems: "center",
    height: "120%",
  },
  resultContainer: {
    maxWidth: "80%",
    minWidth: "80%",
    flexDirection: "row",
    marginVertical: 20,
    padding: 30,
    backgroundColor: "rgba(184, 40, 62, 0.21)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(184, 40, 62, 0.93)",
    color: "rgba(255, 97, 121, 1)",
    alignItems: "left",
  },
  activityIndicator: {
    paddingHorizontal: 10,
  },
  resultText: {
    color: "rgba(203, 0, 100, 1)",
    fontSize: 16,
  },
  title: {
    fontWeight: "800",
  },
});
