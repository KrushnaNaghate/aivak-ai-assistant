import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import MessageBubble from "../components/MessageBubble";
import geminiService from "../services/geminiService";
import {
  addMessage,
  reinitializeChat,
  setLoading,
} from "../store/slices/chatSlice";
import { RootState } from "../store/store";

interface Props {
  navigation: any;
}

const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const dispatch = useDispatch();
  const { messages, isLoading, sessionId } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Initialize chat session with welcome message
  useEffect(() => {
    if (!sessionId || messages.length === 0) {
      dispatch(reinitializeChat({ user }));
    }
  }, [dispatch, user, sessionId, messages.length]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Create unique ID for user message
    const userMessageId =
      "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    const userMessage = {
      id: userMessageId,
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    dispatch(addMessage(userMessage));
    setInputText("");
    dispatch(setLoading(true));

    try {
      const response = await geminiService.generateResponse(
        inputText.trim(),
        messages
      );

      // Create unique ID for bot message
      const botMessageId =
        "bot-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

      const botMessage = {
        id: botMessageId,
        text: response,
        isUser: false,
        timestamp: Date.now(),
      };

      dispatch(addMessage(botMessage));
    } catch (error: any) {
      Alert.alert("Error", "Failed to get AI response. Please try again.");
      console.error("Gemini API Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <MessageBubble message={item} />
  );

  const keyExtractor = (item: any) => item.id;

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="AIVAK AI Assistant"
          subtitle="Your Business Companion"
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action
          icon="account-circle"
          onPress={() => navigation.navigate("Profile")}
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          style={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          removeClippedSubviews={false}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about your business..."
            mode="outlined"
            style={styles.textInput}
            multiline
            maxLength={500}
            disabled={isLoading}
          />
          <IconButton
            icon="send"
            size={24}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              inputText.trim() && !isLoading ? styles.sendButtonActive : {},
            ]}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#1565C0",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingVertical: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-end",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
  sendButtonActive: {
    backgroundColor: "#1565C0",
  },
});

export default ChatScreen;
