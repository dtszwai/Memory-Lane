import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  Alert,
  ScrollView,
  Share,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { IconButton, Snackbar, MD2Colors } from "react-native-paper";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { LogContext } from "@/src/context";
import { useComment } from "@/src/hooks";
import Colors from "@/src/constants/Colors";
import NotFoundScreen from "@/app/+not-found";
import { auth } from "@/src/firebase";
import { CommentsList, LogCard } from "../../src/components/log";
import { CommentInput } from "@/src/components/input";

export default function LogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, deleteLog, toggleFavorite, togglePublic } =
    useContext(LogContext);
  const item = state.get(id);
  if (!item) return <NotFoundScreen />;
  const { data } = item;

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].text;
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { comments, errorMsg, sendComment, isLoading } = useComment({
    logId: id,
    ownerId: auth.currentUser?.uid ?? "",
  });
  const viewRef = useRef<View>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: data.date.toDateString(),
      headerLeft: renderLeftActions,
      headerRight: renderRightActions,
    });
  }, [data]);

  const renderLeftActions = useCallback(
    () => (
      <IconButton
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        iconColor={iconColor}
      />
    ),
    [],
  );

  const setPrivate = useCallback(async () => {
    Alert.alert(
      "Set Private",
      "Do you want to set this entry private? People with the code will no longer be able to view it.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await togglePublic(id);
              setSnackbarMessage("Log is now private");
            } catch (error) {
              setSnackbarMessage("Failed to update the entry");
            } finally {
              setSnackbarVisible((_) => true);
            }
          },
        },
      ],
    );
  }, [id]);

  const renderRightActions = useCallback(
    () => (
      <>
        {item.isPublic && (
          <IconButton icon="lock" onPress={setPrivate} iconColor={iconColor} />
        )}
        <IconButton
          icon={data.isFavorite ? "heart" : "heart-outline"}
          onPress={handleFavoritePress}
          iconColor={data.isFavorite ? MD2Colors.red300 : undefined}
        />
      </>
    ),
    [data],
  );

  const handleFavoritePress = useCallback(async () => {
    try {
      await toggleFavorite(id);
      setSnackbarMessage(
        data.isFavorite ? "Removed from favorites" : "Added to favorites",
      );
    } catch (error) {
      setSnackbarMessage("Failed to update the entry");
    }
    setSnackbarVisible((_) => true);
  }, [id, data]);

  const handleDeletePress = useCallback(() => {
    Alert.alert("Delete", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLog(id);
            navigation.goBack();
          } catch (error) {
            setSnackbarVisible((_) => true);
            setSnackbarMessage("Failed to delete the entry");
          }
        },
      },
    ]);
  }, [id, data]);

  const handleExportPress = useCallback(async () => {
    if (viewRef.current) {
      try {
        const uri = await captureRef(viewRef, {
          fileName: `log-${data.date.toISOString()}.png`,
        });
        await Sharing.shareAsync(uri);
      } catch (error) {
        Alert.alert("Failed to export the entry");
      }
    }
  }, [viewRef, data]);

  const sharePublicId = useCallback(async () => {
    try {
      await Share.share({ message: `${item.publicId}` });
    } catch (error) {
      setSnackbarVisible((_) => true);
      setSnackbarMessage("Failed to share the entry");
    }
  }, [item]);

  const handleSharePress = useCallback(async () => {
    if (!item.isPublic) {
      Alert.alert(
        "Share This Log?",
        "Would you like to make this entry public to share it with others?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                await togglePublic(id);
                setSnackbarMessage("Log is now public");
              } catch (error) {
                setSnackbarMessage("Failed to update the entry");
              } finally {
                setSnackbarVisible((_) => true);
              }
            },
          },
        ],
      );
    } else {
      sharePublicId();
    }
  }, [item]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          onStartShouldSetResponder={() => true}
        >
          <View ref={viewRef} collapsable={false}>
            <LogCard data={data} />
          </View>
          <CommentsList
            isLoading={isLoading}
            comments={comments}
            errorMessage={errorMsg}
          />
        </ScrollView>
        <View>
          <CommentInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmit={sendComment}
            disabled={isLoading}
          />
          <View style={styles.buttonGroup}>
            <IconButton
              icon="pencil"
              iconColor={iconColor}
              size={20}
              onPress={() =>
                router.push({ pathname: "/LogForm", params: { id } })
              }
            />
            <IconButton
              icon="share"
              onPress={handleSharePress}
              iconColor={iconColor}
              size={20}
            />
            <IconButton
              icon="download"
              onPress={handleExportPress}
              iconColor={iconColor}
              size={20}
            />
            <IconButton
              icon="delete"
              onPress={handleDeletePress}
              iconColor={iconColor}
              size={20}
            />
          </View>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
