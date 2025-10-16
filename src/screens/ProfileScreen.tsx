import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, List, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/authService";

// ✅ Import from the correct slices
import { logout } from "../store/slices/authSlice"; // logout from authSlice
import { clearMessages, reinitializeChat } from "../store/slices/chatSlice"; // clearMessages from chatSlice

import { RootState } from "../store/store";

const ProfileScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await authService.signOut();
            // ✅ Dispatch logout from authSlice
            dispatch(logout());
            // ✅ Clear chat messages
            dispatch(clearMessages());
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  const clearChatHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "This will delete all your conversation history. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // ✅ Clear messages and reinitialize with welcome message
            dispatch(reinitializeChat({ user }));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Image
            size={80}
            source={{ uri: user?.photoURL || "https://via.placeholder.com/80" }}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user?.displayName || "Business User"}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.email}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <List.Section>
          <List.Subheader>Chat Settings</List.Subheader>
          <List.Item
            title="Clear Chat History"
            description="Delete all conversation history"
            left={(props) => <List.Icon {...props} icon="delete" />}
            onPress={clearChatHistory}
          />
          <Divider />
          <List.Item
            title="App Version"
            description="AIVAK AI Assistant v1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
      >
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    color: "#666",
    textAlign: "center",
  },
  menuCard: {
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: "auto",
  },
});

export default ProfileScreen;
