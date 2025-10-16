import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
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

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
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
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Disabled Google Login for now
  const handleGoogleLogin = async () => {
    Alert.alert(
      "Coming Soon",
      "Google Sign-In will be available soon. Please use email login for now.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome to AIVAK AI Assistant</Title>
          <Text style={styles.subtitle}>Your Business AI Companion</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleEmailLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Sign In
          </Button>

          <Divider style={styles.divider} />

          {/* <Button
            mode="outlined"
            onPress={handleGoogleLogin}
            disabled={true} // ✅ Disabled for now
            style={[styles.button, styles.disabledButton]}
            icon="google"
          >
            Continue with Google (Coming Soon)
          </Button> */}

          <Button
            mode="text"
            onPress={() => navigation.navigate("Signup")}
            style={styles.linkButton}
          >
            Don't have an account? Sign up
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1565C0",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  divider: {
    marginVertical: 16,
  },
  linkButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
