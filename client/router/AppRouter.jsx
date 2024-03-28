import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar } from "react-native";

import Home from "../pages/Home/Home";
import Result from "../pages/Result/Result";
import Navbar from "../components/Navbar";

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Navbar />
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
