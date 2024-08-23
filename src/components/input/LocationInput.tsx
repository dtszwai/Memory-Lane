import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocation } from "@/src/hooks";
import { Log } from "@/src/constants";
import MapLocator from "./MapLocator";

type LocationInputProps = {
  initialLocation?: Log["location"];
  onChange: (location?: Log["location"]) => void;
};

export default function LocationInput({
  initialLocation,
  onChange,
}: LocationInputProps) {
  const { location, errorMsg, isLoading, getCurrentLocation, setLocation } =
    useLocation(initialLocation);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  useEffect(() => {
    onChange(location);
  }, [location, onChange]);

  useEffect(() => {
    errorMsg && Alert.alert("Error", errorMsg);
  }, [errorMsg]);

  const handleSelect = async (key: string) => {
    switch (key) {
      case "Current":
        await getCurrentLocation();
        break;
      case "Manual":
        setIsModalVisible(true);
        break;
      case "Remove":
        setLocation(undefined);
        break;
      default:
        Alert.alert("Error", "Invalid menu option selected");
    }
  };

  return (
    <>
      {/* <Menu
        placement="top"
        selectionMode="single"
        className="flex-row"
        // @ts-ignore
        onSelectionChange={({ currentKey }) => handleSelect(currentKey)}
        trigger={({ ...triggerProps }) => {
          return (
            <Button {...triggerProps} className="bg-current">
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <MaterialCommunityIcons
                  name={location ? "map-check" : "map-plus"}
                  size={24}
                  color={iconColor}
                />
              )}
            </Button>
          );
        }}
      >
        <MenuItem key={"Current"} textValue={"Current"} className="min-w-0">
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={24}
            color={iconColor}
          />
        </MenuItem>
        <MenuItem key={"Manual"} textValue={"Manual"} className="min-w-0">
          <MaterialCommunityIcons
            name="map-search"
            size={24}
            color={iconColor}
          />
        </MenuItem>
        <MenuItem key={"Remove"} textValue={"Remove"} className="min-w-0">
          <MenuItemLabel size="sm">❌</MenuItemLabel>
        </MenuItem>
      </Menu> */}
      {isModalVisible && (
        <MapLocator
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
          initialLocation={location}
          onLocationSelect={setLocation}
        />
      )}
    </>
  );
}
