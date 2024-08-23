import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Mood, moodMap, moods } from "@/src/constants";
import { useMenu } from "@/src/hooks";
import { IconButton, Menu, Text } from "react-native-paper";

type MoodInputProps = {
  mood?: Mood;
  onChange: (mood?: Mood) => void;
};

export default function MoodInput({ mood, onChange }: MoodInputProps) {
  const [selected, setSelected] = useState<Mood | undefined>(mood);
  const { isMenuOpen, closeMenu, openMenu } = useMenu();

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const handleSelect = async (key: Mood | "Remove") => {
    switch (key) {
      case "Remove":
        setSelected(undefined);
        break;
      default:
        if (moods.includes(key)) {
          setSelected(key);
        } else {
          Alert.alert("Error", "Invalid Mood selected");
        }
    }
    closeMenu();
  };

  return (
    <Menu
      visible={isMenuOpen}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon={
            selected
              ? () => <Text style={{ fontSize: 24 }}>{moodMap[selected]}</Text>
              : "face-man-shimmer"
          }
          onPress={openMenu}
        />
      }
      anchorPosition="top"
      contentStyle={{ flexDirection: "row" }}
    >
      {moods.map((mood) => (
        <Menu.Item
          key={mood}
          onPress={() => handleSelect(mood)}
          title={moodMap[mood]}
          style={styles.menuItem}
          contentStyle={styles.menuItem}
        />
      ))}
      <Menu.Item
        onPress={() => handleSelect("Remove")}
        title="❌"
        style={styles.menuItem}
        contentStyle={styles.menuItem}
      />
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    alignItems: "center",
    maxWidth: 30,
    minWidth: 30,
    height: 30,
    paddingHorizontal: 0,
  },
});
