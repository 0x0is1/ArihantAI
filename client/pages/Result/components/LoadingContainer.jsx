import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoadingContainer = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#84B082" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

export default LoadingContainer

const styles = StyleSheet.create({
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
});