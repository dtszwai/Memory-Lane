import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Mood, moodMap, moods } from "@/src/constants";

type MoodInputProps = {
  mood?: Mood;
  onChange: (mood?: Mood) => void;
};

export default function MoodInput({ mood, onChange }: MoodInputProps) {
  const [selected, setSelected] = useState<Mood | undefined>(mood);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const handleSelect = async (key: string) => {
    if (key === "Remove") {
      setSelected(undefined);
    } else if (moods.includes(key as Mood)) {
      setSelected(key as Mood);
    } else {
      Alert.alert("Error", "Invalid menu option selected");
    }
  };

  return (
    <></>
    // <Menu
    //   placement="top"
    //   selectionMode="single"
    //   className="flex-row"
    //   // @ts-ignore - currentKey is not in the type definition
    //   onSelectionChange={({ currentKey }) => handleSelect(currentKey)}
    //   trigger={({ ...triggerProps }) => {
    //     return (
    //       <Button {...triggerProps} className="bg-current">
    //         {selected ? (
    //           <ButtonText size="lg">{moodMap[selected]}</ButtonText>
    //         ) : (
    //           <MaterialIcons
    //             name="face-retouching-natural"
    //             size={24}
    //             color={iconColor}
    //           />
    //         )}
    //       </Button>
    //     );
    //   }}>
    //   {moods.map((mood) => (
    //     <MenuItem key={mood} textValue={mood} className="min-w-0">
    //       <MenuItemLabel size="sm">{moodMap[mood]}</MenuItemLabel>
    //     </MenuItem>
    //   ))}
    //   <MenuItem key={"Remove"} textValue={"Remove"} className="min-w-0">
    //     <MenuItemLabel size="sm">❌</MenuItemLabel>
    //   </MenuItem>
    // </Menu>
  );
}
