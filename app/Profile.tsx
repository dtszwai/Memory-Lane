import React, { useEffect, useState } from "react";
import { View, StyleSheet, Appearance, useColorScheme } from "react-native";
import {
  Button,
  Text,
  Switch,
  useTheme,
  IconButton,
  TextInput,
} from "react-native-paper";
import { auth } from "@/src/firebase";
import { signOut } from "firebase/auth";
import { router, useNavigation } from "expo-router";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === "dark");
  const [shareId, setShareId] = useState("");

  const toggleTheme = () => {
    Appearance.setColorScheme(isDarkMode ? "light" : "dark");
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Profile Settings",
      headerLeft: () => (
        <IconButton icon="arrow-left" onPress={() => router.back()} />
      ),
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const onTextInputChange = (text: string) => {
    setShareId(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        {auth.currentUser?.email}
      </Text>
      <View style={styles.settingItem}>
        <Text style={{ color: colors.primary }}>Enable Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          color={colors.primary}
        />
      </View>
      <View style={styles.settingItem}>
        <TextInput
          placeholder="Enter ID to view shared log"
          value={shareId}
          onChangeText={onTextInputChange}
          style={{ width: "80%" }}
          mode="outlined"
        />
        <IconButton
          icon="search-web"
          onPress={() => {
            router.push({ pathname: "/LogShare", params: { shareId } });
          }}
        />
      </View>
      <View style={styles.settingItem}>
        <Button
          mode="contained"
          onPress={() => router.push("/Spots")}
          style={styles.button}
          icon="map-marker-radius"
        >
          My Spots
        </Button>
      </View>
      <Button
        icon="logout"
        mode="contained"
        onPress={handleSignOut}
        style={styles.button}
      >
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    marginTop: 30,
  },
});

export default ProfileScreen;
