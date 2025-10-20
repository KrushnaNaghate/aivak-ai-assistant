module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      // Existing Expo config properties
      name: "AIVAK - AI Business Assistant",
      slug: "aivak-ai-assistant",
      version: "1.0.0",
      orientation: "portrait",
      scheme: "aivak",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#1565C0",
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.aivak.chatbot",
        hermesEnabled: true,
      },
      android: {
        hermesEnabled: true,
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#1565C0",
        },
        package: "com.aivak.chatbot",
        intentFilters: [
          {
            action: "VIEW",
            data: {
              scheme: "aivak",
              host: "auth",
            },
            category: ["BROWSABLE", "DEFAULT"],
          },
        ],
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      plugins: ["expo-secure-store", "expo-web-browser"],

      // CRITICAL: Injecting EAS Secrets into the 'extra' field
      extra: {
        eas: {
          projectId: "92fad1f4-e778-4190-99ee-51096bee3f25",
        },
        // The values are read from the environment variables set by EAS Secrets
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        GEMINI_API_URL: process.env.GEMINI_API_URL,
        WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
        ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      },
    },
  };
};
