import { useContext } from "react";
import { useLocalSearchParams } from "expo-router";
import { CreateLogForm } from "@/src/components/forms";
import { LogContext } from "@/src/context";

export default function LogFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useContext(LogContext);
  const item = state.get(id);
  return <CreateLogForm initialData={item} />;
}
