import { MD3LightTheme, configureFonts } from "react-native-paper";

const businessColors = {
  primary: "#1565C0", // Professional blue
  secondary: "#FFC107", // Gold accent
  tertiary: "#4CAF50", // Success green
  surface: "#FFFFFF",
  background: "#F8F9FA",
  error: "#E53E3E",
  text: "#212121",
  textSecondary: "#666666",
};

// ✅ Correct font configuration with required properties
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
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bold: {
    fontFamily: "System",
    fontWeight: "700" as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
};

export const businessTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...businessColors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};
