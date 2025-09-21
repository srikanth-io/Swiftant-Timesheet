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
import Checkbox from 'expo-checkbox';
import { AppConstants } from "../constants/AppConstants";
import { AppColors } from "../constants/AppColors";
import { AppScreen } from "../constants/AppScreens";
import { AppIcons } from "../constants/AppIcons";
import Toast from "react-native-toast-message";
import { AppErrors } from "../constants/AppErrors";
import { AuthController } from "../controllers/AuthController";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

const RegisterScreen: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setChecked] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleRegister = async () => {
        if (!userName || userName.trim().length < 3) {
            Toast.show({ type: 'error', text1: AppErrors.minUserName });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            Toast.show({ type: 'error', text1: AppErrors.validEmail });
            return;
        }

        if (!password || password.length < 6) {
            Toast.show({ type: 'error', text1: AppErrors.minPassword });
            return;
        }

        if (!isChecked) {
            Toast.show({ type: 'error', text1: AppErrors.termsAndConditions });
            return;
        }
        console.log("Registering with:", userName, email, password);
        Toast.show({ type: 'success', text1: AppErrors.regSuccess });

        try {
            const user = await AuthController.registerUser(email, password);
            if (!user) {
                throw new Error('Registration failed: User is null');
            }
            await setDoc(doc(db, 'users', user.uid), { username: userName, email });
            Toast.show({ type: 'success', text1: 'Registered successfully!' });
            console.log(user);
            clearInputs();
            navigation.navigate(AppScreen.LOGINSCREEN as never);
        } catch (err: any) {
            Toast.show({ type: 'error', text1: err.message });
        }
    };

    const handleLoginRoute = () => {
        navigation.navigate(AppScreen.LOGINSCREEN as never);
    };

    const clearInputs = () => {
        setUserName('');
        setEmail('');
        setPassword('');
        setChecked(false);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: AppColors.white ? AppColors.white : 'transparent' }}
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
                            source={require("../../assets/img/greenBranch.jpg")}
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
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Hi there!</Text>
                            <Text style={styles.title}>Create Account Now</Text>
                        </View>

                        {/* Username */}
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={userName}
                            onChangeText={setUserName}
                            keyboardType="default"
                            autoCapitalize="none"
                        />

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

                        <View style={styles.termsContainer}>
                            <View>
                                <Checkbox
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? AppColors.green900 : AppColors.darkGray}
                                />
                            </View>
                            <Text style={styles.termsText}>I accept the <Text style={styles.termsLink}>Terms & Conditions</Text></Text>
                        </View>


                        {/* Register button */}
                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>

                        {/* Signup */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Already have an account?</Text>
                            <TouchableOpacity onPress={handleLoginRoute}>
                                <Text style={styles.signupLink}> Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <StatusBar hidden />
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: AppConstants.viewMarginBottom,
        backgroundColor: AppColors.white,
    },
    titleContainer: {
        marginBottom: AppConstants.viewMarginBottom,
    },
    title: {
        fontSize: 40,
        color: AppColors.green900,
        fontWeight: "bold",
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
    termsContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: AppConstants.inputWidth,
        marginBottom: AppConstants.viewMarginBottom
    },
    termsText: {
        flex: 1,
        color: AppColors.darkGray,
        paddingHorizontal: AppConstants.inputWidth,
        fontSize: 16
    },
    termsLink: {
        color: AppColors.green900,
        fontWeight: "600"
    },
    registerButton: {
        backgroundColor: AppColors.darkGreen,
        borderRadius: AppConstants.buttonRadius,
        paddingVertical: AppConstants.inputHeight,
        marginBottom: 8,
    },
    registerButtonText: {
        color: AppColors.white,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: AppConstants.viewMarginBottom,
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
        flex: 1,
    },
    imageFade: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
    },
});
