import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Card,
  Divider,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import authService from "../services/authService";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../store/slices/authSlice";

const SignupScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { promptAsync, request } = useGoogleAuth();

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    dispatch(loginStart());
    try {
      const user = await authService.signUpWithEmail(email, password, fullName);
      dispatch(
        loginSuccess({
          id: user.uid,
          email: user.email!,
          displayName: fullName,
          photoURL: user.photoURL || undefined,
        })
      );
    } catch (err: any) {
      dispatch(loginFailure(err.message));
      alert("Signup Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1500&q=80",
      }}
      style={styles.bg}
      imageStyle={{ opacity: 0.15 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Join AIVAK</Title>
              <Text style={styles.subtitle}>
                Create your future business assistant account
              </Text>

              <TextInput
                label="Full Name"
                mode="outlined"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                autoCapitalize="words"
              />

              <TextInput
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                label="Password"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
              />

              <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                style={styles.signupButton}
                onPress={handleSignup}
              >
                Create Account
              </Button>

              <Divider style={{ marginVertical: 16 }} />

              {/* Google Signup */}
              <TouchableOpacity
                onPress={() => promptAsync()}
                disabled={!request || loading}
                style={[styles.googleBtn, loading && { opacity: 0.6 }]}
              >
                <MaterialCommunityIcons
                  name="google"
                  color="#DB4437"
                  size={20}
                />
                <Text style={styles.googleText}>Sign Up with Google</Text>
              </TouchableOpacity>

              <Button
                mode="text"
                onPress={() => navigation.navigate("Login")}
                style={styles.linkBtn}
              >
                Already have an account? Sign In
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bg: {
    flex: 1,
    backgroundColor: "#0a0f24",
  },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingVertical: 12,
  },
  title: {
    textAlign: "center",
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    color: "#9ac1ff",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  signupButton: {
    marginVertical: 8,
    borderRadius: 24,
    backgroundColor: "#00b8f4",
  },
  googleBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 10,
  },
  googleText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#000",
  },
  linkBtn: {
    marginTop: 12,
    alignSelf: "center",
  },
});

export default SignupScreen;
