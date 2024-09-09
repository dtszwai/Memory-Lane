import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput as RNTextInput,
  Platform,
} from "react-native";
import {
  HelperText,
  IconButton,
  TextInput,
  Divider,
  Modal,
  ActivityIndicator,
  MD3Colors,
} from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { Log, LogLocal, weathers, moods } from "@/src/constants";
import { CacheContext, LogContext } from "@/src/context";
import * as Button from "@/src/components/input";
import _ from "lodash";
import { removeNilValues } from "@/src/utils";

const formSchema: z.ZodType<Log> = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  date: z.date(),
  mood: z.enum(moods).optional(),
  imageUri: z.string().optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      fullAddress: z.string().optional(),
    })
    .optional(),
  weather: z.enum(weathers).optional(),
});

type CreateLogFormProps = { initialData?: LogLocal };

export default function CreateLogForm({ initialData }: CreateLogFormProps) {
  const navigation = useNavigation();
  const { addLog, updateLog } = useContext(LogContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contentInputRef = useRef<RNTextInput>(null);
  const { setCache } = useContext(CacheContext);
  const [defaultValues] = useState<Log>(
    initialData?.data ?? {
      title: "",
      content: "",
      date: new Date(),
    },
  );

  const { control, handleSubmit, watch, reset, resetField, setValue } =
    useForm<Log>({
      resolver: zodResolver(formSchema),
      defaultValues,
    });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Controller
          control={control}
          name={"date"}
          render={({ field: { value, onChange } }) => (
            <Button.DateInput value={value} onChange={onChange} />
          )}
        />
      ),
      headerTitleAlign: "center",
      headerLeft: () => <IconButton icon="close" onPress={handleCancel} />,
      headerBackVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="eye"
            onPress={() => {
              const cacheKey = "logPreview";
              setCache(cacheKey, watch());
              router.push({ pathname: "/LogPreview", params: { cacheKey } });
            }}
          />
          <IconButton icon="check" onPress={handleSubmit(onSave)} />
        </View>
      ),
    });
  }, [handleSubmit]);

  const handleRemoveImage = () =>
    Alert.alert("Remove Image", "Are you sure to remove the image?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => resetField("imageUri"),
      },
    ]);

  const handleCancel = () => {
    if (_.isEqual(removeNilValues(watch()), removeNilValues(defaultValues))) {
      reset();
      router.back();
      return;
    }
    Alert.alert(
      "Unsaved changes",
      "Are you sure you want to leave this screen?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            reset();
            router.back();
            return;
          },
        },
      ],
    );
  };

  const handleSave = async (data: Log) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateLog({ ...initialData, data });
        navigation.goBack();
      } else {
        await addLog(data);
        router.replace("/Main");
      }
      reset();
    } catch (error) {
      Alert.alert("Failed to save log", "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async (data: Log) => {
    if (initialData) {
      Alert.alert("Important", "Are you sure you want to save these changes?", [
        { text: "No", onPress: () => setIsLoading(false) },
        { text: "Yes", onPress: async () => await handleSave(data) },
      ]);
    } else {
      await handleSave(data);
    }
  };

  const concatContent = (text: string) => {
    const currentValue = watch("content");

    if (currentValue) {
      text = "\n\n" + text;
    }
    setValue("content", currentValue + text);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name={"title"}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <TextInput
                    placeholder="Title"
                    value={value}
                    onChangeText={onChange}
                    error={!!error?.message}
                    autoCapitalize="none"
                    autoComplete="off"
                    returnKeyType="next"
                    onSubmitEditing={() => contentInputRef.current?.focus()}
                  />
                  {error?.message && (
                    <HelperText
                      type="error"
                      style={{ position: "absolute", right: 0, bottom: 10 }}
                    >
                      {error.message}
                    </HelperText>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name={"content"}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  ref={contentInputRef}
                  label="Content"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  style={{ flex: 1 }}
                  autoCapitalize="none"
                  autoComplete="off"
                />
              )}
            />
            <Controller
              control={control}
              name={"location"}
              render={({ field: { value } }) =>
                value?.fullAddress ? (
                  <View>
                    <HelperText type="info">{value.fullAddress}</HelperText>
                    <Divider />
                  </View>
                ) : (
                  <></>
                )
              }
            />
            <Controller
              control={control}
              name={"imageUri"}
              render={({ field: { value } }) =>
                value ? (
                  <View>
                    <Image source={{ uri: value }} style={styles.image} />
                    <IconButton
                      icon="close"
                      containerColor={MD3Colors.tertiary99}
                      onPress={handleRemoveImage}
                      style={styles.removeIcon}
                    />
                    <View
                      style={{ position: "absolute", bottom: 10, right: 10 }}
                    >
                      <Button.NarrativeInput
                        onChange={concatContent}
                        location={watch().location?.fullAddress}
                        date={watch().date}
                        imageUrl={value}
                      />
                    </View>
                  </View>
                ) : (
                  <></>
                )
              }
            />
          </View>
          <View style={styles.buttonGroup}>
            <Controller
              control={control}
              name={"imageUri"}
              render={({ field: { onChange } }) => (
                <View style={styles.button}>
                  <Button.ImageInput onChange={onChange} />
                </View>
              )}
            />
            <Controller
              control={control}
              name={"location"}
              render={({ field: { value, onChange } }) => (
                <View style={styles.button}>
                  <Button.LocationInput
                    initialLocation={value}
                    onChange={onChange}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={"imageUri"}
              render={({ field: { onChange } }) => (
                <View style={styles.button}>
                  <Button.CameraInput onChange={onChange} />
                </View>
              )}
            />
            <Controller
              control={control}
              name={"weather"}
              render={({ field: { value, onChange } }) => (
                <View style={styles.button}>
                  <Button.WeatherInput
                    weather={value}
                    onChange={onChange}
                    location={watch().location}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={"mood"}
              render={({ field: { value, onChange } }) => {
                return (
                  <View style={styles.button}>
                    <Button.MoodInput mood={value} onChange={onChange} />
                  </View>
                );
              }}
            />
          </View>
          <Modal visible={isLoading} dismissable={false}>
            <ActivityIndicator animating={isLoading} size="large" />
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  removeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    marginHorizontal: 10,
  },
});
