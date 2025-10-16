import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../store/slices/authSlice";
import { resetChat } from "../store/slices/chatSlice";
import { RootState } from "../store/store";

// Screens
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SignupScreen from "../screens/SignupScreen";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          loginSuccess({
            id: user.uid,
            email: user.email!,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
          })
        );
      } else {
        dispatch(logout());
        dispatch(resetChat()); // Clear chat when user logs out
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated Stack
          <>
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              key={user?.id} // Force re-render when user changes
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: "Profile",
                headerStyle: { backgroundColor: "#1565C0" },
                headerTintColor: "white",
              }}
            />
          </>
        ) : (
          // Unauthenticated Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
