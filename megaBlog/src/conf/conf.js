const conf = {
  appwriteUrl: String(process.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(process.env.VITE_APPWRITE_PROJECT_ID),
  appwriteCollectionId: String(process.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteDatabaseId: String(process.env.VITE_APPWRITE_DATABASE_ID),
  appwriteBucketID: String(process.env.VITE_APPWRITE_BUCKET_ID)
}

export default conf