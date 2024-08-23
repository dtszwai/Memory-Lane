import { router, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, IconButton, Text, Title, useTheme } from "react-native-paper";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Not Found",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }}
      />
      <View style={styles.container}>
        <Title>Oops!</Title>
        <Text style={[styles.text, { color: colors.primary }]}>
          We can't find what you're looking for.
        </Text>
        <Button
          icon="home"
          mode="contained"
          onPress={() => router.replace("/")}
          style={styles.button}
          buttonColor={colors.primary}
        >
          Go to Home
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
