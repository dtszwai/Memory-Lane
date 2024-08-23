export const collectionNames = {
  USERS: "users",
  PUBLIC: "public",
  IMAGE: "image",
};

export const subCollectionNames = {
  ENTRIES: "entries",
  TRASH: "trash",
  COMMENTS: "comments",
};

export const paths = {
  publicDoc: (docId: string) => `${collectionNames.PUBLIC}/${docId}`,
  userEntries: (userId: string) =>
    `${collectionNames.USERS}/${userId}/${subCollectionNames.ENTRIES}`,
  userEntryDoc: (userId: string, docId: string) =>
    `${collectionNames.USERS}/${userId}/${subCollectionNames.ENTRIES}/${docId}`,
  userEntryComments: (userId: string, docId: string) =>
    `${collectionNames.USERS}/${userId}/${subCollectionNames.ENTRIES}/${docId}/${subCollectionNames.COMMENTS}`,
  userTrash: (userId: string) =>
    `${collectionNames.USERS}/${userId}/${subCollectionNames.TRASH}`,
  userTrashDoc: (userId: string, docId: string) =>
    `${collectionNames.USERS}/${userId}/${subCollectionNames.TRASH}/${docId}`,
  userImageFile: (userId: string, imageName: string) =>
    `${collectionNames.IMAGE}/${userId}/${imageName}`,
};
