import { MD3DarkTheme, configureFonts } from "react-native-paper";

// Neumorphic color palette - Dark futuristic
const neumorphicColors = {
  primary: "#00D9FF", // Cyan glow
  secondary: "#7B61FF", // Purple accent
  tertiary: "#00FF9F", // Success green
  surface: "#1A1F3A",
  background: "#0F1419",
  card: "#1E2337",
  error: "#FF6B6B",
  text: "#FFFFFF",
  textSecondary: "#8B93A7",
  border: "#2A3048",
  shadow: "#000000",
  highlight: "rgba(255, 255, 255, 0.05)",
};

const fontConfig = {
  regular: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  medium: {
    fontFamily: "System",
    fontWeight: "500" as const,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  bold: {
    fontFamily: "System",
    fontWeight: "700" as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
};

export const neumorphicTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...neumorphicColors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 20,
};

// Neumorphic shadow styles
export const neumorphicShadow = {
  lightShadow: {
    shadowColor: "rgba(255, 255, 255, 0.1)",
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  darkShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
