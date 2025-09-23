import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Linking,
} from "react-native";
import { AppIcons } from "../constants/AppIcons";
import { AppColors } from "../constants/AppColors";
import { AppConstants } from "../constants/AppConstants";
import { useNavigation } from "@react-navigation/native";
import { AppScreen } from "../constants/AppScreens";
import { AuthController } from "../controllers/AuthController";
import { settingsController } from "../controllers/SettingsController";
import BackButton from "../shared/BackBtn.shared";
import { SocialLink } from "../models/socialLinks.model";

export const SettingsScreen = () => {
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [registeredDate, setRegisteredDate] = useState<Date | null>(null);

    const navigation = useNavigation();

    const socialLinks: SocialLink[] = [
        { name: 'GitHub', icon: AppIcons.Github, url: 'https://github.com/srikanth-io' },
        { name: 'LinkedIn', icon: AppIcons.LinkedIn, url: 'https://www.linkedin.com/in/srikanth-io/' },
        { name: 'Instagram', icon: AppIcons.Instagram, url: 'https://www.instagram.com/username/' },
    ];

    useEffect(() => {
        const user = AuthController.getCurrentUser();
        if (user) {
            setProfileUrl(user.photoURL || null);
            setEmail(user.email || "No Email");
            setRegisteredDate(user.metadata.creationTime ? new Date(user.metadata.creationTime) : null);
        }
        settingsController.getAccountDetails().then((data) => {
            if (data) setUsername(data.username);
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
                    {React.createElement(icon, { color: AppColors.white, size: 20 })}
                </View>
                <Text style={styles.optionText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    const openLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn("Cannot open URL:", url);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton />

            <View style={styles.profileSection}>
                <Text style={styles.usernameText}>{username}</Text>
                <Text style={styles.emailText}>{email}</Text>

                {/* Social Links */}
                <View style={styles.socialContainer}>
                    {socialLinks.map((link) => (
                        <TouchableOpacity
                            key={link.name}
                            style={styles.socialButton}
                            onPress={() => openLink(link.url)}
                        >
                            {React.createElement(link.icon, { color: AppColors.darkGreen, size: 20 })}
                            <Text style={styles.socialText}>{link.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Registered Date */}
                {registeredDate && (
                    <View style={styles.registeredContainer}>
                        <Text style={styles.registeredText}>
                           Joined: {calculateDaysSince(registeredDate)} days ago, {registeredDate.toDateString()}
                        </Text>
                    </View>
                )}
            </View>

            {/* Options Section */}
            <View style={styles.optionsSection}>
                <Text style={styles.optionsHeader}>Preferences</Text>
                {renderOptionButton(
                    "Profile Settings",
                    AppIcons.Settings,
                    () => navigation.navigate(AppScreen.PROFILESCREEN as never)
                )}
                {renderOptionButton("Support", AppIcons.Book, () => console.log("Support clicked"))}
                {renderOptionButton("Contact Us", AppIcons.Mail, () => console.log("Contact clicked"))}
                {renderOptionButton("Export Settings", AppIcons.Download, () => console.log("Export clicked"))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <AppIcons.LogOut color={AppColors.white} size={18} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: AppColors.green50, padding: 20, alignItems: "center" },
    profileSection: { width: "100%", alignItems: "center", marginBottom: 50, marginTop: 100 },
    usernameText: { fontSize: 24, fontWeight: "bold", color: AppColors.black, marginBottom: 4, textAlign: "center" },
    emailText: { fontSize: 16, color: AppColors.gray, marginBottom: 12, textAlign: "center" },
    socialContainer: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 },
    socialButton: { flexDirection: "row", alignItems: "center", backgroundColor: AppColors.grayWhite, paddingHorizontal: AppConstants.inputHeight, paddingVertical: 10, borderRadius: 8, margin: 4 },
    socialText: { marginLeft: 6, fontSize: 14, color: AppColors.darkGreen },
    registeredContainer: { alignItems: "center", marginVertical: 8 },
    registeredText: { fontSize: 14, color: AppColors.darkGray },
    optionsSection: { width: "100%", marginBottom: 30 },
    optionsHeader: { fontSize: 20, color: AppColors.black, marginBottom: 10 },
    optionButton: { backgroundColor: AppColors.grayWhite, borderRadius: AppConstants.buttonRadius, padding: 15, marginBottom: 10 },
    optionContent: { flexDirection: "row", alignItems: "center" },
    optionIconContainer: { backgroundColor: AppColors.darkGreen, borderRadius: 50, padding: 10, marginRight: 10 },
    optionText: { color: AppColors.black, fontSize: 16, fontWeight: "500" },
    logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: AppColors.googleRed, borderRadius: AppConstants.buttonRadius, paddingHorizontal: AppConstants.inputWidth, paddingVertical: AppConstants.inputHeight },
    logoutButtonText: { color: AppColors.white, fontWeight: "600", fontSize: 16, marginLeft: 8 },
});

export default SettingsScreen;
