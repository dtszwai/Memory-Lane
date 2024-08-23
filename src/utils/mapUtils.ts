import { Platform } from "react-native";

type Location = {
  latitude: number;
  longitude: number;
};

export const getMapUrl = (location: Location) => {
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  return `${scheme}${location.latitude},${location.longitude}`;
};
