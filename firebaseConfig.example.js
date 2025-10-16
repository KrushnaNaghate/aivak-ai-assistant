import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcw5X-Y9CfDgNufOXLrV68Z3g594qSdAg",
  authDomain: "aivak-chatbot.firebasestorage.app",
  projectId: "aivak-chatbot",
  storageBucket: "com.aivak.chatbot",
  messagingSenderId: "326873021433",
  appId: "1:326873021433:android:273797a4da95ca700ddb28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export default app;
