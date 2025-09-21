import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppScreen } from "./src/constants/AppScreens";
import LoginScreen from "./src/pages/LoginScreen";
import { HomeScreen } from "./src/pages/HomeScreen";
import { DetailsScreen } from "./src/pages/DetailsScreen";
import { SettingsScreen } from "./src/pages/SettingsScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={AppScreen.LOGINSCREEN}>
        <Stack.Screen name={AppScreen.LOGINSCREEN} component={LoginScreen} />
        <Stack.Screen name={AppScreen.REGISTERSCREEN} component={RegisterScreen} />
        <Stack.Screen name={AppScreen.HOMESCREEN} component={HomeScreen} />
        <Stack.Screen name={AppScreen.DETAILSSCREEN} component={DetailsScreen} />
        <Stack.Screen name={AppScreen.SETTINGSSCREEN} component={SettingsScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
