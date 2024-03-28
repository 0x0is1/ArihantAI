import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import constants from "../../envy";

const ModelDetails = ({ setModelReady }) => {
  const [details, setDetails] = useState({
    name: "null",
    loss_rate: 0,
    accuracy: 0.0,
    last_modified: 0,
    status: 0,
    message: "Loading..."
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(`${constants.API_URL}/model_detail`, {
        method: "GET",
        body: null,
        headers: {},
      });
      const responseData = await response.json();
      setDetails(responseData);
      if (responseData.status !== 1) {
        setTimeout(fetchDetails, 2000);
      } else {
        setModelReady && setModelReady(true);
      }
    };
    try {
      fetchDetails();
    } catch (error) {
      alert(error)
    }
  }, []);

  const approximateLossRate = (lossRate) => {
    return Math.round(lossRate * 100) / 100;
  };

  const getHourDifference = () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const hourDifference = Math.floor(
      (currentTimestamp - details.last_modified) / 3600
    );
    return hourDifference;
  };

  return details.status === 1 ? (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={{ ...styles.text, backgroundColor: "#3A3042" }}>
          Model: {details.name}
        </Text>
        <Text style={{ ...styles.text, backgroundColor: "#2D3047" }}>
          Loss Rate: {approximateLossRate(details.loss_rate)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={{ ...styles.text, backgroundColor: "#424C55" }}>
          Accuracy: {Math.round(details.accuracy*100)}%
        </Text>
        <Text style={{ ...styles.text, backgroundColor: "#003844" }}>
          Update: {getHourDifference()} hours
        </Text>
      </View>
    </View>
  ) : (
    <View style={styles.resultContainer}>
      <ActivityIndicator
        size="large"
        color="#84B082"
        style={styles.activityIndicator}
      />
      <Text style={styles.resultText}>{details.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  text: {
    minWidth: 150,
    fontSize: 14,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#738290",
    alignItems: "center",
  },
  resultContainer: {
    maxWidth: "90%",
    minWidth: "80%",
    flexDirection: "row",
    marginVertical: 20,
    padding: 30,
    backgroundColor: "#A8DCD9",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#297373",
    color: "#5D4A66",
    alignItems: "left",
  },
  activityIndicator: {
    paddingHorizontal: 10,
  },
  resultText: {
    color: "#5D4A66",
    fontSize: 16,
  },
});

export default ModelDetails;
