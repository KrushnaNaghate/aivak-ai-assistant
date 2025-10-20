import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface SessionContext {
  userPreferences?: any;
  businessContext?: any;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string;
  error: string | null;
  sessionContext: SessionContext;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  sessionId: "",
  error: null,
  sessionContext: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      // Check if message with same ID already exists to prevent duplicates
      const existingMessage = state.messages.find(
        (msg) => msg.id === action.payload.id
      );
      if (!existingMessage) {
        state.messages.push(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.sessionId = Date.now().toString();
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    initSession: (state) => {
      if (!state.sessionId) {
        state.sessionId = Date.now().toString();
      }
    },
    setSessionContext: (
      state,
      action: PayloadAction<{
        userPreferences?: any;
        businessContext?: any;
      }>
    ) => {
      state.sessionContext = action.payload;
    },
    clearContextButKeepMessages: (state) => {
      // Keep messages but reset context for new topic
      state.messages = state.messages.map((msg) => ({ ...msg }));
    },
    resetChat: (state) => {
      return initialState;
    },
    reinitializeChat: (state, action: PayloadAction<{ user?: any }>) => {
      state.messages = [];
      state.sessionId = Date.now().toString();
      state.sessionContext = {};

      // welcome message
      const welcomeMessage = {
        id: "welcome-message-" + Date.now(),
        text: `Hello ${
          action.payload.user?.displayName || "there"
        }! 👋 I'm your AI business assistant. I can help you with:\n\n• Invoice management\n• Business planning\n• Market analysis\n• General business questions\n\nHow can I assist you today?`,
        isUser: false,
        timestamp: Date.now(),
      };
      state.messages.push(welcomeMessage);
    },
  },
});

export const {
  addMessage,
  setLoading,
  clearMessages,
  setError,
  initSession,
  setSessionContext,
  clearContextButKeepMessages,
  resetChat,
  reinitializeChat,
} = chatSlice.actions;

export default chatSlice.reducer;
