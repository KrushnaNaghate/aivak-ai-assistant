import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  HelperText,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../store/slices/authSlice";

interface Props {
  navigation: any;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch();

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPass !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  // Handle form validation
  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    return isEmailValid && isPasswordValid && isConfirmPasswordValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors and try again");
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const user = await authService.signUpWithEmail(email, password);

      // You can update the user profile with the full name here if needed
      // await updateProfile(user, { displayName: fullName });

      dispatch(
        loginSuccess({
          id: user.uid,
          email: user.email!,
          displayName: fullName || user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        })
      );

      Alert.alert(
        "Success!",
        "Your account has been created successfully. Welcome to AIVAK!",
        [{ text: "OK", style: "default" }]
      );
    } catch (error: any) {
      dispatch(loginFailure(error.message));

      // Handle specific Firebase errors
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Try logging in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    dispatch(loginStart());

    try {
      const user = await authService.signInWithGoogle();
      dispatch(
        loginSuccess({
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        })
      );

      Alert.alert(
        "Welcome!",
        "Your account has been created successfully with Google!",
        [{ text: "OK", style: "default" }]
      );
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Join AIVAK</Title>
          <Text style={styles.subtitle}>
            Create your AI business assistant account
          </Text>

          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
            disabled={loading}
          />

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text.toLowerCase().trim());
              if (emailError) validateEmail(text.toLowerCase().trim());
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
            error={!!emailError}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
            }}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            disabled={loading}
            error={!!passwordError}
          />
          <HelperText type="error" visible={!!passwordError}>
            {passwordError}
          </HelperText>

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) validateConfirmPassword(text);
            }}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            disabled={loading}
            error={!!confirmPasswordError}
          />
          <HelperText type="error" visible={!!confirmPasswordError}>
            {confirmPasswordError}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Account
          </Button>

          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            onPress={handleGoogleSignup}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="google"
          >
            Sign up with Google
          </Button>

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
              style={styles.linkButton}
            >
              Sign In
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1565C0",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    fontSize: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 20,
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  linkButton: {
    marginLeft: 8,
  },
});

export default SignupScreen;
