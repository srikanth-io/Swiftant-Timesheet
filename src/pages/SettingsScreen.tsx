import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import { AppIcons } from "../constants/AppIcons";
import { AppColors } from "../constants/AppColors";
import { AppConstants } from "../constants/AppConstants";
import { useNavigation } from "@react-navigation/native";
import { AppScreen } from "../constants/AppScreens";
import { AuthController } from "../controllers/AuthController";
import { settingsController } from "../controllers/SettingsController";

export const SettingsScreen = () => {
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [registeredDate, setRegisteredDate] = useState<Date | null>(null);

    const navigation = useNavigation();

    useEffect(() => {
        const user = AuthController.getCurrentUser();
        if (user) {
            setProfileUrl(user.photoURL || null);
            setEmail(user.email || "No Email");
            setRegisteredDate(user.metadata.creationTime ? new Date(user.metadata.creationTime) : null);
        }
        settingsController.getAccountDetails().then((data) => {
            if (data) {
                setUsername(data.username);
            }
        });
    }, []);

    const calculateDaysSince = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const handleLogout = async () => {
        try {
            await AuthController.logout();
            navigation.reset({
                index: 0,
                routes: [{ name: AppScreen.LOGINSCREEN as never }],
            });
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    const renderOptionButton = (text: string, icon: any, onPress: () => void) => (
        <TouchableOpacity style={styles.optionButton} onPress={onPress}>
            <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                    {React.createElement(icon, { color: AppColors.white, size: 18 })}
                </View>
                <Text style={styles.optionText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileSection}>
                <View style={styles.profileTop}>
                    <Image
                        source={{ uri: profileUrl || "https://placehold.co/500x500/14532D/FFFFFF?text=JP" }}
                        style={styles.profileImage}
                    />
                    <View style={styles.userStats}>
                        {registeredDate && (
                            <>
                                <Text style={styles.registeredText}>
                                    Registered: {registeredDate.toDateString()}
                                </Text>
                                <Text style={styles.registeredText}>
                                    {calculateDaysSince(registeredDate)} days ago
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                <Text style={styles.usernameText}>{username}</Text>
                <Text style={styles.emailText}>{email}</Text>
            </View>

            {/* Options Section */}
            <View style={styles.optionsSection}>
                <Text style={styles.optionsHeader}>Preferences</Text>
                {renderOptionButton(
                    "Profile Settings",
                    AppIcons.Settings,
                    () => navigation.navigate(AppScreen.PROFILESCREEN as never)
                )}
                {renderOptionButton(
                    "Support",
                    AppIcons.Book,
                    () => console.log("Support clicked")
                )}
                {renderOptionButton(
                    "Contact Us",
                    AppIcons.Mail,
                    () => console.log("Contact clicked")
                )}
                {renderOptionButton(
                    "Export Settings",
                    AppIcons.Download,
                    () => console.log("Export clicked")
                )}
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <AppIcons.LogOut color={AppColors.white} size={18} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: AppColors.white,
        padding: 20,
        alignItems: "center",
    },
    profileSection: {
        width: "100%",
        marginTop: 50,
        alignItems: "flex-start",
        marginBottom: 50,
    },
    profileTop: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: AppColors.green900,
    },
    userStats: {
        alignItems: "flex-start",
    },
    registeredText: {
        fontSize: 14,
        color: AppColors.darkGray,
        marginBottom: 4,
    },
    usernameText: {
        fontSize: 24,
        fontWeight: "bold",
        color: AppColors.black,
        marginTop: 12,
        textAlign: "center",
    },
    emailText: {
        fontSize: 16,
        color: AppColors.gray,
        marginTop: 4,
        textAlign: "center",
    },
    optionsSection: {
        width: "100%",
        marginBottom: 30,
    },
    optionsHeader: {
        fontSize: 20,
        fontWeight: "bold",
        color: AppColors.black,
        marginBottom: 10,
    },
    optionButton: {
        backgroundColor: AppColors.grayWhite,
        borderRadius: AppConstants.buttonRadius,
        padding: 15,
        marginBottom: 10,
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionIconContainer: {
        backgroundColor: AppColors.darkGreen,
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
    },
    optionText: {
        color: AppColors.black,
        fontSize: 16,
        fontWeight: "500",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: AppColors.googleRed,
        borderRadius: AppConstants.buttonRadius,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    logoutButtonText: {
        color: AppColors.white,
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },
});

export default SettingsScreen;
