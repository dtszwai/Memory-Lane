import { IconButton, MD3Colors } from "react-native-paper";
import { getNarrative } from "@/src/apis/OpenAI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";
import { useImage } from "@/src/hooks";
import { useState } from "react";

interface NarrativeInputProps {
  imageUrl: string;
  onChange: (text: string) => void;
  location?: string;
  date: Date;
}

export default function NarrativeInput({
  imageUrl,
  onChange,
  location,
  date,
}: NarrativeInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getBase64 } = useImage();

  const generateNarrative = async () => {
    let image = imageUrl.startsWith("file://")
      ? await getBase64(imageUrl)
      : imageUrl;

    const data = { location, date, imageUrl: image };

    try {
      setIsLoading(true);
      const response = await getNarrative(data);
      onChange(response);
    } catch (error) {
      Alert.alert("Error", "Failed to generate narrative");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IconButton
      icon={() => <Ionicons name="sparkles" size={20} />}
      containerColor={MD3Colors.tertiary99}
      onPress={generateNarrative}
      loading={isLoading}
    />
  );
}
