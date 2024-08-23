import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { LatLng } from "react-native-maps";
import { Weather, weatherMap, simpleWeathers } from "@/src/constants";
import { useLocation, useMenu } from "@/src/hooks";
import { getWeather } from "@/src/apis";
import { IconButton, Menu, Text } from "react-native-paper";

type WeatherInputProps = {
  weather?: Weather;
  location?: LatLng;
  onChange: (weather?: Weather) => void;
};

export default function WeatherInput({
  weather,
  onChange,
  location,
}: WeatherInputProps) {
  const [selected, setSelected] = useState<Weather | undefined>(weather);
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentLocation } = useLocation();
  const { isMenuOpen, closeMenu, openMenu } = useMenu();

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const fetchWeather = async (location: LatLng) => {
    setIsLoading(true);
    try {
      const response = await getWeather(location);
      const weather = response.weather[0].main as Weather;
      setSelected(weather);
    } catch (error) {
      Alert.alert("Error", "Failed to get weather data");
    } finally {
      setIsLoading(false);
      closeMenu();
    }
  };

  const handleGetWeather = async () => {
    setIsLoading(true);
    if (!location) {
      const _location = await getCurrentLocation();
      if (!_location) {
        Alert.alert("Error", "Location not available");
        setIsLoading(false);
        return;
      }
      location = _location;
    }
    fetchWeather(location);
  };

  const handleSelect = async (
    key: (typeof simpleWeathers)[number] | "Current" | "Remove",
  ) => {
    switch (key) {
      case "Current":
        handleGetWeather();
        break;
      case "Remove":
        setSelected(undefined);
        break;
      default:
        if (simpleWeathers.includes(key)) {
          setSelected(key);
        } else {
          Alert.alert("Error", "Invalid Weather selected");
        }
    }
    closeMenu();
  };

  return (
    <Menu
      visible={isMenuOpen}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon={
            selected
              ? () => (
                  <Text style={{ fontSize: 24 }}>{weatherMap[selected]}</Text>
                )
              : "cloud-search"
          }
          onPress={openMenu}
          loading={isLoading}
        />
      }
      anchorPosition="top"
      contentStyle={{ flexDirection: "row" }}
    >
      <Menu.Item
        onPress={() => handleSelect("Current")}
        title="📍"
        style={styles.menuItem}
        contentStyle={styles.menuItem}
      />
      {simpleWeathers.map((weather) => (
        <Menu.Item
          key={weather}
          onPress={() => handleSelect(weather)}
          title={weatherMap[weather]}
          style={styles.menuItem}
          contentStyle={styles.menuItem}
        />
      ))}
      <Menu.Item
        onPress={() => handleSelect("Remove")}
        title="❌"
        style={styles.menuItem}
        contentStyle={styles.menuItem}
      />
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    alignItems: "center",
    maxWidth: 30,
    minWidth: 30,
    height: 30,
    paddingHorizontal: 0,
  },
});
