import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { IconButton, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import NotFoundScreen from "@/app/+not-found";
import { getShareData, getSharedLog } from "@/src/firebase";
import { LogLocal } from "@/src/constants";
import { useComment } from "@/src/hooks";
import { LogCard, CommentsList } from "../../src/components/log";
import { CommentInput } from "@/src/components/input";

export default function LogShareScreen() {
  const { shareId } = useLocalSearchParams<{ shareId: string }>();
  const navigation = useNavigation();
  const {
    comments,
    errorMsg,
    isLoading: isCommentLoading,
    sendComment,
  } = useComment(shareId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const viewRef = useRef<View>(null);
  const [item, setItem] = useState<LogLocal>();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { ownerId, logId } = await getShareData(shareId);
        const log = await getSharedLog(ownerId, logId);
        log && setItem(log);
      } catch (error) {
        console.error("Failed to fetch log:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.data.date.toDateString(),
        headerLeft: () => (
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        ),
      });
    }
  }, [item, navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator animating={isLoading} style={{ flex: 1 }} />
      </View>
    );
  }
  if (!item) return <NotFoundScreen />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View ref={viewRef} collapsable={false}>
            <LogCard data={item.data} />
          </View>
          <CommentsList
            comments={comments}
            isLoading={isCommentLoading}
            errorMessage={errorMsg}
          />
          <CommentInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmit={sendComment}
            disabled={isCommentLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
});
