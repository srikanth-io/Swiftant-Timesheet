import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MENU_TABS } from "../constants/MenuTabs";
import { SettingsScreen } from "../pages/SettingsScreen";
import { AppScreen } from "../constants/AppScreens";
import { HomeScreen } from "../pages/HomeScreen";
import { DetailsScreen } from "../pages/DetailsScreen";
import { AppColors } from "../constants/AppColors";
import { StyleSheet, Platform } from "react-native";
import { AppConstants } from "../constants/AppConstants";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = MENU_TABS.find((t) => t.name === route.name);
        const Icon = tab?.icon;

        return {
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            Icon ? (
              <Icon
                color={focused ? AppColors.darkGreen : AppColors.gray}
                size={size}
              />
            ) : null,
          tabBarActiveTintColor: AppColors.darkGreen,
          tabBarInactiveTintColor: AppColors.gray,
          tabBarStyle: [
            styles.tabBar,
            Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
          ],
        };
      }}
    >
      <Tab.Screen
        name={AppScreen.HOMESCREEN}
        component={HomeScreen}
      />
      <Tab.Screen
        name={AppScreen.DETAILSSCREEN}
        component={DetailsScreen}
      />
      <Tab.Screen
        name={AppScreen.SETTINGSSCREEN}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    marginHorizontal: AppConstants.inputWidth,
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: AppConstants.buttonRadius,
    backgroundColor: AppColors.white,
    paddingTop: 10,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  iosShadow: {
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  androidShadow: {
    elevation: 5,
  },
});
