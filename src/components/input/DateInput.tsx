import React, { useState } from "react";
import { Keyboard, Platform, StyleSheet } from "react-native";
import { Modal, Portal, useTheme, Text } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type DateInputProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function DateInput({ value, onChange }: DateInputProps) {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    Keyboard.dismiss();
    setShowPicker((prev) => !prev);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(false);
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <>
      <Portal>
        {Platform.OS === "ios" && (
          <Modal
            visible={showPicker}
            onDismiss={togglePicker}
            contentContainerStyle={[
              styles.modal,
              { backgroundColor: theme.colors.secondaryContainer },
            ]}>
            <DateTimePicker
              value={value}
              mode="date"
              maximumDate={new Date()}
              display="inline"
              onChange={handleDateChange}
            />
          </Modal>
        )}
      </Portal>

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          maximumDate={new Date()}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text onPress={togglePicker}>{value.toDateString()}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
});
