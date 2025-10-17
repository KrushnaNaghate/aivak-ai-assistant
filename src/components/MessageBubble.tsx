import React from "react";
import { StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
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

  // ✅ Markdown styles for AI responses
  const markdownStyles = {
    body: {
      color: isUser ? "white" : "#333",
      fontSize: 16,
      lineHeight: 20,
    },
    strong: {
      color: isUser ? "white" : "#1565C0",
      fontWeight: "bold",
    },
    em: {
      color: isUser ? "white" : "#333",
      fontStyle: "italic",
    },
    paragraph: {
      marginVertical: 2,
    },
    bullet_list: {
      marginVertical: 4,
    },
    ordered_list: {
      marginVertical: 4,
    },
    list_item: {
      marginVertical: 1,
    },
  };

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
          {/* ✅ Use Markdown for AI responses, plain text for user */}
          {isUser ? (
            <Text style={[styles.text, styles.userText]}>{message.text}</Text>
          ) : (
            <Markdown style={markdownStyles}>{message.text}</Markdown>
          )}

          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.botTimestamp,
            ]}
          >
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
    maxWidth: "75%",
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
  userTimestamp: {
    color: "white",
  },
  botTimestamp: {
    color: "#666",
  },
});

export default MessageBubble;
