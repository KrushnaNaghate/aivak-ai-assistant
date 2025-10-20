import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { Avatar, Card, Text } from "react-native-paper";
import TypewriterText from "./TypewriterText";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface Props {
  message: Message;
  showTypewriter?: boolean;
}

const MessageBubble: React.FC<Props> = ({
  message,
  showTypewriter = false,
}) => {
  const isUser = message.isUser;
  const [showFullText, setShowFullText] = useState(false);

  const markdownStyles = {
    body: {
      color: isUser ? "#FFFFFF" : "#1F1F1F",
      fontSize: 15,
      lineHeight: 22,
    },
    strong: {
      color: isUser ? "#FFFFFF" : "#00D9FF",
      fontWeight: "bold",
    },
    em: {
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
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      {!isUser && (
        <Avatar.Icon
          size={36}
          icon="robot"
          style={styles.avatar}
          color="#00D9FF"
        />
      )}

      <Card
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Card.Content style={styles.content}>
          {isUser ? (
            <Text style={styles.userText}>{message.text}</Text>
          ) : showTypewriter && !showFullText ? (
            <TypewriterText
              text={message.text}
              speed={20}
              style={{ color: "#1F1F1F", fontSize: 15 }}
              onComplete={() => setShowFullText(true)}
            />
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

      {isUser && (
        <Avatar.Icon
          size={36}
          icon="account"
          style={styles.avatar}
          color="#00D9FF"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 6,
    // paddingHorizontal: 8,
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
    backgroundColor: "#1E2337",
  },
  bubble: {
    maxWidth: "75%",
    minWidth: "20%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: "#00D9FF",
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userText: {
    color: "#1F1F1F",
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: "#1F1F1F",
  },
  botTimestamp: {
    color: "#666",
  },
});

export default MessageBubble;
