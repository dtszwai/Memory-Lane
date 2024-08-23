import { router, Stack } from "expo-router";
import { IconButton } from "react-native-paper";

export default function LogsLayout() {
  return (
    <Stack>
      <Stack.Screen name="LogDetail" />
      <Stack.Screen name="LogForm" />
      <Stack.Screen name="LogShare" options={{ title: "Loading..." }} />
      <Stack.Screen
        name="LogPreview"
        options={{
          title: "Preview",
          presentation: "modal",
          headerLeft: () => (
            <IconButton icon="close" onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
}
