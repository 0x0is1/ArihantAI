import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";

const ExpandableInput = () => {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${inputValue}/model_detail`, {
        method: "GET",
      });
      if (response.ok) {
        const directoryUri = FileSystem.documentDirectory + "envy/";
        const directoryInfo = await FileSystem.getInfoAsync(directoryUri);
        if (!directoryInfo.exists) {
          await FileSystem.makeDirectoryAsync(directoryUri, {
            intermediates: true,
          });
        }

        const filePath = directoryUri + "envy.js";
        await FileSystem.writeAsStringAsync(filePath, inputValue);
        Alert.alert("Success", "API URL saved successfully.");
        readFromFile();
      } else {
        Alert.alert("Error", "Invalid API URL. Please enter a valid API URL.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save API URL: " + error.message);
    }
    setExpanded(!expanded);
  };

  const readFromFile = async () => {
    try {
      const filePath = FileSystem.documentDirectory + "envy/envy.js";
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      setFileContent(fileContent);
      setPlaceholder(fileContent);
    } catch (error) {
      console.error("Failed to read file:", error);
      Alert.alert("Error", "Failed to read file.");
    }
  };

  useEffect(() => {
    readFromFile();
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const expandedWidth = screenWidth * 0.8;

  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
      <View style={[styles.container, expanded && { width: expandedWidth }]}>
        {!expanded ? (
          <Text style={[styles.placeholderText, styles.input]}>
            Click to enter API URL
          </Text>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              onChangeText={handleInputChange}
              value={inputValue}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!inputValue}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 60,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40,
    minWidth: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ExpandableInput;
