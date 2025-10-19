import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
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
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Welcome to AIVAK</Title>
            <Text style={styles.subtitle}>Your Future Business Assistant</Text>

            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              onPress={handleEmailLogin}
            >
              Sign In
            </Button>

            <Divider style={{ marginVertical: 16 }} />

            {/* Google Sign In */}
            <TouchableOpacity
              onPress={() => promptAsync()}
              disabled={!request}
              style={styles.googleBtn}
            >
              <MaterialCommunityIcons name="google" color="#DB4437" size={20} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <Button
              mode="text"
              onPress={() => navigation.navigate("Signup")}
              style={styles.linkBtn}
            >
              Don’t have an account? Sign up
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  bg: {
    flex: 1,
    backgroundColor: "#0a0f24",
  },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
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
  loginButton: {
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

export default LoginScreen;
