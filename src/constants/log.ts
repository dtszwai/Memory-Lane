import { Timestamp } from "firebase/firestore";
import { Location, Weather, Mood } from "./index";

export type Log = {
  title: string;
  content?: string;
  imageUri?: string;
  weather?: Weather;
  location?: Location;
  mood?: Mood;
  date: Date;
  isFavorite?: boolean;
};

export type LogLocal = {
  data: Log;
  id: string;
  lastUpdated: Date;
  isDeleted?: boolean;
} & (
  | { isPublic: true; publicId: string }
  | { isPublic?: false; publicId?: string }
);

type WithTimestamp<T> = {
  [P in keyof T]: T[P] extends Date ? Timestamp : T[P];
};

export type LogCloud = {
  data: WithTimestamp<Log>;
  id: string;
  lastUpdated: Timestamp;
  isDeleted?: boolean;
} & (
  | { isPublic: true; publicId: string }
  | { isPublic?: false; publicId?: string }
);

export type LogRef = {
  ownerId: string;
  logId: string;
};

export type LogComment = {
  content: string;
  createAt: Timestamp;
  createBy: string;
};
