import conf from '../conf/conf';
import {Client,ID,Databases,Storage,Query} from "appwrite";

export class Service{
    client = new Client();
    databases;  
    bucket;
    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)

        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);

    }


    async createPost({title,slug,content,FeaturedImage,status,userId}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,{
                    title,content,
                    
                    FeaturedImage,
                    
                    status,
                    userId,

                }
            )
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", {
                error: error.message,
                stack: error.stack,
                documentId: slug,
                userId: userId,
                title: title,
                status: status,
                FeaturedImage: FeaturedImage,
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollectionId,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to create post: ${error.message}`);
        }
    }
    async updatePost(slug,{title,content,FeaturedImage,status,userId}){
        try {
            return  await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,content,FeaturedImage,status,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", {
                error: error.message,
                stack: error.stack,
                documentId: slug,
                userId: userId,
                title: title,
                status: status,
                FeaturedImage: FeaturedImage,
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollectionId,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to update post: ${error.message}`);
        }
    }
    
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", {
                error: error.message,
                stack: error.stack,
                documentId: slug,
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollectionId,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to delete post: ${error.message}`);
        }
    }

    async getPost(slug){
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug

            )

        }catch (error){
            console.error("Appwrite service :: getPost :: error", {
                error: error.message,
                stack: error.stack,
                documentId: slug,
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollectionId,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to get post: ${error.message}`);
        }
    }
    
    async getPosts(queries=[Query.equal("status","active")]){

        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        }catch(error){
            console.error("Appwrite service :: getPosts :: error", {
                error: error.message,
                stack: error.stack,
                queries: queries,
                databaseId: conf.appwriteDatabaseId,
                collectionId: conf.appwriteCollectionId,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to get posts: ${error.message}`);
        }

    }


    //file upload service

    
    async uploadFile(file){
        const fileId = ID.unique();
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                fileId,
                file
            )


        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", {
                error: error.message,
                stack: error.stack,
                fileId: fileId,
                fileName: file?.name,
                fileSize: file?.size,
                fileType: file?.type,
                bucketId: conf.appwriteBucketID,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }


    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketID,
                fileId

            )
            return true
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", {
                error: error.message,
                stack: error.stack,
                fileId: fileId,
                bucketId: conf.appwriteBucketID,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    getFilePreview(fileId){
        try {
            if (!fileId) {
                console.error("Appwrite service :: getFilePreview :: error", {
                    error: "File ID is required",
                    fileId: fileId,
                    bucketId: conf.appwriteBucketID,
                    timestamp: new Date().toISOString()
                });
                throw new Error("File ID is required for preview");
            }
            
            const previewUrl = this.bucket.getFilePreview(
                conf.appwriteBucketID,
                fileId
            );
            
            console.log("Appwrite service :: getFilePreview :: success", {
                fileId: fileId,
                bucketId: conf.appwriteBucketID,
                previewUrl: previewUrl.toString(),
                timestamp: new Date().toISOString()
            });
            
            return previewUrl;
        } catch (error) {
            console.error("Appwrite service :: getFilePreview :: error", {
                error: error.message,
                stack: error.stack,
                fileId: fileId,
                bucketId: conf.appwriteBucketID,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Failed to generate file preview: ${error.message}`);
        }
    }
}

const service=new Service()

export default service