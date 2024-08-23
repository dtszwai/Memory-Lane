import { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Card, IconButton } from "react-native-paper";
import MapView, { LatLng, MapMarker } from "react-native-maps";

type MapLocatorProps = {
  isVisible: boolean;
  setVisible: (state: boolean) => void;
  initialLocation?: LatLng;
  onLocationSelect: (location: LatLng) => void;
};

const defaultLocation = {
  latitude: 49.28078,
  longitude: -123.11544,
};

export default function MapLocator({
  isVisible,
  setVisible,
  onLocationSelect,
  initialLocation,
}: MapLocatorProps) {
  const [location, setLocation] = useState<LatLng>(
    initialLocation || defaultLocation,
  );

  useEffect(() => {
    if (initialLocation) setLocation(initialLocation);
  }, [initialLocation]);

  const onSelection = () => {
    onLocationSelect(location);
    setVisible(false);
  };

  const renderAction = (icon: string, onPress: () => void) => (
    <IconButton icon={icon} onPress={onPress} />
  );

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <Card style={styles.card}>
          <Card.Title
            title="Select Location"
            left={() => renderAction("close", () => setVisible(false))}
            right={() => renderAction("check", onSelection)}
            titleStyle={styles.title}
            style={styles.titleContainer}
          />
          <Card.Content style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                ...location,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(event) => {
                setLocation(event.nativeEvent.coordinate);
              }}>
              <MapMarker
                coordinate={location}
                title="Selected Location"
                description="Drag to select the location"
                draggable
                onDragEnd={(event) => {
                  setLocation(event.nativeEvent.coordinate);
                }}
              />
            </MapView>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  card: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    height: "90%",
  },
  titleContainer: {
    paddingLeft: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  mapContainer: {
    minHeight: "100%",
    minWidth: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
