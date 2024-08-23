import React from "react";
import { useColorScheme } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useImage } from "@/src/hooks";

type CameraInputProps = {
  onChange: (imageUri: string) => void;
};

export default function CameraInput({ onChange }: CameraInputProps) {
  const { takeImage } = useImage();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  const handleCamera = async () => {
    const image = await takeImage();
    if (image) {
      onChange(image.uri);
    }
  };

  return (
    <></>
    // <Button className="bg-current" onPress={handleCamera}>
    //   <FontAwesome5 name="camera" size={24} color={iconColor} />
    // </Button>
  );
}
