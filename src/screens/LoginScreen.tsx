import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import authService from "../services/authService";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../store/slices/authSlice";

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { promptAsync, request } = useGoogleAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    dispatch(loginStart());
    try {
      const user = await authService.signInWithEmail(email, password);
      dispatch(
        loginSuccess({
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        })
      );
    } catch (err: any) {
      dispatch(loginFailure(err.message));
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#0F1419", "#1A1F3A", "#0F1419"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to AIVAK</Text>
              </View>

              {/* Card Container */}
              <View style={styles.card}>
                <FloatingLabelInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <FloatingLabelInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <Button
                  mode="contained"
                  onPress={handleEmailLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.signInButton}
                  labelStyle={styles.buttonLabel}
                >
                  Sign In
                </Button>

                {/* <View style={styles.dividerContainer}>
                  <Divider style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <Divider style={styles.divider} />
                </View>

                <GoogleSignInButton
                  onPress={() => promptAsync()}
                  disabled={!request || loading}
                /> */}

                <Button
                  mode="text"
                  onPress={() => navigation.navigate("Signup")}
                  style={styles.linkButton}
                  labelStyle={styles.linkLabel}
                >
                  Don't have an account?{" "}
                  <Text style={styles.linkHighlight}>Sign Up</Text>
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8B93A7",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#1E2337",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 6,
    backgroundColor: "#00D9FF",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#2A3048",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#8B93A7",
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
  },
  linkLabel: {
    color: "#8B93A7",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#00D9FF",
    fontWeight: "600",
  },
});

export default LoginScreen;
