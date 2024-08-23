import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import { LatLng } from "react-native-maps";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Weather, weatherMap, simpleWeathers } from "@/src/constants";
import { useLocation } from "@/src/hooks";
import { getWeather } from "@/src/apis";

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
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const fetchWeather = async (location: LatLng) => {
    setIsLoading(true);
    try {
      const response = await getWeather(location);
      const weather = response.weather[0].main as Weather;
      setSelected(weather);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to get weather data");
      setIsLoading(false);
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

  const handleSelect = async (key: Weather | "Current" | "Remove") => {
    if (key === "Current") {
      handleGetWeather();
    } else if (key === "Remove") {
      setSelected(undefined);
    } else {
      setSelected(key);
    }
  };

  return (
    <></>
    // <Menu
    //   placement="top"
    //   selectionMode="single"
    //   className="flex-row"
    //   // @ts-ignore - currentKey is not in the type definition
    //   onSelectionChange={({ currentKey }) => handleSelect(currentKey)}
    //   trigger={({ ...triggerProps }) => {
    //     return (
    //       <Button {...triggerProps} className="bg-current">
    //         {isLoading ? (
    //           <ButtonSpinner />
    //         ) : selected ? (
    //           <ButtonText size="lg">{weatherMap[selected]}</ButtonText>
    //         ) : (
    //           <MaterialCommunityIcons
    //             name="cloud-search"
    //             size={24}
    //             color={iconColor}
    //           />
    //         )}
    //       </Button>
    //     );
    //   }}
    // >
    //   <MenuItem key={"Current"} textValue={"Current"} className="min-w-0">
    //     <MaterialCommunityIcons
    //       name="crosshairs-gps"
    //       size={24}
    //       color={iconColor}
    //     />
    //   </MenuItem>
    //   {simpleWeathers.map((weather) => (
    //     <MenuItem key={weather} textValue={weather} className="min-w-0">
    //       <MenuItemLabel size="sm">{weatherMap[weather]}</MenuItemLabel>
    //     </MenuItem>
    //   ))}
    //   <MenuItem key={"Remove"} textValue={"Remove"} className="min-w-0">
    //     <MenuItemLabel size="sm">❌</MenuItemLabel>
    //   </MenuItem>
    // </Menu>
  );
}
