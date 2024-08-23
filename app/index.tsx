import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/setup";
import { LogContext } from "@/src/context";
import { Entypo } from "@expo/vector-icons";

export default function App() {
  const { getLogs } = useContext(LogContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await getLogs();
          router.replace("/Main");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Surface style={styles.overlay}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome
        </Text>
        <Entypo name="rocket" size={40} />
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your journey starts here...
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
  },
});
