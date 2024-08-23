import { useCallback, useEffect, useState } from "react";
import { auth, database, getShareData, writeComment } from "../firebase";
import { LogComment, LogRef, paths } from "../constants";
import { collection, onSnapshot } from "firebase/firestore";

type Props = string | { logId: string; ownerId: string };

const sortComments = (comments: LogComment[]) =>
  comments.sort((a, b) => a.createAt.toMillis() - b.createAt.toMillis());

const useComment = (props: Props) => {
  const [comments, setComments] = useState<LogComment[]>([]);
  const [shareData, setShareData] = useState<LogRef>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const sendComment = useCallback(
    async (content: string) => {
      if (!content.trim() || !shareData || !auth.currentUser) return;
      const { ownerId, logId } = shareData;
      try {
        await writeComment(ownerId, logId, content);
      } catch (error) {
        setErrorMsg("Failed to send comment.");
      }
    },
    [shareData],
  );

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      const resolvedShareData =
        typeof props === "string" ? await getShareData(props) : props;
      setShareData(resolvedShareData);
      const unsubscribe = onSnapshot(
        collection(
          database,
          paths.userEntryComments(
            resolvedShareData.ownerId,
            resolvedShareData.logId,
          ),
        ),
        (snapshot) => {
          if (snapshot.empty) return setIsLoading(false);
          const logs = snapshot.docs.map((doc) => doc.data() as LogComment);
          setComments(sortComments(logs));
          setIsLoading(false);
        },
      );

      return unsubscribe;
    };
    const unsubscribePromise = fetchAndSubscribe();
    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, []);

  return { comments, shareData, errorMsg, isLoading, sendComment };
};

export default useComment;
