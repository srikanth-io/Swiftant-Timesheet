import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { AppColors } from "../constants/AppColors";
import { AppConstants } from "../constants/AppConstants";
import { settingsController } from "../controllers/SettingsController";
import { AppIcons } from "../constants/AppIcons";
import BackButton from "../shared/BackBtn.shared";

export const ProfileScreen = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [editable, setEditable] = useState<boolean>(false);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [userTag, setUserTag] = useState<string | null>(null);

    useEffect(() => {
        settingsController.getAccountDetails().then((data) => {
            if (data) {
                setUsername(data.username);
                setEmail(data.email);
            }
        });
    }, []);

    const pickImage = async () => {
        const mockImage = "../../assets/img/person.png";
        console.log("Image picker opened. Setting mock image.");
        setProfileUrl(mockImage);
    };

    const handleSave = () => {
        if (editable) {
            settingsController.updateUsername(username);
        }
        setEditable(!editable);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileSection}>
                <BackButton />
                <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
                    <Image
                        source={{ uri: profileUrl || "../../assets/img/person.png" }}
                        style={styles.profileImage}
                    />
                    <View style={styles.editIconOverlay}>
                        <AppIcons.Pencil color={AppColors.white} size={18} />
                    </View>
                </TouchableOpacity>

                {/* Username and Email */}
                <View style={styles.userInfo}>
                    <View style={styles.usernameContainer}>
                        {editable ? (
                            <TextInput
                                style={styles.usernameInput}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Username"
                                autoCapitalize="none"
                            />
                        ) : (
                            <Text style={styles.usernameText}>{username || "Your Name"}</Text>
                        )}
                        {userTag === "Dev" && (
                            <View style={styles.devTag}>
                                <Text style={styles.devTagText}>Dev</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.emailText}>{email}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                        <Text style={styles.actionButtonText}>{editable ? "Save" : "Edit"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.accountContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    editable={editable}
                    style={styles.input}
                />

                <Text style={styles.label}>Email (read-only)</Text>
                <TextInput
                    value={email}
                    editable={false}
                    style={[styles.input, { backgroundColor: AppColors.lightGray }]}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: AppConstants.viewMarginBottom,
        paddingTop: 40,
        backgroundColor: AppColors.white,
        alignItems: "center",
    },
    accountContainer: {
        width: "100%",
        marginTop: 20,
    },

    profileSection: {
        width: "100%",
        alignItems: "center",
        marginBottom: 30,
        paddingTop: 30,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.lightGray,
        paddingBottom: 20,
    },
    profileImageWrapper: {
        position: "relative",
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: AppColors.green900,
        marginBottom: 20,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 75,
    },
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
    userInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    usernameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    usernameText: {
        fontSize: 28,
        fontWeight: "bold",
        color: AppColors.black,
    },
    usernameInput: {
        fontSize: 28,
        fontWeight: "bold",
        color: AppColors.black,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.darkGreen,
        textAlign: "center",
        paddingHorizontal: 5,
    },
    devTag: {
        backgroundColor: AppColors.darkGreen,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 10,
    },
    devTagText: {
        color: AppColors.white,
        fontSize: 12,
        fontWeight: "bold",
    },
    emailText: {
        fontSize: 16,
        color: AppColors.darkGray,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 10,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: AppColors.darkGreen,
        borderRadius: AppConstants.buttonRadius,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flex: 1,
    },
    actionButtonText: {
        color: AppColors.white,
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },
    logoutButton: {
        backgroundColor: AppColors.gray,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: AppColors.green900,
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: AppColors.green900,
        borderRadius: AppConstants.inputRadius,
        paddingHorizontal: AppConstants.inputWidth,
        paddingVertical: AppConstants.inputHeight,
        fontSize: 16,
        marginBottom: 12,
    },
});
