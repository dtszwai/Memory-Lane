import { useContext, useEffect, useMemo } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LogContext } from "@/src/context";
import { router, useNavigation } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

const SpotsScreen = () => {
  const { state } = useContext(LogContext);
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "My Spots",
      headerLeft: () => (
        <IconButton icon="arrow-left" onPress={() => router.back()} />
      ),
    });
  }, []);

  const markers = useMemo(() => {
    return Array.from(state.values()).map(
      (item) =>
        item.data.location && (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.data.location.latitude,
              longitude: item.data.location.longitude,
            }}
            title={item.data.title}
            onPress={() =>
              router.push({ pathname: "/LogDetail", params: { id: item.id } })
            }
            description={item.data.date.toDateString()}
            pinColor={colors.primary}
          />
        ),
    );
  }, [state]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <MapView style={styles.map}>{markers}</MapView>
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
