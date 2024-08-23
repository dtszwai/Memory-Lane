import { Weather } from "../constants";
import { fetchRequest } from "./configs";

type WeatherParams = {
  latitude: number;
  longitude: number;
  units?: "standard" | "metric" | "imperial";
  lang?: string;
};

type WeatherApiResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: Weather;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

/**
 * Get weather data from OpenWeatherAPI, default current weather
 * https://openweathermap.org/api/one-call-api
 */
export const getWeather = async (params: WeatherParams) => {
  const api = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeatherAPI key is missing");
  }
  const { latitude, longitude, units = "metric", lang = "en" } = params;
  const url = `${api}?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${apiKey}`;

  return fetchRequest<WeatherApiResponse>(url);
};
