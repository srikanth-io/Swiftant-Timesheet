import Toast from 'react-native-toast-message';
import { auth, db } from '../core/config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export class AuthController {
    // Register user
    static async registerUser(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Register error:', text2: error.message });
            throw new Error(error.message);
        }
    }

    // Login user
    static async loginUser(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log({ type: 'success', text1: 'User logged in:', text2: userCredential.user });
            return userCredential.user;
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Login error:', text2: error.message });
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


    // Get current user
    static getCurrentUser(): User | null {
        return auth.currentUser;
    }

    // Logout
    static async logout(): Promise<void> {
        try {
            await auth.signOut();
            console.log('User logged out');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Logout error:', text2: error.message });
            throw new Error(error.message);
        }
    }
}
