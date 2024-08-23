import { fetchRequest } from "./configs";

/**
 * Get address from Google Geocoding API
 * https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding
 */
export const getAddress = async (params: {
  latitude: number;
  longitude: number;
}) => {
  const api = "https://maps.googleapis.com/maps/api/geocode/json";
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEOCODE_API_KEY;
  if (!apiKey) {
    throw new Error(" Google Geocode API key is missing");
  }
  const { latitude, longitude } = params;
  const url = `${api}?latlng=${latitude},${longitude}&key=${apiKey}`;
  return fetchRequest<google.maps.GeocoderResponse>(url);
};
