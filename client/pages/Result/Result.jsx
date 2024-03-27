import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import ModelDetails from '../Home/components/ModelDetails';
import constants from '../envy';
import { encode } from 'base-64';

const Result = ({ navigation }) => {
  const trid = navigation.getState().routes[1].params.tracking_id;
  const [result, setResult] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [loadingResult, setLoadingResult] = useState(true);
  const [loadingDiseaseDetails, setLoadingDiseaseDetails] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const response = await fetch(`${constants.API_URL}/prediction_status/${trid}`, {
        method: 'GET',
        body: null,
      });
      const responseData = await response.json();
      setResult(responseData);
      setLoadingResult(false);

      if (responseData.status === 'incomplete') {
        setTimeout(fetchResult, 2000);
      } else {
        await fetchCategory(responseData.result[0]);
      }
    };

    fetchResult();
  }, [trid]);

  const fetchCategory = async (predictedCategory) => {
    const response = await fetch(`${constants.API_URL}/disease/${encode(predictedCategory)}`, {
      method: 'GET',
      body: null,
    });
    const responseData = await response.json();
    setDiseaseDetails(responseData);
    setLoadingDiseaseDetails(false);
  };

const renderCures = (cures) => {
  return cures.map((cure, index) => (
    <View style={{flex: 1, flexDirection: "row", marginLeft: 10}}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        {"\u2b57"}
      </Text>
      <Text
        key={index}
        style={[styles.cureItem]}
        >
        {cure}
    </Text>

    </View>
  ));
};


  return (
    result && (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ModelDetails />
        {loadingResult || loadingDiseaseDetails ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#84B082" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.viewContainer}>
            <View style={[styles.resultContainer, styles.resultContainerMain]}>
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

            {diseaseDetails && (
              <View
                style={[
                  styles.resultContainer,
                  styles.resultContainerSeverity[diseaseDetails.severity]
                    .container,
                ]}
              >
                <Text
                  style={[
                    styles.resultText,
                    styles.resultContainerSeverity[diseaseDetails.severity]
                      .text,
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
                    styles.resultContainerSeverity[diseaseDetails.severity]
                      .text,
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
                    styles.resultContainerSeverity[diseaseDetails.severity]
                      .text,
                  ]}
                >
                  <Text style={styles.title}>Severity: </Text>
                  <Text>{diseaseDetails.severity}</Text>
                </Text>
                <Text
                  style={[
                    styles.resultText,
                    styles.resultContainerSeverity[diseaseDetails.severity]
                      .text,
                  ]}
                >
                  <Text style={styles.title}>Cures: </Text>
                </Text>
                {renderCures(diseaseDetails.cures)}
              </View>
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
    paddingTop: 50,
    backgroundColor: "#dcf5ef",
    alignItems: "center",
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#cb0064",
  },
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
    fontWeight: "400"
  },
  viewContainer: {
    alignItems: "center",
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
