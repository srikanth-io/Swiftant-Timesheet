import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Platform,
    Image,
    StatusBar,
    ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppConstants } from "../constants/AppConstants";
import { AppColors } from "../constants/AppColors";
import { AppErrors } from "../constants/AppErrors";
import { AuthController } from "../controllers/AuthController";
import BackButton from "../shared/BackBtn.shared";

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleValidation = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            ToastAndroid.show(AppErrors.invalidCredentials, ToastAndroid.BOTTOM);
            return;
        }

        try {
            await AuthController.sendPasswordResetEmail(email);
            ToastAndroid.show(`Password reset email sent to ${email}. Please check your inbox.`, ToastAndroid.BOTTOM);
            clearInputs();
            navigation.goBack();
        } catch (error: any) {
            console.error("Password reset error:", error);
        }
    };

    const clearInputs = () => {
        setEmail('');
    }

    const handleLogin = () => {
        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={keyboardVisible ? 0 : -50}
            >
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="light-content"
                    translucent={true}
                />
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <BackButton/>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../../assets/img/greenLeaves.jpg")}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={[AppColors.white, "transparent"]}
                            style={styles.imageFade}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                        />
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.title}>Don't you remember Your password? </Text>

                        {/* Email */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Login button */}
                        <TouchableOpacity style={styles.forgotButton} onPress={handleValidation}>
                            <Text style={styles.forgotButtonText}>Sent Link</Text>
                        </TouchableOpacity>

                        {/* Signup */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Remember Password? </Text>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.loginLink}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: AppConstants.viewMarginBottom,
        backgroundColor: AppColors.white,
    },
    title: {
        fontSize: 40,
        color: AppColors.green900,
        fontWeight: "bold",
        marginBottom: AppConstants.viewMarginBottom,
    },
    input: {
        borderWidth: 2,
        borderColor: AppColors.green900,
        borderRadius: AppConstants.inputRadius,
        paddingHorizontal: AppConstants.inputWidth,
        paddingVertical: AppConstants.inputHeight,
        marginBottom: 16,
        fontSize: 16,
    },
    forgotButton: {
        backgroundColor: AppColors.darkGreen,
        borderRadius: AppConstants.buttonRadius,
        paddingVertical: AppConstants.inputHeight,
        marginBottom: 8,
    },
    forgotButtonText: {
        color: AppColors.white,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
    },
    message: {},
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: AppConstants.viewMarginBottom
    },
    loginText: {
        fontSize: 14,
        color: AppColors.darkGray,
        fontWeight: "600",
    },
    loginLink: {
        fontSize: 14,
        color: AppColors.green900,
        fontWeight: "600",
    },
    imageContainer: {
        position: "relative",
        height: 300,
        width: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imageFade: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    }
});
