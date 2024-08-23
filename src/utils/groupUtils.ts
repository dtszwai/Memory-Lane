import { LogLocal } from "../constants";
import { monthNames, moodMap, weatherMap } from "../constants";

type Comparator = (a: LogLocal, b: LogLocal) => number;
export type Group<T> = { key: string; entries: T[] };
export type GroupByFunction<T> = (items: Map<string, T>) => Group<T>[];

const sortByDateDescending: Comparator = (a, b) =>
  b.data.date.getTime() - a.data.date.getTime();

const groupBy = (
  items: LogLocal[],
  getKey: (item: LogLocal) => string,
  getSortKey?: (item: LogLocal) => number,
): Group<LogLocal>[] => {
  const groupsMap = items.reduce(
    (groups, item) => {
      const key = getKey(item);
      groups[key] = groups[key] || { key, entries: [] };
      groups[key].entries.push(item);
      return groups;
    },
    {} as Record<string, Group<LogLocal>>,
  );

  const sortedGroups = Object.values(groupsMap).map((group) => ({
    ...group,
    entries: group.entries.sort(sortByDateDescending),
  }));

  if (getSortKey) {
    sortedGroups.sort(
      (a, b) => getSortKey(b.entries[0]) - getSortKey(a.entries[0]),
    );
  }

  return sortedGroups;
};

const moveGroupToEnd = <T>(groups: Group<T>[], key: string): Group<T>[] => {
  const index = groups.findIndex((group) => group.key === key);
  if (index !== -1) {
    const [group] = groups.splice(index, 1);
    groups.push(group);
  }
  return groups;
};

export const groupByMonth: GroupByFunction<LogLocal> = (items) =>
  groupBy(
    Array.from(items.values()),
    (item) =>
      `${monthNames[item.data.date.getMonth()]} ${item.data.date.getFullYear()}`,
    (item) => item.data.date.getTime(),
  );

export const groupByMood: GroupByFunction<LogLocal> = (items) =>
  moveGroupToEnd(
    groupBy(Array.from(items.values()), (item) =>
      item.data.mood ? moodMap[item.data.mood] : "Others",
    ),
    "Others",
  );

export const groupByWeather: GroupByFunction<LogLocal> = (items) =>
  moveGroupToEnd(
    groupBy(Array.from(items.values()), (item) =>
      item.data.weather ? weatherMap[item.data.weather] : "Others",
    ),
    "Others",
  );

export const groupByFavourite: GroupByFunction<LogLocal> = (items) =>
  moveGroupToEnd(
    groupBy(Array.from(items.values()), (item) =>
      item.data.isFavorite ? "Favourites" : "Others",
    ),
    "Others",
  );

export const groupByMonthOldestFirst: GroupByFunction<LogLocal> = (items) =>
  groupByMonth(items).reverse();
