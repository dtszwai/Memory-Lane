import { useCallback } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

type CommentInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

const CommentInput = ({
  value: inputValue,
  onChangeText: setInputValue,
  onSubmit,
  disabled = false,
  placeholder = "Type a comment...",
}: CommentInputProps) => {
  const handleCommentSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    onSubmit(inputValue);
    setInputValue("");
    Keyboard.dismiss();
  }, [inputValue, onSubmit, setInputValue]);

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        style={styles.textInput}
        value={inputValue}
        onChangeText={setInputValue}
        disabled={disabled}
        autoCapitalize="none"
        autoComplete="off"
        returnKeyType="send"
        onSubmitEditing={handleCommentSubmit}
        placeholder={placeholder}
        right={
          <TextInput.Icon
            icon="send"
            onPress={handleCommentSubmit}
            disabled={!inputValue.trim() || disabled}
          />
        }
      />
    </View>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  textInput: {
    width: "100%",
    height: 40,
    alignSelf: "center",
    margin: 10,
    borderRadius: 100,
  },
});
