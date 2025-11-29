import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Minimal Firebase config - only essentials
const firebaseConfig = {
    apiKey: "AIzaSyCFRmyp7gwZkYTrZFfC1gbCRS6a4Dt4Smo",
    authDomain: "leonjarvis-notes.firebaseapp.com",
    projectId: "leonjarvis-notes",
    storageBucket: "leonjarvis-notes.firebasestorage.app",
    messagingSenderId: "339393479735",
    appId: "1:339393479735:web:94386b710c87635342bb2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { signInWithPopup, signOut };
