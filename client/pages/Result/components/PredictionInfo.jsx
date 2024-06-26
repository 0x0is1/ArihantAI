import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const PredictionInfo = ({result, preview}) => {
  return (
    <View style={[styles.resultContainer, styles.resultContainerMain]}>
      <Image source={{ uri: preview }} style={styles.capturedImage} />
      <Text style={styles.resultText}>
        <Text style={styles.title}>Crop: </Text>
        {result.result[0].split("__")[0].replace("_", " ")}
      </Text>
      <Text style={styles.resultText}>
        <Text style={styles.title}>Disease: </Text>
        {result.result[0].split("__")[1].replaceAll("_", " ")}
      </Text>
      <Text style={styles.resultText}>
        <Text style={styles.title}>Confidence: </Text>
        {Math.round(result.result[1])}
      </Text>
    </View>
  );
}

export default PredictionInfo

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
  capturedImage: {
    width: 280,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#fff",
  },
});