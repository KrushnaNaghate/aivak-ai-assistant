import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as React from "react";
import { useDispatch } from "react-redux";
import { ANDROID_CLIENT_ID, WEB_CLIENT_ID } from "../../cred";
import { auth } from "../../firebaseConfig";
import { loginSuccess } from "../store/slices/authSlice";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const dispatch = useDispatch();

  const redirectUri = makeRedirectUri({ scheme: "aivak" });
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    redirectUri,
  });

  React.useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const credential = GoogleAuthProvider.credential(
        response.authentication.idToken
      );

      signInWithCredential(auth, credential)
        .then(({ user }) => {
          dispatch(
            loginSuccess({
              id: user.uid,
              email: user.email!,
              displayName: user.displayName || undefined,
              photoURL: user.photoURL || undefined,
            })
          );
        })
        .catch((err) => console.error("Google Login Error:", err));
    }
  }, [response]);

  return { promptAsync, request };
};
