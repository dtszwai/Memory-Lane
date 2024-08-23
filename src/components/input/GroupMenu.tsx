import { Menu } from "react-native-paper";
import {
  groupByFavourite,
  GroupByFunction,
  groupByMonth,
  groupByMonthOldestFirst,
  groupByMood,
  groupByWeather,
} from "@/src/utils";
import { LogLocal } from "@/src/constants";

type ItemFilterProps = {
  visible: boolean;
  onDismiss: () => void;
  anchor: { x: number; y: number };
  onFilter: (groupBy: GroupByFunction<LogLocal>) => void;
};

export default function GroupMenu({
                                    visible,
                                    onDismiss,
                                    anchor,
                                    onFilter,
                                  }: ItemFilterProps) {
  const filterOptions = [
    { title: "Newest First", action: groupByMonth },
    { title: "Oldest First", action: groupByMonthOldestFirst },
    { title: "Group by Mood", action: groupByMood },
    { title: "Group by Weather", action: groupByWeather },
    { title: "Group by Favourite", action: groupByFavourite },
  ];

  return (
    <Menu visible={visible} onDismiss={onDismiss} anchor={anchor}>
      {filterOptions.map((option) => (
        <Menu.Item
          key={option.title}
          onPress={() => onFilter(option.action)}
          title={option.title}
        />
      ))}
    </Menu>
  );
}
