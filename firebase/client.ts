import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDMS3LQYlUlwHDIvYWbqdn4XnZlKfHgBO0",
    authDomain: "intervo-665ce.firebaseapp.com",
    projectId: "intervo-665ce",
    storageBucket: "intervo-665ce.firebasestorage.app",
    messagingSenderId: "288961438182",
    appId: "1:288961438182:web:c9aa0d54de4f17eae47627",
    measurementId: "G-RLJXVRPRJ7"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);