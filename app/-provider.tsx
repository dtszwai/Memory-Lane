import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "@/src/components/useColorScheme";
import { LogProvider, CacheProvider } from "@/src/context";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <LogProvider>
          <CacheProvider>{children}</CacheProvider>
        </LogProvider>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default Provider;
