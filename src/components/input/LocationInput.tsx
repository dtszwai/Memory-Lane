import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { useLocation, useMenu } from "@/src/hooks";
import { Log } from "@/src/constants";
import MapLocator from "./MapLocator";
import { IconButton, Menu } from "react-native-paper";

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
  const { isMenuOpen, closeMenu, openMenu } = useMenu();

  useEffect(() => {
    onChange(location);
  }, [location, onChange]);

  useEffect(() => {
    errorMsg && Alert.alert("Error", errorMsg);
  }, [errorMsg]);

  const handleSelect = async (key: "Current" | "Manual" | "Remove") => {
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
    closeMenu();
  };

  return (
    <>
      <Menu
        visible={isMenuOpen}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={location ? "map-check" : "map-plus"}
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
        <Menu.Item
          onPress={() => handleSelect("Manual")}
          title="🗺️"
          style={styles.menuItem}
          contentStyle={styles.menuItem}
        />
        <Menu.Item
          onPress={() => handleSelect("Remove")}
          title="❌"
          style={styles.menuItem}
          contentStyle={styles.menuItem}
        />
      </Menu>
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

const styles = StyleSheet.create({
  menuItem: {
    alignItems: "center",
    maxWidth: 30,
    minWidth: 30,
    height: 30,
    paddingHorizontal: 0,
  },
});
