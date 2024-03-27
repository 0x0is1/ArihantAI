import { StyleSheet, Text, View } from "react-native";
import React from "react";

const DiseaseDetails = ({ diseaseDetails }) => {
  const renderCures = (cures) => {
    return cures.map((cure, index) => (
      <View key={index} style={{ flex: 1, flexDirection: "row", marginLeft: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>{"\u2b57"}</Text>
        <Text style={[styles.cureItem]}>
          {cure}
        </Text>
      </View>
    ));
  };
  return (
    <View
      style={[
        styles.resultContainer,
        styles.resultContainerSeverity[diseaseDetails.severity].container,
      ]}
    >
      <Text
        style={[
          styles.resultText,
          styles.resultContainerSeverity[diseaseDetails.severity].text,
        ]}
      >
        <Text style={styles.title}>Scientific Name: </Text>
        <Text style={{ fontStyle: "italic" }}>
          {diseaseDetails.scientific_name}
        </Text>
      </Text>
      <Text
        style={[
          styles.resultText,
          styles.resultContainerSeverity[diseaseDetails.severity].text,
        ]}
      >
        <Text style={styles.title}>Host's Species: </Text>
        <Text style={{ fontStyle: "italic" }}>
          {diseaseDetails.species_name}
        </Text>
      </Text>
      <Text
        style={[
          styles.resultText,
          styles.resultContainerSeverity[diseaseDetails.severity].text,
        ]}
      >
        <Text style={styles.title}>Severity: </Text>
        <Text>{diseaseDetails.severity}</Text>
      </Text>
      <Text
        style={[
          styles.resultText,
          styles.resultContainerSeverity[diseaseDetails.severity].text,
        ]}
      >
        <Text style={styles.title}>Cures: </Text>
      </Text>
      {renderCures(diseaseDetails.cures)}
    </View>
  );
};

export default DiseaseDetails;

const styles = StyleSheet.create({
  resultContainer: {
    maxWidth: "90%",
    minWidth: "90%",
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  resultContainerMain: {
    backgroundColor: "#b8283e36",
    borderColor: "#b8283eed",
  },
  resultText: {
    marginTop: 1,
    color: "#b8283eed",
    fontSize: 16,
  },
  title: {
    fontWeight: "bold",
  },
  cureItem: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "400",
  },
  resultContainerSeverity: {
    Low: {
      container: {
        borderColor: "#4CAF50",
        backgroundColor: "#C8E6C9",
      },
      text: {
        color: "#4CAF50",
      },
    },
    Moderate: {
      container: {
        borderColor: "#FFC107",
        backgroundColor: "#FFECB3",
      },
      text: {
        color: "#6b4704",
      },
    },
    High: {
      container: {
        borderColor: "#E57373",
        backgroundColor: "#FFEBEE",
      },
      text: {
        color: "#E57373",
      },
    },
  },
});
