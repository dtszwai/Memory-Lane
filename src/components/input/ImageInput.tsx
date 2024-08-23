import { useColorScheme } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useImage } from "@/src/hooks";

type ImageInputProps = { onChange: (imageUri: string) => void };

export default function ImageInput({ onChange }: ImageInputProps) {
  const { selectImage } = useImage();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  const handleImage = async () => {
    const image = await selectImage();
    if (image) {
      onChange(image.uri);
    }
  };

  return (
    <></>
    // <Button
    //   className="bg-current"
    //   onPress={handleImage}
    //   accessibilityLabel="Select an image"
    //   accessibilityRole="button">
    //   <FontAwesome5 name="image" size={24} color={iconColor} />
    // </Button>
  );
}
