import React, { useState } from "react";
import { Alert, View, StyleSheet, TouchableOpacity } from "react-native";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase";

type SignupFormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

const signupSchema: z.ZodType<SignupFormFields> = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
  });

const SignupScreen = () => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormFields>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSignup = async (data: SignupFormFields) => {
    setIsLoading(true);
    const { email, password } = data;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "User created successfully");
    } catch (error: any) {
      const errorCode = error?.code;
      switch (errorCode) {
        case "auth/email-already-in-use":
          Alert.alert("Error", "This email is already in use");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Invalid email");
          break;
        case "auth/weak-password":
          Alert.alert("Error", "Password is too weak");
          break;
        default:
          Alert.alert("Error", "An unexpected error occurred");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Sign Up</Text>
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
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry={!confirmPasswordVisibility}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            error={!!errors.confirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            right={
              <TextInput.Icon
                icon={confirmPasswordVisibility ? "eye-off" : "eye"}
                onPressIn={() => setConfirmPasswordVisibility(true)}
                onPressOut={() => setConfirmPasswordVisibility(false)}
              />
            }
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errors.confirmPassword.message}
        </Text>
      )}
      <Button
        mode="contained"
        onPress={handleSubmit(onSignup)}
        style={styles.button}
      >
        Sign Up
      </Button>
      <TouchableOpacity onPress={() => router.navigate("/login")}>
        <Text style={[styles.switchText, { color: colors.tertiary }]}>
          Already have an account? Log in
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

export default SignupScreen;
