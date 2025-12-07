import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { auth, db } from '../config/firebase';

import { OtpService } from '../services/OtpService';

interface UserData {
    uid: string;
    email: string;
    name: string;
    username: string;
    avatar?: string;
    createdAt: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signUp: (email: string, pass: string, name: string) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserData: (data: Partial<UserData>) => Promise<void>;
    reloadUser: () => Promise<void>;
    verifyEmailWithOtp: (otp: string) => Promise<boolean>;
    resendOtp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '155369869924-p9d5ifi4piijbudalddbq9bj4omla2i5.apps.googleusercontent.com',
            offlineAccess: false,
            scopes: ['profile', 'email'],
        });

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser);
                if (currentUser) {
                    // Fetch user data from Firestore
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
                    }
                } else {
                    setUserData(null);
                }
            } catch (e) {
                console.error("Auth State Change Error:", e);
            } finally {
                setLoading(false);
            }
        });

        // Safety timeout in case onAuthStateChanged hangs
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const signUp = async (email: string, pass: string, name: string) => {
        const res = await createUserWithEmailAndPassword(auth, email, pass);

        // Send OTP via Service
        try {
            await OtpService.sendOtp(email, name);
            console.log("OTP sent to:", email);
        } catch (otpError) {
            console.error("Error sending OTP:", otpError);
            // We don't block creation, but user will need to resend OTP
        }

        const username = '@' + email.split('@')[0]; // Default username
        const newUser: UserData = {
            uid: res.user.uid,
            email,
            name,
            username,
            createdAt: new Date().toISOString(),
            isVerified: false,
        };
        // Create user document in Firestore
        await setDoc(doc(db, 'users', res.user.uid), newUser);
        setUserData(newUser);
    };

    const signIn = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            throw error;
        }
        // Loading state is handled by onAuthStateChanged
    };

    const signInWithGoogle = async () => {
        try {
            // v13: explicitly check play services
            await GoogleSignin.hasPlayServices();
            const userInfo: any = await GoogleSignin.signIn();
            console.log("DEBUG: Google Sign-In Result:", JSON.stringify(userInfo));

            // Handle potential native version mismatch (v16 vs v13 bridge)
            const userObj = userInfo.data || userInfo;
            const idToken = userObj.idToken;

            if (!idToken) throw new Error(`No ID token found in response. keys: ${Object.keys(userObj)}`);

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const res = await signInWithCredential(auth, googleCredential);

            // Check if user doc exists, if not create it
            const docRef = doc(db, 'users', res.user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                const newUser: UserData = {
                    uid: res.user.uid,
                    email: res.user.email || '',
                    name: res.user.displayName || 'User',
                    username: '@' + (res.user.email?.split('@')[0] || 'user'),
                    avatar: res.user.photoURL || undefined,
                    createdAt: new Date().toISOString(),
                    isVerified: true, // Google Sign In is considered verified
                };
                await setDoc(docRef, newUser);
                setUserData(newUser);
            }
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                return;
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                Alert.alert('Sign In in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert('Play Services not available');
            } else {
                // some other error happened
                Alert.alert('Google Sign-In Error', `Code: ${error.code}\nMessage: ${error.message}\nRaw: ${JSON.stringify(error)}`);
            }
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
        try {
            await GoogleSignin.signOut();
        } catch (e) {
            // Ignore if not signed in with Google
        }
        setUserData(null);
    };

    const updateUserData = async (data: Partial<UserData>) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, data);
        setUserData(prev => prev ? { ...prev, ...data } : null);
    };

    const reloadUser = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            setUser({ ...auth.currentUser });

            // Re-fetch firestore data to sync isVerified status
            const docRef = doc(db, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data() as UserData);
            }
        }
    };

    const verifyEmailWithOtp = async (otp: string): Promise<boolean> => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return false;

        try {
            await OtpService.verifyOtp(currentUser.email, otp);

            // Mark as verified in Firestore
            await updateUserData({ isVerified: true });

            // Also explicitly set verify in local state to ensure navigation updates immediately
            if (userData) {
                setUserData({ ...userData, isVerified: true });
            }

            return true;
        } catch (error) {
            console.error("OTP Verification failed:", error);
            throw error;
        }
    };

    const resendOtp = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return;

        const name = userData?.name || currentUser.displayName || 'User';
        await OtpService.sendOtp(currentUser.email, name);
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            signUp,
            signIn,
            signInWithGoogle,
            logout,
            updateUserData,
            reloadUser,
            verifyEmailWithOtp,
            resendOtp
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
