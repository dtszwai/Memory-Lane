import { useContext } from "react";
import { Platform, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Log } from "@/src/constants";
import { CacheContext } from "@/src/context";
import { LogCard } from "../../src/components/log";

export default function LogPreviewScreen() {
  const { cacheKey } = useLocalSearchParams<{ cacheKey: string }>();
  const { state } = useContext(CacheContext);
  const data = state.get(cacheKey) as Log;
  if (!data) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LogCard data={data} />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
});
