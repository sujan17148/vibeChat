const conf={
    appwriteEndPoint:String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABSE_ID),
    appwriteUserCollectionId:String(import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID),
    appwriteChatCollectionId:String(import.meta.env.VITE_APPWRITE_CHAT_COLLECTION_ID),
    appwriteMessageCollectionId:String(import.meta.env.VITE_APPWRITE_MESSAGE_COLLECTION_ID),
    appwriteProfileBucketId:String(import.meta.env.VITE_APPWRITE_PROFILE_BUCKET_ID)
}

export default conf