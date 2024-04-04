import React, { useEffect } from "react";
import { StyleSheet, View, Image, Text, StatusBar } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.content}>
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={styles.icon}
        />
        <Text style={styles.appName}>Arihant AI</Text>
        <Text style={styles.subtitle}>Earthworm is not the only friend of farmer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dcf5ef",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
  },
  appName: {
    color: "#333",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#322",
    fontSize: 18,
    fontWeight: "300",
  },
});

export default SplashScreen;
