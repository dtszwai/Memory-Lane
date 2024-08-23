import { LogCloud, LogLocal } from "../constants";

export const removeNilValues = <T>(obj: T): T => {
  if (
    obj === null ||
    obj === undefined ||
    typeof obj !== "object" ||
    obj instanceof Date
  )
    return obj;

  return Object.entries(obj)
    .filter(([_, v]) => ![undefined, null, ""].includes(v))
    .reduce(
      (r, [key, value]) => ({ ...r, [key]: removeNilValues(value) }),
      {} as T,
    );
};

export const convertCloudToLocal = (item: LogCloud) => {
  return {
    ...item,
    lastUpdated: item.lastUpdated.toDate(),
    data: { ...item.data, date: item.data.date.toDate() },
  };
};

export const mergeLogs = async (
  localLogs: Map<string, LogLocal>,
  cloudLogs: Map<string, LogCloud> | null,
) => {
  if (!cloudLogs) return localLogs;

  const parsedCloudLogs = await Promise.all(
    Array.from(cloudLogs.entries()).map(async ([key, cloudLog]) => {
      const local = convertCloudToLocal(cloudLog);
      return [key, local] as [string, LogLocal];
    }),
  );

  const mergedLogs = new Map<string, LogLocal>([...localLogs]);

  for (const [key, cloudLog] of parsedCloudLogs) {
    const localLog = mergedLogs.get(key);
    if (!localLog || cloudLog.lastUpdated > localLog.lastUpdated) {
      mergedLogs.set(key, cloudLog);
    }
  }

  return mergedLogs;
};
