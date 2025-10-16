import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface Props {
  message: Message;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.isUser;

  return (
    <View
      key={message.id}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      {!isUser && <Avatar.Icon size={32} icon="robot" style={styles.avatar} />}

      <Card
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Card.Content style={styles.content}>
          <Text
            style={[styles.text, isUser ? styles.userText : styles.botText]}
          >
            {message.text}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Card.Content>
      </Card>

      {isUser && <Avatar.Icon size={32} icon="account" style={styles.avatar} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: "flex-end",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  botContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    marginHorizontal: 8,
  },
  bubble: {
    maxWidth: "70%",
    minWidth: "20%",
  },
  userBubble: {
    backgroundColor: "#1565C0",
  },
  botBubble: {
    backgroundColor: "#f5f5f5",
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: "white",
  },
  botText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
});

export default MessageBubble;
