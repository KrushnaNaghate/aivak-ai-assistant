import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";
import { businessTheme } from "./src/theme/businessTheme";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={businessTheme}>
        <View style={styles.container}>
          <AppNavigator />
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
