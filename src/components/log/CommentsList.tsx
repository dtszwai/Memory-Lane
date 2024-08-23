import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, HelperText } from "react-native-paper";
import CommentItem from "./CommentItem";
import { LogComment } from "@/src/constants";

type CommentsListProps = {
  comments: LogComment[];
  isLoading?: boolean;
  errorMessage?: string;
};

export default function CommentsList({
  comments,
  isLoading,
  errorMessage,
}: CommentsListProps) {
  if (errorMessage)
    return (
      <View style={styles.center}>
        <HelperText type="error">{errorMessage}</HelperText>
      </View>
    );

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );

  if (!comments.length)
    return (
      <View style={styles.center}>
        <HelperText type="info">No comments yet</HelperText>
      </View>
    );

  return (
    <ScrollView>
      <Card style={styles.container}>
        <Card.Content>
          {comments.map((comment) => (
            <CommentItem
              key={`${comment.createBy}@${comment.createAt}`}
              comment={comment}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    elevation: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
