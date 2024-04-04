import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar } from "react-native";
import SplashScreen from "../components/SplashScreen";
import Home from "../pages/Home/Home";
import Result from "../pages/Result/Result";
import Navbar from "../components/Navbar";
import Feedback from "../pages/Feedback/Feedback";

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Navbar />
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="Feedback" component={Feedback} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
