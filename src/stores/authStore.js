import { writable } from "svelte/store";
import { firebaseAuth } from "../lib/firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail, updatePassword, signOut, getAuth, setPersistence, inMemoryPersistence} from "firebase/auth";

export const authStore = new writable({
    uid: null,
    isLoading: true,
    currentUser: null,
});

export const authHandlers = {
    signup: async (email, password) => {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
    },
    logout: async () => {
        await signOut(firebaseAuth);
    },
    resetPassword: async (email) => {
        await sendPasswordResetEmail(firebaseAuth, email);
    },
    updateEmail: async (email) => {
        await updateEmail(firebaseAuth.currentUser, email);
    },
    updatePassword: async (password) => {
        await updatePassword(firebaseAuth.currentUser, password);
    },
    login: async (email, password) => {
        //await signInWithEmailAndPassword(firebaseAuth, email, password);
        setPersistence(firebaseAuth, inMemoryPersistence)
        .then(() => {
            return signInWithEmailAndPassword(firebaseAuth, email, password);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }
};