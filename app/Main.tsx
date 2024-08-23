import { useMemo, useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, useTheme } from "react-native-paper";
import { router, useNavigation } from "expo-router";
import { ItemsList } from "../src/components/log";
import { GroupMenu } from "@/src/components/input";
import { LogContext } from "@/src/context";
import { GroupByFunction, groupByMonth } from "@/src/utils";
import { useMenu } from "@/src/hooks";
import { LogLocal } from "@/src/constants";

export default function MainScreen() {
  const [selectedGroup, setSelectedGroup] = useState(() => groupByMonth);
  const { state } = useContext(LogContext);
  const navigation = useNavigation();
  const { isMenuOpen, menuAnchor, onMenuPress, closeMenu } = useMenu();
  const { colors } = useTheme();

  const sortedData = useMemo(
    () => selectedGroup(state),
    [selectedGroup, state],
  );

  const onFilter = useCallback(
    (groupBy: GroupByFunction<LogLocal>) => {
      setSelectedGroup(() => groupBy);
      closeMenu();
    },
    [closeMenu],
  );

  const renderHeaderLeft = useCallback(
    () => (
      <IconButton icon="cog-outline" onPress={() => router.push("/Profile")} />
    ),
    [],
  );

  const renderHeaderRight = useCallback(
    () => <IconButton icon="filter-outline" onPress={onMenuPress} />,
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      title: "Memory Lane",
      headerTitleAlign: "center",
      headerLeft: renderHeaderLeft,
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ItemsList data={sortedData} />
      <View style={styles.bottomContainer}>
        <FAB
          icon="plus"
          animated
          style={styles.fabStyle}
          onPress={() => router.push("/(logs)/LogForm")}
        />
      </View>
      <GroupMenu
        visible={isMenuOpen}
        anchor={menuAnchor}
        onDismiss={closeMenu}
        onFilter={onFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: "center",
  },
  fabStyle: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: 50,
  },
});
