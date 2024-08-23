import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { auth } from "@/src/firebase";
import { CloudStorage } from "@/src/storage";

const useImage = () => {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const verifyPermissions = async () => {
    if (status?.granted) return true;
    const { granted } = await requestPermission();
    return granted;
  };

  const processImagePickerResult = async (
    result: ImagePicker.ImagePickerResult,
  ) => {
    if (!result.canceled && result.assets) {
      setImage(result.assets[0]);
      return result.assets[0];
    }
  };

  const takeImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      setErrorMsg("Permission to access camera was denied");
      return;
    }
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      return processImagePickerResult(result);
    } catch (err) {
      setErrorMsg("Failed to take image");
    } finally {
      setIsLoading(false);
    }
  };

  const selectImage = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      return processImagePickerResult(result);
    } catch (err) {
      setErrorMsg("Failed to select image");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (!auth.currentUser) {
      setErrorMsg("Authentication required");
      return;
    }
    setIsLoading(true);
    try {
      return await CloudStorage.uploadImage(imageUri);
    } catch (error) {
      setErrorMsg("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  return { takeImage, selectImage, uploadImage, image, errorMsg, isLoading };
};

export default useImage;
