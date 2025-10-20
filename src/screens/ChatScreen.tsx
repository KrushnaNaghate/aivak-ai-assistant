import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { ActivityIndicator, Avatar, Text } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import MessageBubble from "../components/MessageBubble";
import geminiService from "../services/geminiService";
import {
  addMessage,
  reinitializeChat,
  setLoading,
} from "../store/slices/chatSlice";
import { RootState } from "../store/store";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatScreen = ({ navigation }: any) => {
  const [input, setInput] = useState("");
  const [lastMessageId, setLastMessageId] = useState<string>("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const insets = useSafeAreaInsets();

  // Keyboard listeners
  useEffect(() => {
    const onKeyboardShow = (e: any) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const onKeyboardHide = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
    };

    const showListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      onKeyboardShow
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      onKeyboardHide
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      dispatch(reinitializeChat({ user }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: input.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    dispatch(addMessage(userMessage));
    setInput("");
    dispatch(setLoading(true));

    try {
      const reply = await geminiService.generateResponse(
        input.trim(),
        messages
      );
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: reply,
        isUser: false,
        timestamp: Date.now(),
      };
      setLastMessageId(botMessage.id);
      dispatch(addMessage(botMessage));
    } catch (err) {
      console.log("Error generating response:", err);
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: Date.now(),
      };
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => (
    <MessageBubble
      message={item}
      showTypewriter={
        !item.isUser &&
        item.id === lastMessageId &&
        index === messages.length - 1
      }
    />
  );

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Avatar.Image
                size={44}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/8943/8943377.png",
                }}
                style={styles.aiAvatar}
              />
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>AIVAK</Text>
                <Text style={styles.headerSubtitle}>AI Business Assistant</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("Profile")}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={28}
                color="#00D9FF"
              />
            </TouchableOpacity>
          </View>

          {/* Chat Area + Input */}
          <KeyboardAvoidingView
            style={[
              styles.chatAndInputContainer,
              { paddingBottom: keyboardHeight },
            ]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#00D9FF" />
                  <Text style={styles.loadingText}>AIVAK is thinking...</Text>
                </View>
              </View>
            )}

            {/* Input Container */}
            <View style={[styles.inputContainer, { paddingBottom: 60 }]}>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={inputRef}
                  placeholder="Ask AIVAK anything about your business..."
                  value={input}
                  onChangeText={setInput}
                  style={styles.textInput}
                  placeholderTextColor="#8B93A7"
                  multiline
                  maxLength={500}
                  editable={!isLoading}
                  onFocus={() => {
                    setTimeout(() => {
                      flatListRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                  }}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!input.trim() || isLoading}
                  style={[
                    styles.sendButton,
                    input.trim() && !isLoading
                      ? styles.sendButtonActive
                      : styles.sendButtonInactive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="send"
                    size={20}
                    color={input.trim() && !isLoading ? "#1F1F1F" : "#8B93A7"}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(30, 35, 55, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#2A3048",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiAvatar: {
    backgroundColor: "#1E2337",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#00D9FF",
    fontSize: 12,
    opacity: 0.8,
  },
  profileButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0, 217, 255, 0.1)",
  },
  chatAndInputContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  inputContainer: {
    backgroundColor: "rgba(30, 35, 55, 0.98)",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A3048",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1E2337",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  sendButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#00D9FF",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonInactive: {
    backgroundColor: "rgba(139, 147, 167, 0.2)",
  },
});

export default ChatScreen;
