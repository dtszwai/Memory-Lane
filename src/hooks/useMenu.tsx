import { useState } from "react";
import { GestureResponderEvent } from "react-native";

export default function useMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const onMenuPress = (e: GestureResponderEvent) => {
    setMenuAnchor({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
    openMenu();
  };

  return {
    isMenuOpen,
    menuAnchor,
    onMenuPress,
    closeMenu,
    openMenu,
  };
}
