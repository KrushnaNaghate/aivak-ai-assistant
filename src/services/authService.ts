import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../../firebaseConfig.js";

class AuthService {
  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile if displayName provided
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName.trim(),
        });
      }

      await this.storeUserToken(await result.user.getIdToken());
      return result.user;
    } catch (error: any) {
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await this.storeUserToken(await result.user.getIdToken());
      return result.user;
    } catch (error: any) {
      throw new Error(this.getFirebaseErrorMessage(error.code));
    }
  }

  // ✅ Remove Google Auth from service - will be handled in component
  async signInWithGoogle(): Promise<User> {
    throw new Error(
      "Google Sign-In will be available soon. Please use email authentication for now."
    );
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync("userToken");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async storeUserToken(token: string): Promise<void> {
    await SecureStore.setItemAsync("userToken", token);
  }

  async getStoredToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("userToken");
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email address is already in use by another account.";
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger password.";
      case "auth/user-not-found":
        return "No user found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  }
}

export default new AuthService();
