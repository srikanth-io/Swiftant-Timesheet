import React, { useEffect, useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { AuthController } from "./src/controllers/AuthController";
import { AppErrors } from "./src/constants/AppErrors";
import { TabNavigator } from "./src/shared/TabNavigation.shared";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import LoginScreen from "./src/pages/LoginScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import ForgotPasswordScreen from "./src/pages/ForgotPasswordScreen";
import { AppScreen } from "./src/constants/AppScreens";
import { LayoutScreen } from "./src/pages/LayoutScreen";
import { ProfileScreen } from "./src/pages/ProfileScreen";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = AuthController.observeAuth((currentUser) => {
      setUser(currentUser); 
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Track network status
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected;
      if (!isConnected && !isOffline) {
        ToastAndroid.show(AppErrors.offlineStatus, ToastAndroid.LONG);
      } else if (isConnected && isOffline) {
        ToastAndroid.show(AppErrors.onlineStatus, ToastAndroid.LONG);
      }
      setIsOffline(!isConnected);
    });

    return () => unsubscribeNetInfo();
  }, [isOffline]);

  if (loading) return null;

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {user ? (
          <Stack.Navigator
            screenOptions={{ headerShown: false, gestureEnabled: true }}
          >
            <Stack.Screen
              name={AppScreen.LAYOUTSCREEN}
              component={LayoutScreen}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen
              name={AppScreen.PROFILESCREEN}
              component={ProfileScreen}
              options={{
                gestureEnabled: true,
                gestureDirection: "vertical",
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
            <Stack.Screen
              name={AppScreen.LOGINSCREEN}
              component={LoginScreen}
              options={{
                gestureEnabled: true,
                gestureDirection: "vertical",
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
            <Stack.Screen
              name={AppScreen.REGISTERSCREEN}
              component={RegisterScreen}
              options={{
                gestureEnabled: true,
                gestureDirection: "vertical",
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
            <Stack.Screen
              name={AppScreen.FORGOTPASSWORDSCREEN}
              component={ForgotPasswordScreen}
              options={{
                gestureEnabled: true,
                gestureDirection: "vertical",
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>

      {isOffline && <View style={styles.greyscaleOverlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  greyscaleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1000,
  },
});
