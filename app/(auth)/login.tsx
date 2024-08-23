import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Modal,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase";

type LoginFormFields = { email: string; password: string };

const loginSchema: z.ZodType<LoginFormFields> = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginScreen = () => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async (data: LoginFormFields) => {
    setIsLoading(true);
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const errorCode = error?.code;
      switch (errorCode) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          alert("Incorrect email or password");
          break;
        default:
          alert("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            error={!!errors.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errors.email.message}
        </Text>
      )}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry={!passwordVisibility}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            error={!!errors.password}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            right={
              <TextInput.Icon
                icon={passwordVisibility ? "eye-off" : "eye"}
                onPressIn={() => setPasswordVisibility(true)}
                onPressOut={() => setPasswordVisibility(false)}
              />
            }
          />
        )}
      />
      {errors.password && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errors.password.message}
        </Text>
      )}
      <Button
        mode="contained"
        onPress={handleSubmit(onLogin)}
        style={styles.button}
      >
        Login
      </Button>
      <TouchableOpacity onPress={() => router.replace("/signup")}>
        <Text style={[styles.switchText, { color: colors.tertiary }]}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
      <Modal visible={isLoading} dismissable={false}>
        <ActivityIndicator animating={isLoading} size="large" />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  switchText: {
    marginTop: 20,
    fontWeight: "600",
  },
});

export default LoginScreen;
