import { useCallback, useContext, useState } from "react";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";
import { getAddress } from "@/src/apis";
import { CacheContext } from "@/src/context";
import { Location as LocationType } from "@/src/constants";

const useLocation = (initialLocation?: LocationType) => {
  const [location, setLocation] = useState<LocationType | undefined>(
    initialLocation,
  );
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state, setCache } = useContext(CacheContext);

  const updateLocation = async (newLocation?: LatLng) => {
    setErrorMsg(undefined);
    setIsLoading(true);
    if (!newLocation) {
      setLocation(undefined);
      setIsLoading(false);
      return;
    }
    const { latitude, longitude } = newLocation;
    const fullAddress = await getFullAddress({ latitude, longitude });
    setLocation({ latitude, longitude, fullAddress });
    setIsLoading(false);
  };

  const getFullAddress = useCallback(
    async (location: LatLng) => {
      setIsLoading(true);
      const cacheKey = JSON.stringify(location);
      if (state.has(cacheKey)) {
        setIsLoading(false);
        return state.get(cacheKey) as string;
      }
      try {
        const response = await getAddress(location);
        const fullAddress = response.results[0].formatted_address;
        setCache(cacheKey, fullAddress);
        return fullAddress;
      } catch (error) {
        setErrorMsg("Failed to fetch address");
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [state, setCache],
  );

  const verifyPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    return status === "granted";
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      await updateLocation(coords);
      return coords;
    } catch (err) {
      setErrorMsg("Failed to fetch location");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    errorMsg,
    isLoading,
    getCurrentLocation,
    setLocation: updateLocation,
  };
};

export default useLocation;
