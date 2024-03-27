import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ModelDetails from '../Home/components/ModelDetails';
import constants from '../envy';
import { encode } from 'base-64';
import LoadingContainer from "./components/LoadingContainer";
import PredictionInfo from './components/PredictionInfo';
import DiseaseDetails from './components/DiseaseDetails';

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

  return (
    result && (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ModelDetails />
        {loadingResult || loadingDiseaseDetails ? (
          <LoadingContainer />
        ) : (
          <View style={styles.viewContainer}>
            <PredictionInfo result={result}/>
            {diseaseDetails && (
              <DiseaseDetails diseaseDetails={diseaseDetails}/>
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
  viewContainer: {
    alignItems: "center",
  },
});
