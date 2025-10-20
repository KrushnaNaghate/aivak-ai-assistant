import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry, // paasowrd
  keyboardType,
  autoCapitalize,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  const isPasswordField = secureTextEntry === true;

  const effectiveSecureTextEntry = isPasswordField
    ? !showPassword
    : secureTextEntry;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute",
    left: 16,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ["#8B93A7", "#00D9FF"],
    }),
    backgroundColor: "#1E2337",
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>

      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={effectiveSecureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            isPasswordField && styles.inputWithIcon,
          ]}
          placeholderTextColor="#8B93A7"
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeIconContainer}
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#8B93A7"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  inputWrapper: {
    justifyContent: "center",
  },
  input: {
    height: 56,
    backgroundColor: "#1E2337",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#FFF",
    borderWidth: 1.5,
    borderColor: "#2A3048",
  },
  inputFocused: {
    borderColor: "#00D9FF",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  inputWithIcon: {
    paddingRight: 50,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 16,
    padding: 8, // Increase touch area
  },
});

export default FloatingLabelInput;
