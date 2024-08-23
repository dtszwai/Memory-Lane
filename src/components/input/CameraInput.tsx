import { IconButton } from "react-native-paper";
import { useImage } from "@/src/hooks";

type CameraInputProps = {
  onChange: (imageUri: string) => void;
};

export default function CameraInput({ onChange }: CameraInputProps) {
  const { takeImage } = useImage();

  const handleCamera = async () => {
    const image = await takeImage();
    if (image) {
      onChange(image.uri);
    }
  };

  return <IconButton icon="camera" onPress={handleCamera} />;
}
