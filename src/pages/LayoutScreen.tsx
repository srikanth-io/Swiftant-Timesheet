import { StatusBar } from "react-native";
import { TabNavigator } from "../shared/TabNavigation.shared";

export const LayoutScreen = () => {
    return (
        <>
            <TabNavigator />
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </>
    );
}