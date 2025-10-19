import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Avatar, Text, useTheme } from "react-native-paper";
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

const ChatScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const windowHeight = Dimensions.get("window").height;

  // Init session
  useEffect(() => {
    if (messages.length === 0) {
      dispatch(reinitializeChat({ user }));
    }
  }, [dispatch]);

  // Handle send
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: Date.now(),
    };
    dispatch(addMessage(userMessage));
    setInput("");
    dispatch(setLoading(true));
    try {
      const reply = await geminiService.generateResponse(input, messages);
      const botMessage = {
        id: Date.now() + 1 + "",
        text: reply,
        isUser: false,
        timestamp: Date.now(),
      };
      dispatch(addMessage(botMessage));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderItem = ({ item }: any) => <MessageBubble message={item} />;

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1500&q=80",
      }}
      style={[styles.bg, { height: windowHeight }]}
      imageStyle={{ opacity: 0.1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.appHeader}>
          <View style={styles.headerLeft}>
            <Avatar.Image
              size={42}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
              }}
            />
            <View style={styles.headerText}>
              <Text variant="titleMedium" style={styles.headerTitle}>
                AIVAK
              </Text>
              <Text style={styles.subHeader}>Powered by Gemini AI</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          contentContainerStyle={styles.listContent}
        />

        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#00b8f4" />
            <Text style={styles.thinkingText}>AI thinking...</Text>
          </View>
        )}

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.inputBar}>
            <TextInput
              placeholder="Ask AIVAK anything..."
              value={input}
              onChangeText={setInput}
              style={styles.textBox}
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
              style={[styles.sendButton, { opacity: input.trim() ? 1 : 0.5 }]}
            >
              <MaterialCommunityIcons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    backgroundColor: "#0a0f24",
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: "rgba(20,25,55,0.9)",
    borderBottomWidth: 0.6,
    borderColor: "#294fb3",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 10,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  subHeader: {
    fontSize: 11,
    color: "#73b1ff",
  },
  profileButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  loaderContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  thinkingText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderTopWidth: 0.5,
    borderColor: "#294fb3",
    marginHorizontal: 10,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  textBox: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 4,
    maxHeight: 110,
  },
  sendButton: {
    backgroundColor: "#00b8f4",
    borderRadius: 24,
    padding: 8,
    marginLeft: 8,
  },
});

export default ChatScreen;
