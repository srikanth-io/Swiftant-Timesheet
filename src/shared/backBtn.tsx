import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AppColors } from "../constants/AppColors";
import { AppIcons } from "../constants/AppIcons";

const BackButton = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.goBack();
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <AppIcons.MoveLeft color={AppColors.white}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        flex: 1,
        zIndex: 1,
        padding: 10,
        borderRadius: 8,
        top: 40,
        left: 20,
        backgroundColor: AppColors.darkGreen,
    },
    text: {
        color: AppColors.darkGreen,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BackButton;