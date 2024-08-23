import { useContext, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Divider, Title, useTheme } from "react-native-paper";
import {
  RefreshControl,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { LogLocal } from "@/src/constants";
import ItemCard from "./ItemCard";
import { LogContext } from "@/src/context";
import { Group } from "@/src/utils";

type ItemsListProps = { data: Group<LogLocal>[] };

export default function ItemsList({ data }: ItemsListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { getLogs } = useContext(LogContext);
  const { colors } = useTheme();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getLogs();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Title style={styles.emptyText}>
        You don't have any logs yet.{"\n"}
        Start creating some memories!
      </Title>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: Group<LogLocal>;
    index: number;
  }) => {
    const isLastItem = index === data.length - 1;
    return item.entries.length > 0 ? (
      <View style={[styles.section, isLastItem && { marginBottom: 100 }]}>
        <Title style={styles.sectionTitle}>{item.key}</Title>
        <Divider style={styles.divider} />
        {item.entries.map((entries) => (
          <ItemCard key={entries.id} item={entries} />
        ))}
      </View>
    ) : null;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.entries[0].id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={colors.background}
          />
        }
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    elevation: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  divider: {
    marginVertical: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: "center",
  },
});
