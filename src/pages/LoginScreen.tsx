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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppConstants } from "../constants/AppConstants";
import { AppColors } from "../constants/AppColors";
import { AppScreen, AppVersion } from "../constants/AppScreens";
import { AppIcons } from "../constants/AppIcons";

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleLogin = () => {
        console.log("Logging in with:", email, password);
    };

    const handleForgotPassword = () => {
        console.log("Forgot password tapped");
    };

    const handleGoogleSignIn = () => {
        console.log("Google sign-in tapped");
    };

    const handleSignup = () => {
        console.log("Signup tapped");
        navigation.navigate(AppScreen.REGISTERSCREEN as never);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: AppColors.white }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../../assets/img/greenForest.jpg")}
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
                        <View style={styles.versionContainer}>
                            <Text style={styles.versionText}>Version: {AppVersion.APPVERSION} </Text>
                        </View>
                        <Text style={styles.title}>Welcome Back!</Text>

                        {/* Email */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Password */}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <AppIcons.EyeClose size={22} color={AppColors.green900} />
                                ) : (
                                    <AppIcons.EyeOpen size={22} color={AppColors.green900} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Forgot password */}
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login button */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.horizontalLine} />

                        {/* Google sign-in */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={handleGoogleSignIn}
                        >
                            <Text style={styles.googleText}>Sign in with Google</Text>
                        </TouchableOpacity>

                        {/* Signup */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don’t have an account?</Text>
                            <TouchableOpacity onPress={handleSignup}>
                                <Text style={styles.signupLink}> Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <StatusBar hidden />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;

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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: AppColors.green900,
        borderRadius: AppConstants.inputRadius,
        paddingVertical: 5,
        marginBottom: 16,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: AppConstants.inputWidth,
        fontSize: 16,
    },
    eyeButton: {
        paddingHorizontal: AppConstants.inputWidth,
    },
    forgotText: {
        color: AppColors.green900,
        textAlign: "right",
        fontWeight: "600",
        marginBottom: AppConstants.viewMarginBottom,
    },
    loginButton: {
        backgroundColor: AppColors.darkGreen,
        borderRadius: AppConstants.buttonRadius,
        paddingVertical: AppConstants.inputHeight,
        marginBottom: 8,
    },
    loginButtonText: {
        color: AppColors.white,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
    },
    horizontalLine: {
        borderBottomColor: AppColors.lightGray,
        borderBottomWidth: 1,
        marginVertical: AppConstants.viewMarginBottom,
    },
    googleButton: {
        backgroundColor: AppColors.googleRed,
        borderRadius: AppConstants.buttonRadius,
        paddingVertical: AppConstants.inputHeight,
        marginBottom: 16,
        marginTop: 8,
    },
    googleText: {
        textAlign: "center",
        color: AppColors.white,
        fontWeight: "600",
        fontSize: 16,
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: AppConstants.viewMarginBottom
    },
    signupText: {
        fontSize: 14,
        color: AppColors.darkGray,
        fontWeight: "600",
    },
    signupLink: {
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
    },
    versionContainer: {
        position: "absolute",
        top: 10,
        right: 20,
    },
    versionText: {
        color: AppColors.darkGreen,
        fontSize: 16
    }
});
