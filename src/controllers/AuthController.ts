import { auth, db } from '../core/config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ToastAndroid } from 'react-native';

export class AuthController {
    // Register user
    static async registerUser(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.BOTTOM);
            throw new Error(error.message);
        }
    }

    // Login user
    static async loginUser(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.BOTTOM);
            throw new Error(error.message);
        }
    }

    // Signup with Google
    static async googleSignIn(idToken: string): Promise<User | null> {
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    username: user.displayName || '',
                    email: user.email || '',
                    photoURL: user.photoURL || '',
                    createdAt: new Date(),
                });
            }
            return user;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Check User Login Status
    public static readonly observeAuth = (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, (user) => {
            callback(user);
        });

    }

    // Password Reset Email
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
            ToastAndroid.show(`You've been logged out`, ToastAndroid.BOTTOM);
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.BOTTOM);
            throw new Error(error.message);
        }
    }
}
