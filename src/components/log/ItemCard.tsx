import { ComponentRef, useContext, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Card,
  Icon,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
  Title,
} from "react-native-paper";
import { router, useNavigation } from "expo-router";
import {
  Pressable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { LogLocal, moodMap } from "@/src/constants";
import { LogContext } from "@/src/context";

type ItemCardProps = { item: LogLocal };

export default function ItemCard({ item }: ItemCardProps) {
  const swipeableRef = useRef<ComponentRef<typeof Swipeable>>(null);
  const { deleteLog, toggleFavorite } = useContext(LogContext);
  const navigation = useNavigation();
  const { id, data } = item;
  const date = data.date.getDate();
  const dayOfWeek = data.date.toLocaleDateString("en-US", { weekday: "short" });

  useEffect(() => navigation.addListener("blur", closeSwipeable), [navigation]);

  const closeSwipeable = () => swipeableRef.current?.close();

  const deleteItem = () => {
    Alert.alert("Delete Log", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteLog(id),
      },
    ]);
  };

  const renderLeftActions = () => (
    <View style={styles.leftActionsContainer}>
      <IconButton
        icon={data.isFavorite ? "heart" : "heart-outline"}
        size={30}
        iconColor={data.isFavorite ? MD2Colors.red300 : undefined}
        onPress={() => {
          toggleFavorite(id);
          closeSwipeable();
        }}
      />
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.rightActionsContainer}>
      <IconButton
        icon="pen"
        size={30}
        onPress={() => router.push({ pathname: "/LogForm", params: { id } })}
      />
      <IconButton icon="delete" size={30} onPress={deleteItem} />
    </View>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        leftThreshold={10}
        rightThreshold={40}
        friction={2}
      >
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/LogDetail",
              params: { id: item.id },
            })
          }
          style={styles.pressable}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.dayText}>{dayOfWeek}</Text>
              </View>
              <View style={styles.titleContainer}>
                <Title style={styles.titleText}>{data.title}</Title>
              </View>
              <View style={styles.moodContainer}>
                {data.mood && (
                  <Text style={styles.moodText}>{moodMap[data.mood]}</Text>
                )}
              </View>
            </Card.Content>
            <View style={styles.label}>
              {data.isFavorite && (
                <Icon source="heart" size={24} color={MD2Colors.red300} />
              )}
            </View>
          </Card>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  pressable: {
    height: 90,
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  dateContainer: {
    alignItems: "center",
    minWidth: 50,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dayText: {
    fontSize: 14,
    color: MD3Colors.secondary50,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  moodContainer: {
    minWidth: 50,
    alignItems: "center",
  },
  moodText: {
    fontSize: 30,
  },
  label: {
    position: "absolute",
    right: 10,
    top: -10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rightActionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  leftActionsContainer: {
    justifyContent: "center",
    width: 70,
    marginLeft: 10,
  },
});
