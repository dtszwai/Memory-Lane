import { View, StyleSheet } from "react-native";
import { MD3Colors, Text } from "react-native-paper";
import { LogComment } from "@/src/constants";

type CommentItemProps = { comment: LogComment };

const formatDate = (date: Date) => {
  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
};

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(comment.createAt.toDate())}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {comment.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  date: {
    fontSize: 10,
    marginBottom: 2,
    color: MD3Colors.secondary50,
  },
  content: {
    fontSize: 12,
  },
});
