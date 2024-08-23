export const weathers = [
  "Thunderstorm",
  "Drizzle",
  "Rain",
  "Snow",
  "Clear",
  "Clouds",
  "Mist",
  "Smoke",
  "Haze",
  "Dust",
  "Fog",
  "Sand",
  "Ash",
  "Squall",
  "Tornado",
] as const;

// used for manual weather selection
export const simpleWeathers = [
  "Thunderstorm",
  "Drizzle",
  "Rain",
  "Snow",
  "Clear",
  "Clouds",
  "Mist",
] as const;

export type Weather = (typeof weathers)[number];

export const weatherMap: Record<Weather, string> = {
  Clear: "☀️",
  Rain: "🌧",
  Clouds: "☁️",
  Snow: "❄️",
  Drizzle: "🌦",
  Thunderstorm: "⛈",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "🌪️",
  Fog: "🌫️",
  Sand: "🌪️",
  Ash: "🌋",
  Squall: "🌪️",
  Tornado: "🌪️",
};
