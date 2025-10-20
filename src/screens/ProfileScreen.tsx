import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, List, Text } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/authService";
import { logout } from "../store/slices/authSlice";
import { clearMessages, reinitializeChat } from "../store/slices/chatSlice";
import { RootState } from "../store/store";

const ProfileScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of AIVAK?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.signOut();
              dispatch(logout());
              dispatch(clearMessages());
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const clearChatHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "This will delete all your conversation history with AIVAK. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            dispatch(reinitializeChat({ user }));
            Alert.alert("Success", "Chat history cleared successfully!");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Header */}
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                {user?.photoURL ? (
                  <Avatar.Image
                    size={100}
                    source={{ uri: user.photoURL }}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text
                    size={100}
                    label={getInitials(user?.displayName || user?.email || "U")}
                    style={styles.avatar}
                    labelStyle={styles.avatarLabel}
                  />
                )}

                <Text variant="headlineMedium" style={styles.name}>
                  {user?.displayName || "Business User"}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Premium User</Text>
                </View>
              </Card.Content>
            </Card>

            {/* Settings Section */}
            <Card style={styles.settingsCard}>
              <List.Section style={styles.listSection}>
                <List.Subheader style={styles.sectionHeader}>
                  Account Settings
                </List.Subheader>

                <List.Item
                  title="Clear Chat History"
                  description="Delete all conversation history"
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="delete-outline"
                      color="#FF6B6B"
                    />
                  )}
                  onPress={clearChatHistory}
                  style={styles.listItem}
                />

                <Divider style={styles.divider} />

                <List.Item
                  title="Sign Out"
                  description="Sign out of your account"
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  left={(props) => (
                    <List.Icon {...props} icon="logout" color="#FF6B6B" />
                  )}
                  onPress={handleLogout}
                  style={styles.listItem}
                />

                <Divider style={styles.divider} />

                <List.Item
                  title="App Version"
                  description="AIVAK AI Assistant v2.0.0"
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="information-outline"
                      color="#00D9FF"
                    />
                  )}
                  style={styles.listItem}
                />
              </List.Section>
            </Card>

            {/* Stats Card */}
            <Card style={styles.statsCard}>
              <Card.Content>
                <Text style={styles.statsTitle}>Your AIVAK Stats</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>47</Text>
                    <Text style={styles.statLabel}>Conversations</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Days Active</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>156</Text>
                    <Text style={styles.statLabel}>Questions Asked</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#1E2337",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    backgroundColor: "#00D9FF",
    marginBottom: 16,
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarLabel: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  name: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    color: "#8B93A7",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(0, 217, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#00D9FF",
  },
  badgeText: {
    color: "#00D9FF",
    fontSize: 12,
    fontWeight: "600",
  },
  settingsCard: {
    backgroundColor: "#1E2337",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  listSection: {
    marginVertical: 0,
  },
  sectionHeader: {
    color: "#8B93A7",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
  },
  listItem: {
    paddingVertical: 4,
  },
  listItemTitle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  listItemDescription: {
    color: "#8B93A7",
    fontSize: 13,
  },
  divider: {
    backgroundColor: "#2A3048",
    marginVertical: 4,
  },
  statsCard: {
    backgroundColor: "#1E2337",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: "#00D9FF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#8B93A7",
    fontSize: 12,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#2A3048",
  },
});

export default ProfileScreen;
