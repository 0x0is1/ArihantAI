import { StyleSheet, TouchableHighlight, View } from "react-native";
import React from "react";
import { Icon } from "@rneui/themed";

const FeedbackPage = ({navigation, preview}) => {
  const onLike = () => {
    alert("Thanks for your contribution!")
  };
  const onDislike = () => {
    navigation.navigate("Feedback", preview);
  };
  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlight onPress={onLike} underlayColor="transparent">
        <Icon
          style={[styles.like, { backgroundColor: "#29ADB2" }]}
          name="thumbs-up-sharp"
          type="ionicon"
          color={"#ffff"}
          size={30}
        />
      </TouchableHighlight>
      <TouchableHighlight onPress={onDislike} underlayColor="transparent">
        <Icon
          style={[styles.like, { backgroundColor: "#b8283eed" }]}
          name="thumbs-down-sharp"
          type="ionicon"
          color={"#ffff"}
          size={30}
        />
      </TouchableHighlight>
    </View>
  );
};

export default FeedbackPage;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  like: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 40,
    alignItems: "center",
  },
});
