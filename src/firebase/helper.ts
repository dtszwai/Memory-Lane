import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { auth, database, storage } from "./setup";
import {
  collectionNames,
  LogCloud,
  LogRef,
  LogComment,
  paths,
} from "@/src/constants";
import { convertCloudToLocal } from "@/src/utils";

export const writeData = (path: string, data: any) =>
  addDoc(collection(database, path), data)
    .then((docRef) => docRef.id)
    .catch(console.error);

export const writeDataWithId = (docId: string, path: string, data: any) =>
  setDoc(doc(database, path, docId), data);

export const deleteData = (docId: string, path: string) =>
  deleteDoc(doc(database, path, docId));

export const updateData = (docId: string, path: string, data: any) =>
  updateDoc(doc(database, path, docId), data);

export const getData = <T>(path: string) =>
  getDocs(collection(database, path))
    .then((snapshot) => snapshot.docs.map((doc) => doc.data() as T))
    .catch(console.error);

export const getSingleDoc = <T>(path: string, docId: string) =>
  getDoc(doc(database, path, docId))
    .then((doc) => doc.data() as T)
    .catch(console.error);

export const getStorageUrl = async (path: string) => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};

export const getShareData = async (shareId: string) => {
  try {
    const docSnap = await getDoc(
      doc(database, collectionNames.PUBLIC, shareId),
    );
    if (!docSnap.exists()) {
      throw new Error("No such document!");
    }
    return docSnap.data() as LogRef;
  } catch (error) {
    throw new Error("No such document!");
  }
};

export const getSharedLog = async (ownerId: string, logId: string) => {
  try {
    const path = paths.userEntries(ownerId);
    const logSnap = await getDoc(doc(database, path, logId));
    if (!logSnap.exists()) {
      throw new Error("No such document!");
    }
    const log = logSnap.data() as LogCloud;
    return convertCloudToLocal(log);
  } catch (error) {
    throw new Error("No such document!");
  }
};

export const writeComment = async (
  ownerId: string,
  logId: string,
  content: string,
) => {
  try {
    if (!auth.currentUser) throw new Error("User not signed in.");
    const path = paths.userEntryComments(ownerId, logId);
    const data: LogComment = {
      content,
      createAt: Timestamp.now(),
      createBy: auth.currentUser?.uid,
    };
    return await writeData(path, data);
  } catch (error) {
    throw new Error("Failed to write comment.");
  }
};

export const getComments = async (ownerId: string, logId: string) => {
  const path = paths.userEntryComments(ownerId, logId);
  try {
    return (await getData<LogComment>(path)) || [];
  } catch (error) {
    throw new Error("Failed to fetch comments.");
  }
};
