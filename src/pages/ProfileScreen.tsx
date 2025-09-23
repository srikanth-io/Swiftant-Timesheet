import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { AppColors } from "../constants/AppColors";
import { AppConstants } from "../constants/AppConstants";
import { settingsController } from "../controllers/SettingsController";
import { AppIcons } from "../constants/AppIcons";
import BackButton from "../shared/BackBtn.shared";
import { Linking } from "react-native";
import { SocialLink } from "../models/socialLinks.model";

export const ProfileScreen = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [editable, setEditable] = useState<boolean>(false);

    const socialLinks: SocialLink[] = [
        { name: 'GitHub', icon: AppIcons.Github, url: 'https://github.com/srikanth-io' },
        { name: 'LinkedIn', icon: AppIcons.LinkedIn, url: 'https://www.linkedin.com/in/srikanth-io/' },
        { name: 'Instagram', icon: AppIcons.Instagram, url: 'https://www.instagram.com/username/' },
    ];

    useEffect(() => {
        // Fetch user data
        settingsController.getAccountDetails().then((data) => {
            if (data) {
                setUsername(data.username);
                setEmail(data.email);
            }
        });
    }, []);

    const pickImage = async () => {
        const mockImage = "../../assets/img/person.png"; // Replace with actual image picker
        setProfileUrl(mockImage);
    };

    const handleSave = async () => {
        if (editable) {
            await settingsController.updateUsername(username);
            // Save social links if needed
        }
        setEditable(!editable);
    };

    const openLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
        else console.warn("Cannot open URL:", url);
    };

    return (
        <View style={styles.container}>
            <BackButton />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Profile Picture */}
                <TouchableOpacity style={styles.profileImageWrapper} onPress={pickImage}>
                    <Image
                        source={{ uri: profileUrl || "../../assets/img/person.png" }}
                        style={styles.profileImage}
                    />
                    <View style={styles.editIconOverlay}>
                        <AppIcons.Pencil color={AppColors.white} size={18} />
                    </View>
                </TouchableOpacity>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={[styles.input, !editable && styles.readonlyInput]}
                        value={username}
                        onChangeText={setUsername}
                        editable={editable}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, !editable && styles.readonlyInput]}
                        value={email}
                        onChangeText={setEmail}
                        editable={editable}
                        keyboardType="email-address"
                    />

                    {/* Social Links */}
                    <Text style={styles.label}>Social Links</Text>
                    {socialLinks.map((link, index) => (
                        <View key={index} style={styles.socialRow}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={link.url}
                                onChangeText={(text) => {
                                    const newLinks = [...socialLinks];
                                    newLinks[index].url = text;
                                }}
                                editable={editable}
                            />
                            {!editable && (
                                <TouchableOpacity
                                    style={styles.openButton}
                                    onPress={() => openLink(link.url)}
                                >
                                    {React.createElement(link.icon, { color: AppColors.white, size: 20 })}
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Edit/Save Button */}
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                    <Text style={styles.actionButtonText}>{editable ? "Save" : "Edit"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColors.green50 },
    scrollContainer: { padding: 20, paddingBottom: 100 },
    profileImageWrapper: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: AppColors.green900,
        marginBottom: 20,
        alignSelf: "center",
        position: "relative",
        marginTop: 100
    },
    profileImage: { width: "100%", height: "100%", borderRadius: 75 },
    editIconOverlay: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: AppColors.darkGreen,
        padding: 8,
        borderRadius: AppConstants.buttonRadius,
        borderWidth: 2,
        borderColor: AppColors.white,
    },
    formContainer: { marginTop: 10 },
    label: { fontSize: 16, fontWeight: "600", color: AppColors.green900, marginBottom: 6, marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: AppColors.green900,
        borderRadius: AppConstants.inputRadius,
        paddingHorizontal: AppConstants.inputWidth,
        paddingVertical: AppConstants.inputHeight,
        fontSize: 16,
        marginBottom: 10,
        color: AppColors.black,
    },
    readonlyInput: { backgroundColor: "#f2f2f2" },
    bottomButtonContainer: {
        position: "absolute",
        bottom: 10,
        left: 20,
        right: 20,
    },
    actionButton: {
        backgroundColor: AppColors.darkGreen,
        borderRadius: AppConstants.buttonRadius,
        paddingVertical: AppConstants.inputHeight,
        alignItems: "center",
    },
    actionButtonText: { color: AppColors.white, fontSize: 16, fontWeight: "600" },
    socialRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 10,
    },
    openButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: AppColors.darkGreen,
        borderRadius: 50,
    },
});
