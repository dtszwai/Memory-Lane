import { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Card, Paragraph, Chip, Text, MD3Colors } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";
import { Log, moodMap, weatherMap, Location } from "@/src/constants";
import { getAddress } from "@/src/apis";
import { getMapUrl } from "@/src/utils";
import { CacheContext } from "@/src/context";

export default function LogCard({ data }: { data: Log }) {
  const { state, setCache } = useContext(CacheContext);
  const [fullAddress, setFullAddress] = useState<string>();

  const fetchAddress = useCallback(
    async (location: Location) => {
      if (location.fullAddress) {
        return location.fullAddress;
      }
      const cacheKey = JSON.stringify(location);
      if (state.has(cacheKey)) {
        return state.get(cacheKey);
      }
      try {
        const response = await getAddress(location);
        const fullAddress = response.results[0].formatted_address;
        setCache(cacheKey, fullAddress);
        return fullAddress;
      } catch (error) {
        return "Address unavailable";
      }
    },
    [state],
  );

  useEffect(() => {
    data.location && fetchAddress(data.location).then(setFullAddress);
  }, [data.location, fetchAddress]);

  const MapLink = ({ location }: { location: Location }) => {
    const mapUrl = getMapUrl(location);
    return (
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={() => mapUrl && Linking.openURL(mapUrl)}>
        <Entypo name="location" color={MD3Colors.secondary50} />
        <Text style={{ color: MD3Colors.secondary50 }}>{fullAddress}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Title
          title={data.title}
          subtitle={data.date.toDateString()}
          titleStyle={styles.title}
          subtitleStyle={{ color: MD3Colors.secondary50 }}
        />
        {data.imageUri && (
          <Card.Cover
            source={{ uri: data.imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Card.Content>
          {data.content && (
            <Paragraph style={styles.content}>{data.content}</Paragraph>
          )}
          <View style={styles.chipContainer}>
            {data.weather && (
              <Chip style={styles.chip}>
                {weatherMap[data.weather]}&nbsp;{data.weather}
              </Chip>
            )}
            {data.mood && (
              <Chip style={styles.chip}>
                {moodMap[data.mood]}&nbsp;{data.mood}
              </Chip>
            )}
          </View>
          {data.location && <MapLink location={data.location} />}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  card: {
    margin: 10,
    paddingTop: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
  },
  image: {
    margin: 10,
    backgroundColor: "transparent",
  },
  content: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  chip: {
    marginRight: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
    paddingHorizontal: 7,
  },
});
