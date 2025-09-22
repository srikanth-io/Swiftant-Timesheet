import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import NetInfo from "@react-native-community/netinfo";
import { ToastAndroid, View, StyleSheet } from "react-native";
import { AppScreen } from "./src/constants/AppScreens";
import LoginScreen from "./src/pages/LoginScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import ForgotPasswordScreen from "./src/pages/ForgotPasswordScreen";
import { HomeScreen } from "./src/pages/HomeScreen";
import { DetailsScreen } from "./src/pages/DetailsScreen";
import { SettingsScreen } from "./src/pages/SettingsScreen";
import { AuthController } from "./src/controllers/AuthController";
import { AppErrors } from "./src/constants/AppErrors";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<AppScreen | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Auth state observer
    const unsubscribeAuth = AuthController.observeAuth((user) => {
      if (user) {
        setInitialRoute(AppScreen.HOMESCREEN);
      } else {
        setInitialRoute(AppScreen.LOGINSCREEN);
      }
    });

    // NetInfo listener
    const unsubscribeNetInfo = NetInfo.addEventListener((state: { isConnected: any; }) => {
      const wasOffline = isOffline;
      const isConnected = state.isConnected;

      if (isConnected) {
        if (wasOffline) {
          ToastAndroid.show(AppErrors.onlineStatus, ToastAndroid.LONG);
        }
      } else if (!wasOffline) {
        ToastAndroid.show(AppErrors.offlineStatus, ToastAndroid.LONG);
      }
      setIsOffline(!isConnected);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNetInfo();
    };
  }, [isOffline]);

  if (!initialRoute) {
    return null;
  }

  return (
    <View style={isOffline ? styles.offlineContainer : styles.onlineContainer}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute} 
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          }}>
          <Stack.Screen name={AppScreen.LOGINSCREEN} component={LoginScreen} />
          <Stack.Screen name={AppScreen.REGISTERSCREEN} component={RegisterScreen} />
          <Stack.Screen name={AppScreen.FORGOTPASSWORDSCREEN} component={ForgotPasswordScreen} />
          <Stack.Screen name={AppScreen.HOMESCREEN} component={HomeScreen} />
          <Stack.Screen name={AppScreen.DETAILSSCREEN} component={DetailsScreen} />
          <Stack.Screen name={AppScreen.SETTINGSSCREEN} component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {isOffline && <View style={styles.greyscaleOverlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  onlineContainer: {
    flex: 1,
  },
  offlineContainer: {
    flex: 1,
  },
  greyscaleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
});