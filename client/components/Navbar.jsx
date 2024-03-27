import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const Navbar = () => {
  return (
    <View style={styles.navbarContainer}>
      <Feather
        name="feather"
        size={24}
        color="#ffffff"
        style={styles.menuIcon}
      />
      <Text style={styles.navbarTitle}>Arihant AI</Text>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbarContainer: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#3498db",
    elevation: 4,
  },
  menuIcon: {
    marginRight: 20,
  },
  searchIcon: {
    marginLeft: 20,
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
