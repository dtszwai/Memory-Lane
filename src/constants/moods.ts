export const moods = ["Star", "Happy", "Neutral", "Sad", "Angry"] as const;

export type Mood = (typeof moods)[number];

export const moodMap: Record<Mood, string> = {
  Star: "🤩",
  Happy: "😊",
  Neutral: "🙂",
  Sad: "😕",
  Angry: "😡",
};
