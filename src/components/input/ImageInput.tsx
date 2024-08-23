import { IconButton } from "react-native-paper";
import { useImage } from "@/src/hooks";

type ImageInputProps = { onChange: (imageUri: string) => void };

export default function ImageInput({ onChange }: ImageInputProps) {
  const { selectImage } = useImage();

  const handleImage = async () => {
    const image = await selectImage();
    if (image) {
      onChange(image.uri);
    }
  };

  return <IconButton icon="image" onPress={handleImage} />;
}
