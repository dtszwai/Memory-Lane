import { useContext, useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import { LogContext } from "@/src/context";
import { router, useNavigation } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

const SpotsScreen = () => {
  const { state } = useContext(LogContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [markers, setMarkers] = useState<LatLng[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: "My Spots",
      headerLeft: () => (
        <IconButton icon="arrow-left" onPress={() => router.back()} />
      ),
    });

    const locations = Array.from(state.values())
      .map((item) => item.data.location)
      .filter((location) => location !== undefined);

    if (locations.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(locations, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
    setMarkers(locations);
  }, [state]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <MapView ref={mapRef} style={styles.map}>
        {markers.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Marker ${index + 1}`}
            pinColor={colors.primary}
            onPress={() =>
              router.push({ pathname: "/LogDetail", params: { id: index } })
            }
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SpotsScreen;
