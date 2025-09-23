import { auth } from '../core/config';
import {
    createUserWithEmailAndPassword,
    getRedirectResult,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    User,
} from 'firebase/auth';
import { ToastAndroid } from 'react-native';

export class AuthController {
    // Register user
    static async registerUser(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
            throw new Error(error.message);
        }
    }

    // Login user
    static async loginUser(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
            throw new Error(error.message);
        }
    }

    // Google Sign-In
    static async googleSignIn(): Promise<User | null> {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (err: any) {
            console.error('Popup sign-in failed:', err.message);
            try {
                await signInWithRedirect(auth, provider);
                const result = await getRedirectResult(auth);
                return result ? result.user : null;
            } catch (redirectError: any) {
                console.error('Redirect sign-in failed:', redirectError.message);
                ToastAndroid.show(redirectError.message, ToastAndroid.LONG);
                throw new Error(redirectError.message);
            }
        }
    }

    // Observe login status
    static observeAuth(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, (user) => callback(user));
    }

    // Password Reset
    static async sendPasswordResetEmail(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent to: ', email);
        } catch (error: any) {
            console.error("Error sending reset email:", error);
            throw new Error(error.message || "Failed to send password reset email");
        }
    }

    // Get current user
    static getCurrentUser(): User | null {
        return auth.currentUser;
    }

    // Logout
    static async logout(): Promise<void> {
        try {
            await auth.signOut();
            ToastAndroid.show(`You've been logged out`, ToastAndroid.SHORT);
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
            throw new Error(error.message);
        }
    }
}
