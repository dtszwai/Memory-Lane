import {
  collectionNames,
  LogCloud,
  LogLocal,
  paths,
  subCollectionNames,
} from "../constants";
import {
  auth,
  deleteData,
  getData,
  getSingleDoc,
  getStorageUrl,
  storage,
  updateData,
  writeData,
  writeDataWithId,
} from "../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { convertCloudToLocal } from "../utils";
import { Timestamp } from "firebase/firestore";

const CloudStorage = (() => {
  const getPath = (collection: string = subCollectionNames.ENTRIES) => {
    const userId = auth.currentUser?.uid;
    return userId ? `${collectionNames.USERS}/${userId}/${collection}` : null;
  };

  const uploadImage = async (imageUri: string) => {
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    const imageName = (blob as any)._data.name;
    const imageRef = ref(
      storage,
      paths.userImageFile(auth.currentUser?.uid as string, imageName),
    );
    const uploadResult = await uploadBytesResumable(imageRef, blob);
    return await getStorageUrl(uploadResult.metadata.fullPath);
  };

  const getLog = async (id: string) => {
    const path = getPath();
    if (!path) throw new Error("Authentication required");

    const log = await getSingleDoc<LogCloud>(path, id);
    if (!log) throw new Error("Log not found");
    return convertCloudToLocal(log);
  };

  const getLogs = async (): Promise<Map<string, LogLocal>> => {
    const path = getPath();
    if (!path) throw new Error("User must be authenticated");
    const cloudLogs = await getData<LogCloud>(path);
    const mappedLogs = new Map();
    if (!cloudLogs) return mappedLogs;

    cloudLogs.map(async (log) => {
      const localLog = convertCloudToLocal(log);
      mappedLogs.set(localLog.id, localLog);
    });

    return mappedLogs;
  };

  const addLog = async (data: LogLocal) => {
    const path = getPath();
    if (!path) throw new Error("User must be authenticated");
    if (data.data.imageUri) {
      data.data.imageUri = await uploadImage(data.data.imageUri);
    }
    await writeDataWithId(data.id, path, data);
  };

  const deleteLog = async (id: string) => {
    const path = getPath();
    if (!path) throw new Error("User must be authenticated");
    const log = await getSingleDoc<LogCloud>(path, id);
    if (!log) return;
    log.isDeleted = true;
    log.lastUpdated = Timestamp.now();

    await updateData(id, path, log);
    const trashPath = getPath(subCollectionNames.TRASH) as string;
    await writeDataWithId(log.id, trashPath, log);
    await deleteData(id, path);
  };

  const updateLog = async (data: LogLocal) => {
    const path = getPath();
    if (!path) throw new Error("User must be authenticated");
    // upload image if it's a local file
    if (data.data.imageUri && data.data.imageUri.startsWith("file:")) {
      data.data.imageUri = await uploadImage(data.data.imageUri);
    }
    await updateData(data.id, path, data);
  };

  const setPublic = async (id: string) => {
    const path = getPath();
    if (!path) throw new Error("User must be authenticated");
    let log = await getSingleDoc<LogCloud>(path, id);
    if (!log) return;
    if (log.publicId) {
      await updateData(id, path, {
        isPublic: true,
        lastUpdated: Timestamp.now(),
      });
      return log.publicId;
    }
    const detail = { ownerId: auth.currentUser?.uid, logId: id };
    const docId = (await writeData(collectionNames.PUBLIC, detail)) as string;
    const updatedContent = {
      isPublic: true,
      publicId: docId,
      lastUpdated: Timestamp.now(),
    };
    await updateData(id, path, updatedContent);
    return docId;
  };

  const setPrivate = async (id: string) => {
    const path = getPath();
    if (!path) throw new Error("User must be authenticated");
    const log = await getSingleDoc<LogCloud>(path, id);
    if (!log) return;
    if (!log.isPublic) return;
    const updatedContent = {
      isPublic: false,
      lastUpdated: Timestamp.now(),
    };
    await updateData(id, path, updatedContent);
  };

  return {
    getLog,
    getLogs,
    addLog,
    deleteLog,
    updateLog,
    setPublic,
    setPrivate,
    uploadImage,
  };
})();

export default CloudStorage;
