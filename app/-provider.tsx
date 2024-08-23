import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Appearance, LogBox } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useColorScheme } from "@/src/components/useColorScheme";
import { LogProvider, CacheProvider } from "@/src/context";

LogBox.ignoreAllLogs();

const Provider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider
      theme={colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LogProvider>
          <CacheProvider>{children}</CacheProvider>
        </LogProvider>
      </ThemeProvider>
    </PaperProvider>
  );
};

export default Provider;
