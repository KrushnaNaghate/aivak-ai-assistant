import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";
import { neumorphicTheme } from "./src/theme/businessTheme";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider theme={neumorphicTheme}>
          <SafeAreaProvider style={styles.container}>
            <AppNavigator />
            <StatusBar
              style="light"
              backgroundColor="transparent"
              translucent
            />
          </SafeAreaProvider>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
});
